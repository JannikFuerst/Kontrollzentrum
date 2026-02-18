use std::collections::{HashMap, HashSet};
use std::path::{Path, PathBuf};
use std::process::Command;
use std::sync::Mutex;
use base64::Engine;
use tauri::Manager;
use tauri_plugin_shell::ShellExt;
use walkdir::WalkDir;
use tauri_plugin_global_shortcut::{Builder as GlobalShortcutBuilder, GlobalShortcutExt, ShortcutState as HotkeyState};

#[derive(serde::Serialize)]
struct ScannedApp {
  name: String,
  launch: String,
  icon: Option<String>,
}

struct ShortcutState(Mutex<Option<String>>);

#[tauri::command]
fn open_external(app: tauri::AppHandle, url: String) -> Result<(), String> {
  app
    .shell()
    .open(url, None)
    .map_err(|e| e.to_string())
}

#[tauri::command]
fn set_window_icon(app: tauri::AppHandle, data_url: String) -> Result<(), String> {
  let b64 = if let Some(idx) = data_url.find(',') {
    &data_url[(idx + 1)..]
  } else {
    data_url.as_str()
  };
  let bytes = base64::engine::general_purpose::STANDARD
    .decode(b64)
    .map_err(|e| e.to_string())?;
  let img = image::load_from_memory(&bytes).map_err(|e| e.to_string())?;
  let rgba = img.to_rgba8();
  let width = rgba.width();
  let height = rgba.height();
  let icon = tauri::image::Image::new_owned(rgba.into_raw(), width, height);
  if let Some(w) = app.get_webview_window("main") {
    w.set_icon(icon).map_err(|e| e.to_string())?;
  }
  Ok(())
}

#[tauri::command]
fn get_clipboard_text() -> Result<Option<String>, String> {
  let mut clipboard = arboard::Clipboard::new().map_err(|e| e.to_string())?;
  match clipboard.get_text() {
    Ok(text) => {
      if text.trim().is_empty() {
        Ok(None)
      } else {
        Ok(Some(text))
      }
    }
    Err(arboard::Error::ContentNotAvailable) => Ok(None),
    Err(e) => Err(e.to_string()),
  }
}

#[tauri::command]
fn set_clipboard_text(text: String) -> Result<(), String> {
  let mut clipboard = arboard::Clipboard::new().map_err(|e| e.to_string())?;
  clipboard.set_text(text).map_err(|e| e.to_string())
}

