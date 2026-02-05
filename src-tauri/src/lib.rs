use std::collections::HashSet;
use std::path::{Path, PathBuf};
use tauri_plugin_shell::ShellExt;
use walkdir::WalkDir;

#[derive(serde::Serialize)]
struct ScannedApp {
  name: String,
  launch: String,
}

#[tauri::command]
fn open_external(app: tauri::AppHandle, url: String) -> Result<(), String> {
  app
    .shell()
    .open(url, None)
    .map_err(|e| e.to_string())
}

#[tauri::command]
fn scan_desktop_apps() -> Vec<ScannedApp> {
  #[cfg(not(windows))]
  {
    Vec::new()
  }

  #[cfg(windows)]
  {
    fn path_to_file_url(path: &Path) -> String {
      let s = path.to_string_lossy().replace('\\', "/");
      format!("file:///{}", s)
    }

    let mut roots: Vec<PathBuf> = Vec::new();
    if let Ok(appdata) = std::env::var("APPDATA") {
      roots.push(
        PathBuf::from(appdata)
          .join("Microsoft")
          .join("Windows")
          .join("Start Menu")
          .join("Programs"),
      );
    }
    if let Ok(programdata) = std::env::var("PROGRAMDATA") {
      roots.push(
        PathBuf::from(programdata)
          .join("Microsoft")
          .join("Windows")
          .join("Start Menu")
          .join("Programs"),
      );
    }

    let mut out: Vec<ScannedApp> = Vec::new();
    let mut seen: HashSet<String> = HashSet::new();

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
        let key = format!("{}|{}", name, launch);
        if seen.insert(key) {
          out.push(ScannedApp { name, launch });
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
    .setup(|app| {
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
    .invoke_handler(tauri::generate_handler![open_external, scan_desktop_apps])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