#[tauri::command]
fn scan_desktop_apps() -> Vec<ScannedApp> {
  #[cfg(not(windows))]
  {
    Vec::new()
  }

  #[cfg(windows)]
  {
    use base64::Engine;
    use image::ImageEncoder;
    use windows::core::{Interface, PCWSTR};
    use windows::Win32::Foundation::HWND;
    use windows::Win32::Graphics::Gdi::{
      DeleteObject, GetDC, GetDIBits, GetObjectW, ReleaseDC, BITMAP, BITMAPINFO, BITMAPINFOHEADER,
      BI_RGB, DIB_RGB_COLORS,
    };
    use windows::Win32::Storage::FileSystem::FILE_FLAGS_AND_ATTRIBUTES;
    use windows::Win32::Storage::FileSystem::WIN32_FIND_DATAW;
    use windows::Win32::System::Com::{
      CoCreateInstance, CoInitializeEx, CoUninitialize, IPersistFile, STGM, CLSCTX_INPROC_SERVER,
      COINIT_APARTMENTTHREADED,
    };
    use windows::Win32::UI::Shell::{
      ExtractIconExW, IShellLinkW, ShellLink, SHGetFileInfoW, SHFILEINFOW, SHGFI_ICON,
      SHGFI_ICONLOCATION, SHGFI_LARGEICON,
    };
    use windows::Win32::UI::WindowsAndMessaging::{DestroyIcon, GetIconInfo, HICON, ICONINFO};

    fn path_to_file_url(path: &Path) -> String {
      let s = path.to_string_lossy().replace('\\', "/");
      format!("file:///{}", s)
    }

    fn to_wide(s: &str) -> Vec<u16> {
      let mut v: Vec<u16> = s.encode_utf16().collect();
      v.push(0);
      v
    }

    fn wide_buf_to_string(buf: &[u16]) -> String {
      let end = buf.iter().position(|&c| c == 0).unwrap_or(buf.len());
      String::from_utf16_lossy(&buf[..end])
    }

    fn icon_to_data_url(hicon: HICON) -> Option<String> {
      unsafe {
        let mut info = ICONINFO::default();
        if GetIconInfo(hicon, &mut info).is_err() {
          return None;
        }
        if info.hbmColor.0.is_null() {
          if !info.hbmMask.0.is_null() {
            let _ = DeleteObject(info.hbmMask);
          }
          return None;
        }

        let mut bmp = BITMAP::default();
        if GetObjectW(info.hbmColor, std::mem::size_of::<BITMAP>() as i32, Some(&mut bmp as *mut _ as _))
          == 0
        {
          let _ = DeleteObject(info.hbmColor);
          if !info.hbmMask.0.is_null() {
            let _ = DeleteObject(info.hbmMask);
          }
          return None;
        }

        let width = bmp.bmWidth as i32;
        let height = bmp.bmHeight as i32;
        if width <= 0 || height <= 0 {
          let _ = DeleteObject(info.hbmColor);
          if !info.hbmMask.0.is_null() {
            let _ = DeleteObject(info.hbmMask);
          }
          return None;
        }

        let mut buf = vec![0u8; (width * height * 4) as usize];
        let mut bmi = BITMAPINFO {
          bmiHeader: BITMAPINFOHEADER {
            biSize: std::mem::size_of::<BITMAPINFOHEADER>() as u32,
            biWidth: width,
            biHeight: -height, // top-down
            biPlanes: 1,
            biBitCount: 32,
            biCompression: BI_RGB.0 as u32,
            biSizeImage: 0,
            biXPelsPerMeter: 0,
            biYPelsPerMeter: 0,
            biClrUsed: 0,
            biClrImportant: 0,
          },
          bmiColors: [Default::default()],
        };

        let hdc = GetDC(HWND(std::ptr::null_mut()));
        if hdc.0.is_null() {
          let _ = DeleteObject(info.hbmColor);
          if !info.hbmMask.0.is_null() {
            let _ = DeleteObject(info.hbmMask);
          }
          return None;
        }

        let scan = GetDIBits(
          hdc,
          info.hbmColor,
          0,
          height as u32,
          Some(buf.as_mut_ptr() as *mut _),
          &mut bmi,
          DIB_RGB_COLORS,
        );
        let _ = ReleaseDC(HWND(std::ptr::null_mut()), hdc);

        let _ = DeleteObject(info.hbmColor);
        if !info.hbmMask.0.is_null() {
          let _ = DeleteObject(info.hbmMask);
        }

        if scan == 0 {
          return None;
        }

        // BGRA -> RGBA
        for px in buf.chunks_exact_mut(4) {
          let b = px[0];
          let r = px[2];
          px[0] = r;
          px[2] = b;
        }

        let img = match image::RgbaImage::from_raw(width as u32, height as u32, buf) {
          Some(i) => i,
          None => return None,
        };
        let mut png = Vec::new();
        let encoder = image::codecs::png::PngEncoder::new(&mut png);
        if encoder
          .write_image(img.as_raw(), img.width(), img.height(), image::ColorType::Rgba8.into())
          .is_err()
        {
          return None;
        }
        let b64 = base64::engine::general_purpose::STANDARD.encode(png);
        Some(format!("data:image/png;base64,{}", b64))
      }
    }

    fn icon_from_path(path: &Path) -> Option<String> {
      let wide = to_wide(&path.to_string_lossy());
      let mut info = SHFILEINFOW::default();
      let res = unsafe {
        SHGetFileInfoW(
          PCWSTR(wide.as_ptr()),
          FILE_FLAGS_AND_ATTRIBUTES(0),
          Some(&mut info),
          std::mem::size_of::<SHFILEINFOW>() as u32,
          SHGFI_ICON | SHGFI_LARGEICON,
        )
      };
      if res == 0 || info.hIcon.0.is_null() {
        return None;
      }
      let data = icon_to_data_url(info.hIcon);
      unsafe { let _ = DestroyIcon(info.hIcon); };
      data
    }

    fn extract_icon_from_location(icon_path: &str, icon_index: i32) -> Option<String> {
      if icon_path.trim().is_empty() {
        return None;
      }
      let icon_path_wide = to_wide(icon_path);
      let mut large_icon = HICON::default();
      let extracted = unsafe {
        ExtractIconExW(
          PCWSTR(icon_path_wide.as_ptr()),
          icon_index,
          Some(&mut large_icon),
          None,
          1,
        )
      };
      if extracted == 0 || large_icon.0.is_null() {
        return None;
      }
      let data = icon_to_data_url(large_icon);
      unsafe { let _ = DestroyIcon(large_icon); };
      data
    }

    fn shortcut_info(path: &Path) -> Option<(String, i32, String)> {
      unsafe {
        let coinited = CoInitializeEx(None, COINIT_APARTMENTTHREADED).is_ok();
        let shell_link: IShellLinkW =
          CoCreateInstance(&ShellLink, None, CLSCTX_INPROC_SERVER).ok()?;
        let persist: IPersistFile = shell_link.cast().ok()?;
        let wide = to_wide(&path.to_string_lossy());
        if persist.Load(PCWSTR(wide.as_ptr()), STGM(0)).is_err() {
          if coinited {
            CoUninitialize();
          }
          return None;
        }

        let mut icon_buf = [0u16; 1024];
        let mut icon_idx = 0i32;
        let _ = shell_link.GetIconLocation(&mut icon_buf, &mut icon_idx as *mut i32);

        let mut target_buf = [0u16; 1024];
        let mut find_data = WIN32_FIND_DATAW::default();
        let _ = shell_link.GetPath(&mut target_buf, &mut find_data as *mut WIN32_FIND_DATAW, 0);

        let icon_path = wide_buf_to_string(&icon_buf);
        let target_path = wide_buf_to_string(&target_buf);
        if coinited {
          CoUninitialize();
        }
        Some((icon_path, icon_idx, target_path))
      }
    }

    fn icon_from_shortcut(path: &Path) -> Option<String> {
      if let Some((icon_path, icon_idx, target_path)) = shortcut_info(path) {
        if let Some(data) = extract_icon_from_location(&icon_path, icon_idx) {
          return Some(data);
        }
        if !target_path.trim().is_empty() {
          if let Some(data) = icon_from_path(Path::new(target_path.trim())) {
            return Some(data);
          }
        }
      }

      // Legacy fallback: ask shell for icon location from .lnk itself.
      let wide = to_wide(&path.to_string_lossy());
      let mut info = SHFILEINFOW::default();
      let res = unsafe {
        SHGetFileInfoW(
          PCWSTR(wide.as_ptr()),
          FILE_FLAGS_AND_ATTRIBUTES(0),
          Some(&mut info),
          std::mem::size_of::<SHFILEINFOW>() as u32,
          SHGFI_ICONLOCATION,
        )
      };
      if res == 0 {
        return None;
      }

      let icon_path = wide_buf_to_string(&info.szDisplayName);
      if icon_path.is_empty() {
        return None;
      }

      extract_icon_from_location(&icon_path, info.iIcon)
    }

    let mut roots: Vec<PathBuf> = Vec::new();
    if let Ok(appdata) = std::env::var("APPDATA") {
      let ad = PathBuf::from(appdata);
      roots.push(
        ad.join("Microsoft")
          .join("Windows")
          .join("Start Menu")
          .join("Programs"),
      );
      roots.push(
        ad.join("Microsoft")
          .join("Windows")
          .join("Start Menu"),
      );
    }
    if let Ok(programdata) = std::env::var("PROGRAMDATA") {
      let pd = PathBuf::from(programdata);
      roots.push(
        pd.join("Microsoft")
          .join("Windows")
          .join("Start Menu")
          .join("Programs"),
      );
      roots.push(
        pd.join("Microsoft")
          .join("Windows")
          .join("Start Menu"),
      );
    }
    if let Ok(userprofile) = std::env::var("USERPROFILE") {
      roots.push(PathBuf::from(userprofile).join("Desktop"));
    }
    if let Ok(public) = std::env::var("PUBLIC") {
      roots.push(PathBuf::from(public).join("Desktop"));
    }

    let mut out: Vec<ScannedApp> = Vec::new();
    let mut seen_by_name: HashMap<String, usize> = HashMap::new();

    // Prefer Start Menu AppIDs (more stable than .lnk targets)
    for app in scan_start_apps() {
      let key = app.name.to_lowercase();
      if let Some(idx) = seen_by_name.get(&key).copied() {
        if out[idx].icon.is_none() && app.icon.is_some() {
          out[idx].icon = app.icon;
        }
      } else {
        seen_by_name.insert(key, out.len());
        out.push(app);
      }
    }

    for root in roots {
      if !root.exists() {
        continue;
      }
      for entry in WalkDir::new(root).follow_links(false).into_iter().filter_map(Result::ok) {
        if !entry.file_type().is_file() {
          continue;
        }
        let path = entry.path();
        let ext = path
          .extension()
          .and_then(|e| e.to_str())
          .map(|s| s.to_ascii_lowercase())
          .unwrap_or_default();
        if ext != "lnk" && ext != "url" {
          continue;
        }
        let name = path
          .file_stem()
          .and_then(|s| s.to_str())
          .unwrap_or("Unbekannt")
          .to_string();
        let launch = path_to_file_url(path);
        let icon = if ext == "lnk" {
          icon_from_shortcut(path).or_else(|| icon_from_path(path))
        } else {
          None
        };
        let key = name.to_lowercase();
        if let Some(idx) = seen_by_name.get(&key).copied() {
          if out[idx].icon.is_none() && icon.is_some() {
            out[idx].icon = icon;
          }
        } else {
          seen_by_name.insert(key, out.len());
          out.push(ScannedApp { name, launch, icon });
        }
      }
    }

    out.sort_by(|a, b| a.name.to_lowercase().cmp(&b.name.to_lowercase()));
    out
  }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .plugin(tauri_plugin_updater::Builder::new().build())
    .plugin(tauri_plugin_shell::init())
    .plugin(GlobalShortcutBuilder::new().build())
    .manage(ShortcutState(Mutex::new(None)))
    .setup(|_app| {
      if cfg!(debug_assertions) {
        // Logging in dev disabled to keep terminal clean.
        // Uncomment to re-enable:
        // app.handle().plugin(
        //   tauri_plugin_log::Builder::default()
        //     .level(log::LevelFilter::Warn)
        //     .build(),
        // )?;
      }
      Ok(())
    })
    .invoke_handler(tauri::generate_handler![
      open_external,
      scan_desktop_apps,
      set_window_icon,
      set_global_shortcut,
      get_clipboard_text,
      set_clipboard_text
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

#[tauri::command]
fn set_global_shortcut(app: tauri::AppHandle, state: tauri::State<ShortcutState>, shortcut: String) -> Result<(), String> {
  let shortcut = shortcut.trim().to_string();

  let mut guard = state.0.lock().map_err(|_| "lock failed")?;
  let prev = guard.clone();

  if let Some(prev_sc) = prev {
    let _ = app.global_shortcut().unregister(prev_sc.as_str());
  }

  if shortcut.is_empty() {
    *guard = None;
    return Ok(());
  }

  app
    .global_shortcut()
    .on_shortcut(shortcut.as_str(), move |app, _sc, event| {
      if event.state != HotkeyState::Pressed {
        return;
      }
      if let Some(w) = app.get_webview_window("main") {
        let _ = w.is_minimized().map(|min| {
          if min {
            let _ = w.unminimize();
            let _ = w.show();
            let _ = w.set_focus();
            return;
          }
          let _ = w.is_visible().map(|visible| {
            if visible {
              let _ = w.hide();
            } else {
              let _ = w.show();
              let _ = w.set_focus();
            }
          });
        });
      }
    })
    .map_err(|e| e.to_string())?;

  *guard = Some(shortcut);
  Ok(())
}
    fn scan_start_apps() -> Vec<ScannedApp> {
      #[cfg(windows)]
      use std::os::windows::process::CommandExt;

      #[cfg(windows)]
      const CREATE_NO_WINDOW: u32 = 0x08000000;

      let ps_script = r#"
$apps = Get-StartApps
$allPkgs = Get-AppxPackage
$pkgMap = @{}
foreach($p in $allPkgs){
  if($p.PackageFamilyName -and -not $pkgMap.ContainsKey($p.PackageFamilyName)){
    $pkgMap[$p.PackageFamilyName] = $p
  }
}

function Get-IconDataUrlFromAppId([string]$appId){
  if (-not $appId -or -not ($appId -match '^(?<pf>[^!]+)!(?<id>.+)$')) { return $null }
  $pf = $Matches['pf']
  $aid = $Matches['id']
  $pkg = $pkgMap[$pf]
  if (-not $pkg) { return $null }

  $manifest = Get-AppxPackageManifest -Package $pkg.PackageFullName -ErrorAction SilentlyContinue
  if (-not $manifest) { return $null }

  $appNode = $manifest.Package.Applications.Application | Where-Object { $_.Id -eq $aid } | Select-Object -First 1
  if (-not $appNode) { $appNode = $manifest.Package.Applications.Application | Select-Object -First 1 }
  if (-not $appNode) { return $null }

  $logoRel = $null
  if ($appNode.VisualElements) {
    $logoRel = $appNode.VisualElements.Square44x44Logo
    if (-not $logoRel) { $logoRel = $appNode.VisualElements.Square150x150Logo }
  }
  if (-not $logoRel) { return $null }

  $install = $pkg.InstallLocation
  if (-not $install) { return $null }
  $logoRel = ($logoRel -replace '/', '\')
  $base = Join-Path $install $logoRel
  $dir = Split-Path $base -Parent
  $name = [System.IO.Path]::GetFileNameWithoutExtension($base)
  $ext = [System.IO.Path]::GetExtension($base)

  $cands = @()
  if (Test-Path $base) { $cands += Get-Item $base }
  if (Test-Path $dir) {
    $cands += Get-ChildItem -Path $dir -File -Filter ($name + '*' + $ext) -ErrorAction SilentlyContinue
  }
  if (-not $cands -or $cands.Count -eq 0) { return $null }

  $best = $cands | Sort-Object {
    $n = $_.Name.ToLower()
    if ($n -match 'targetsize-256') { 0 }
    elseif ($n -match 'targetsize-128') { 1 }
    elseif ($n -match 'scale-400') { 2 }
    elseif ($n -match 'scale-200') { 3 }
    elseif ($n -match 'scale-150') { 4 }
    elseif ($n -match 'scale-100') { 5 }
    else { 10 }
  } | Select-Object -First 1

  if (-not $best) { return $null }
  $bytes = [System.IO.File]::ReadAllBytes($best.FullName)
  if (-not $bytes -or $bytes.Length -eq 0) { return $null }

  $mime = 'image/png'
  $e = $best.Extension.ToLower()
  if ($e -eq '.jpg' -or $e -eq '.jpeg') { $mime = 'image/jpeg' }
  elseif ($e -eq '.webp') { $mime = 'image/webp' }
  elseif ($e -eq '.bmp') { $mime = 'image/bmp' }

  return ('data:' + $mime + ';base64,' + [Convert]::ToBase64String($bytes))
}

$out = foreach($a in $apps){
  [pscustomobject]@{
    Name = $a.Name
    AppID = $a.AppID
    Icon = (Get-IconDataUrlFromAppId $a.AppID)
  }
}
$out | ConvertTo-Json -Depth 4
"#;

      let output = Command::new("powershell")
        .creation_flags(CREATE_NO_WINDOW)
        .args([
          "-NoProfile",
          "-WindowStyle",
          "Hidden",
          "-Command",
          ps_script,
        ])
        .output();

      let out = match output {
        Ok(o) if o.status.success() => o,
        _ => return Vec::new(),
      };

      let text = String::from_utf8_lossy(&out.stdout);
      if text.trim().is_empty() {
        return Vec::new();
      }

      let parsed: serde_json::Value = match serde_json::from_str(&text) {
        Ok(v) => v,
        Err(_) => return Vec::new(),
      };

      let mut apps = Vec::new();
      let items: Vec<serde_json::Value> = if parsed.is_array() {
        parsed.as_array().cloned().unwrap_or_default()
      } else {
        vec![parsed]
      };

      let mut seen_local: HashSet<String> = HashSet::new();
      for item in items {
        let name = item
          .get("Name")
          .and_then(|v| v.as_str())
          .unwrap_or("")
          .trim()
          .to_string();
        let app_id = item
          .get("AppID")
          .and_then(|v| v.as_str())
          .unwrap_or("")
          .trim()
          .to_string();
        let icon = item
          .get("Icon")
          .and_then(|v| v.as_str())
          .map(|s| s.trim().to_string())
          .filter(|s| !s.is_empty());
        if name.is_empty() || app_id.is_empty() {
          continue;
        }
        let key = name.to_lowercase();
        if !seen_local.insert(key) {
          continue;
        }
        let launch = format!("shell:AppsFolder\\{}", app_id);
        apps.push(ScannedApp { name, launch, icon });
      }

      apps
    }
