use std::collections::{HashMap, HashSet};
use std::path::{Path, PathBuf};
use std::process::Command;
use std::sync::{Arc, Mutex};
use std::time::{Duration, Instant};
use base64::Engine;
use tauri::{Emitter, Manager};
use tauri_plugin_shell::ShellExt;
use tauri_plugin_notification::NotificationExt;
use walkdir::WalkDir;
use tauri_plugin_global_shortcut::{Builder as GlobalShortcutBuilder, GlobalShortcutExt, ShortcutState as HotkeyState};
#[cfg(windows)]
use std::sync::OnceLock;

const APP_SHORTCUT_COOLDOWN_MS: u64 = 900;
const GLOBAL_SHORTCUT_COOLDOWN_MS: u64 = 600;
const QUICK_LAUNCH_SHORTCUT_COOLDOWN_MS: u64 = 350;
const AUTOMATION_SHORTCUT_SCHEME: &str = "kc-automation://";
const AUTOMATION_SHORTCUT_EVENT: &str = "kc://run-automation";
#[cfg(target_os = "macos")]
const QUICK_LAUNCH_SHORTCUT: &str = "Super+Space";
#[cfg(not(target_os = "macos"))]
const QUICK_LAUNCH_SHORTCUT: &str = "Ctrl+Space";
const PROFILE_FILE_NAME: &str = "profile.json";
const SHARED_PROFILE_FILE_NAME: &str = "profile.shared.json";
const PROFILE_SOURCE_META_KEY: &str = "__profile_source";
const RUNNING_PROCESSES_CHANGED_EVENT: &str = "kc://running-processes-changed";

fn default_profile_state() -> serde_json::Value {
  serde_json::json!({
    "kc_apps": [],
    "kc_pinned_order": [],
    "kc_cat_order": {},
    "kc_categories": [],
    "kc_cat_tabs": [],
    "kc_super_categories": [],
    "kc_super_tab_order": [],
    "kc_super_icon_map": {},
    "kc_category_icon_map": {}
  })
}

fn profile_file_path(app: &tauri::AppHandle) -> Result<PathBuf, String> {
  let dir = app.path().app_data_dir().map_err(|e| e.to_string())?;
  std::fs::create_dir_all(&dir).map_err(|e| e.to_string())?;
  Ok(dir.join(PROFILE_FILE_NAME))
}

fn shared_profile_file_path() -> PathBuf {
  PathBuf::from(env!("CARGO_MANIFEST_DIR")).join(SHARED_PROFILE_FILE_NAME)
}

fn with_profile_source(mut state: serde_json::Value, source: &str) -> serde_json::Value {
  if let Some(obj) = state.as_object_mut() {
    obj.insert(
      PROFILE_SOURCE_META_KEY.to_string(),
      serde_json::Value::String(source.to_string()),
    );
  }
  state
}

#[derive(serde::Serialize)]
struct ScannedApp {
  name: String,
  launch: String,
  icon: Option<String>,
  process_name: Option<String>,
}

struct ShortcutState {
  registered: Mutex<Option<String>>,
  last_fired: Arc<Mutex<Option<Instant>>>,
}
struct AppShortcutState {
  registered: Mutex<Vec<String>>,
  last_fired: Arc<Mutex<HashMap<String, Instant>>>,
  pressed: Arc<Mutex<HashSet<String>>>,
}
struct QuickLauncherShortcutState {
  last_fired: Arc<Mutex<Option<Instant>>>,
}

#[derive(serde::Deserialize)]
struct AppShortcutEntry {
  shortcut: String,
  launch: String,
}

#[cfg(windows)]
#[derive(Clone)]
struct MouseShortcutBinding {
  shortcut_key: String,
  launch: String,
  button: MouseShortcutButton,
  ctrl: bool,
  alt: bool,
  shift: bool,
  super_key: bool,
}

#[cfg(windows)]
#[derive(Clone, Copy, PartialEq, Eq)]
enum MouseShortcutButton {
  Left,
  Right,
  Middle,
  X1,
  X2,
}

#[cfg(windows)]
static MOUSE_SHORTCUTS: OnceLock<Arc<Mutex<Vec<MouseShortcutBinding>>>> = OnceLock::new();
#[cfg(windows)]
static MOUSE_SHORTCUTS_PRESSED: OnceLock<Arc<Mutex<HashSet<String>>>> = OnceLock::new();
#[cfg(windows)]
static MOUSE_SHORTCUTS_FIRED: OnceLock<Arc<Mutex<HashMap<String, Instant>>>> = OnceLock::new();
#[cfg(windows)]
static MOUSE_SHORTCUT_APP: OnceLock<tauri::AppHandle> = OnceLock::new();

#[derive(serde::Deserialize)]
struct KeyboardSequenceStep {
  kind: String,
  value: String,
}

#[derive(serde::Deserialize)]
struct MouseSequenceStep {
  kind: String,
  value: String,
}

#[derive(serde::Deserialize)]
struct SystemSequenceStep {
  kind: String,
  value: String,
  amount: Option<i32>,
}

#[derive(Clone, serde::Serialize)]
struct AutomationShortcutEvent {
  id: String,
  phase: String,
}

#[derive(serde::Serialize)]
struct ClipboardPayload {
  kind: String,
  text: Option<String>,
  data_url: Option<String>,
  sig: String,
}

#[cfg(windows)]
fn parse_mouse_shortcut(shortcut: &str, launch: &str) -> Option<MouseShortcutBinding> {
  let mut ctrl = false;
  let mut alt = false;
  let mut shift = false;
  let mut super_key = false;
  let mut button = None;

  for raw_part in shortcut.split('+') {
    let part = raw_part.trim().to_lowercase();
    if part.is_empty() {
      continue;
    }
    match part.as_str() {
      "ctrl" | "control" => ctrl = true,
      "alt" => alt = true,
      "shift" => shift = true,
      "super" | "win" | "meta" | "cmd" | "command" => super_key = true,
      "mouseleft" | "leftmouse" | "lmb" => return None,
      "mouseright" | "rightmouse" | "rmb" => return None,
      "mousemiddle" | "middlemouse" | "mmb" => button = Some(MouseShortcutButton::Middle),
      "mouse4" | "mousex1" | "xbutton1" | "x1" => button = Some(MouseShortcutButton::X1),
      "mouse5" | "mousex2" | "xbutton2" | "x2" => button = Some(MouseShortcutButton::X2),
      _ => return None,
    }
  }

  Some(MouseShortcutBinding {
    shortcut_key: shortcut.trim().to_lowercase(),
    launch: launch.trim().to_string(),
    button: button?,
    ctrl,
    alt,
    shift,
    super_key,
  })
}

#[cfg(windows)]
fn start_mouse_shortcut_hook_thread() {
  std::thread::spawn(|| {
    use windows::Win32::Foundation::{HINSTANCE, LPARAM, LRESULT, WPARAM};
    use windows::Win32::System::LibraryLoader::GetModuleHandleW;
    use windows::Win32::UI::Input::KeyboardAndMouse::{
      GetAsyncKeyState, VK_CONTROL, VK_LWIN, VK_MENU, VK_RWIN, VK_SHIFT,
    };
    use windows::Win32::UI::WindowsAndMessaging::{
      CallNextHookEx, DispatchMessageW, GetMessageW, SetWindowsHookExW, TranslateMessage,
      HHOOK, MSG, MSLLHOOKSTRUCT, WH_MOUSE_LL, WM_LBUTTONDOWN, WM_LBUTTONUP, WM_MBUTTONDOWN,
      WM_MBUTTONUP, WM_RBUTTONDOWN, WM_RBUTTONUP, WM_XBUTTONDOWN, WM_XBUTTONUP,
    };

    unsafe fn modifier_down(vk: i32) -> bool {
      (GetAsyncKeyState(vk) as u16 & 0x8000) != 0
    }

    unsafe fn current_modifiers() -> (bool, bool, bool, bool) {
      (
        modifier_down(VK_CONTROL.0 as i32),
        modifier_down(VK_MENU.0 as i32),
        modifier_down(VK_SHIFT.0 as i32),
        modifier_down(VK_LWIN.0 as i32) || modifier_down(VK_RWIN.0 as i32),
      )
    }

    unsafe extern "system" fn mouse_proc(code: i32, wparam: WPARAM, lparam: LPARAM) -> LRESULT {
      use windows::Win32::UI::WindowsAndMessaging::HC_ACTION;

      if code == HC_ACTION as i32 {
        let message = wparam.0 as u32;
        let info = *(lparam.0 as *const MSLLHOOKSTRUCT);
        let (button, phase) = match message {
          WM_LBUTTONDOWN => (Some(MouseShortcutButton::Left), Some("pressed")),
          WM_LBUTTONUP => (Some(MouseShortcutButton::Left), Some("released")),
          WM_RBUTTONDOWN => (Some(MouseShortcutButton::Right), Some("pressed")),
          WM_RBUTTONUP => (Some(MouseShortcutButton::Right), Some("released")),
          WM_MBUTTONDOWN => (Some(MouseShortcutButton::Middle), Some("pressed")),
          WM_MBUTTONUP => (Some(MouseShortcutButton::Middle), Some("released")),
          WM_XBUTTONDOWN => {
            let hi = ((info.mouseData >> 16) & 0xffff) as u16;
            let button = if hi == 0x0001 {
              Some(MouseShortcutButton::X1)
            } else if hi == 0x0002 {
              Some(MouseShortcutButton::X2)
            } else {
              None
            };
            (button, Some("pressed"))
          }
          WM_XBUTTONUP => {
            let hi = ((info.mouseData >> 16) & 0xffff) as u16;
            let button = if hi == 0x0001 {
              Some(MouseShortcutButton::X1)
            } else if hi == 0x0002 {
              Some(MouseShortcutButton::X2)
            } else {
              None
            };
            (button, Some("released"))
          }
          _ => (None, None),
        };

        if let (Some(button), Some(phase_value)) = (button, phase) {
          let registry = MOUSE_SHORTCUTS.get();
          let app_handle = MOUSE_SHORTCUT_APP.get();
          let pressed_state = MOUSE_SHORTCUTS_PRESSED.get();
          let fired_state = MOUSE_SHORTCUTS_FIRED.get();
          if let (Some(registry), Some(app_handle), Some(pressed_state), Some(fired_state)) =
            (registry, app_handle, pressed_state, fired_state)
          {
            let bindings = match registry.lock() {
              Ok(guard) => guard.clone(),
              Err(_) => Vec::new(),
            };
            let (ctrl, alt, shift, super_key) = current_modifiers();
            for binding in bindings {
              if binding.button != button {
                continue;
              }
              if phase_value == "pressed" &&
                (binding.ctrl != ctrl || binding.alt != alt || binding.shift != shift || binding.super_key != super_key)
              {
                continue;
              }

              if phase_value == "released" {
                let should_emit = match pressed_state.lock() {
                  Ok(mut pressed) => pressed.remove(&binding.shortcut_key),
                  Err(_) => false,
                };
                if !should_emit {
                  continue;
                }
                if let Some(automation_id) = binding.launch.strip_prefix(AUTOMATION_SHORTCUT_SCHEME) {
                  let _ = app_handle.emit_to("main", AUTOMATION_SHORTCUT_EVENT, AutomationShortcutEvent {
                    id: automation_id.to_string(),
                    phase: "released".to_string(),
                  });
                }
                continue;
              }

              let inserted = match pressed_state.lock() {
                Ok(mut pressed) => pressed.insert(binding.shortcut_key.clone()),
                Err(_) => false,
              };
              if !inserted {
                continue;
              }

              if let Some(automation_id) = binding.launch.strip_prefix(AUTOMATION_SHORTCUT_SCHEME) {
                let _ = app_handle.emit_to("main", AUTOMATION_SHORTCUT_EVENT, AutomationShortcutEvent {
                  id: automation_id.to_string(),
                  phase: "pressed".to_string(),
                });
                continue;
              }

              let now = Instant::now();
              let allowed = match fired_state.lock() {
                Ok(mut fired) => {
                  let okay = fired
                    .get(&binding.shortcut_key)
                    .map(|prev| now.saturating_duration_since(*prev) >= Duration::from_millis(APP_SHORTCUT_COOLDOWN_MS))
                    .unwrap_or(true);
                  if okay {
                    fired.insert(binding.shortcut_key.clone(), now);
                  }
                  okay
                }
                Err(_) => false,
              };
              if !allowed {
                continue;
              }
              let _ = app_handle.shell().open(binding.launch.clone(), None);
            }
          }
        }
      }

      unsafe { CallNextHookEx(HHOOK(std::ptr::null_mut()), code, wparam, lparam) }
    }

    unsafe {
      let module = GetModuleHandleW(None).unwrap_or(HINSTANCE(std::ptr::null_mut()).into());
      let hook = match SetWindowsHookExW(WH_MOUSE_LL, Some(mouse_proc), module, 0) {
        Ok(hook) => hook,
        Err(_) => return,
      };
      if hook.0.is_null() {
        return;
      }
      let mut message = MSG::default();
      while GetMessageW(&mut message, None, 0, 0).into() {
        let _ = TranslateMessage(&message);
        let _ = DispatchMessageW(&message);
      }
    }
  });
}

#[tauri::command]
fn open_external(app: tauri::AppHandle, url: String) -> Result<(), String> {
  app
    .shell()
    .open(url, None)
    .map_err(|e| e.to_string())
}

#[tauri::command]
fn show_native_notification(app: tauri::AppHandle, title: String, body: String) -> Result<(), String> {
  app
    .notification()
    .builder()
    .title(&title)
    .body(&body)
    .show()
    .map_err(|e| e.to_string())
}

#[cfg(windows)]
fn get_current_running_process_names() -> Vec<String> {
  use windows::Win32::Foundation::{CloseHandle, INVALID_HANDLE_VALUE};
  use windows::Win32::System::Diagnostics::ToolHelp::{
    CreateToolhelp32Snapshot, Process32FirstW, Process32NextW, PROCESSENTRY32W,
    TH32CS_SNAPPROCESS,
  };

  unsafe {
    let snapshot = match CreateToolhelp32Snapshot(TH32CS_SNAPPROCESS, 0) {
      Ok(handle) => handle,
      Err(_) => return Vec::new(),
    };
    if snapshot == INVALID_HANDLE_VALUE {
      return Vec::new();
    }

    let mut names = HashSet::<String>::new();
    let mut entry = PROCESSENTRY32W::default();
    entry.dwSize = std::mem::size_of::<PROCESSENTRY32W>() as u32;

    if Process32FirstW(snapshot, &mut entry).is_ok() {
      loop {
        let end = entry
          .szExeFile
          .iter()
          .position(|value| *value == 0)
          .unwrap_or(entry.szExeFile.len());
        let process_name = String::from_utf16_lossy(&entry.szExeFile[..end])
          .trim()
          .to_lowercase();
        if !process_name.is_empty() {
          names.insert(process_name);
        }

        if Process32NextW(snapshot, &mut entry).is_err() {
          break;
        }
      }
    }

    let _ = CloseHandle(snapshot);
    let mut out = names.into_iter().collect::<Vec<_>>();
    out.sort_unstable();
    out
  }
}

#[cfg(not(windows))]
fn get_current_running_process_names() -> Vec<String> {
  Vec::new()
}

#[cfg(windows)]
fn start_running_process_watch_thread(app: tauri::AppHandle) {
  std::thread::spawn(move || {
    let mut previous = Vec::<String>::new();
    loop {
      let current = get_current_running_process_names();
      if current != previous {
        previous = current.clone();
        let _ = app.emit_to("main", RUNNING_PROCESSES_CHANGED_EVENT, current);
      }
      std::thread::sleep(Duration::from_millis(1000));
    }
  });
}

#[tauri::command]
fn get_running_process_names() -> Result<Vec<String>, String> {
  Ok(get_current_running_process_names())
}

#[tauri::command]
fn run_keyboard_sequence(steps: Vec<KeyboardSequenceStep>) -> Result<(), String> {
  #[cfg(not(windows))]
  {
    let _ = steps;
    Err("keyboard automation is currently only implemented on Windows".to_string())
  }

  #[cfg(windows)]
  {
    use windows::Win32::UI::Input::KeyboardAndMouse::{
      SendInput, INPUT, INPUT_0, INPUT_KEYBOARD, KEYBDINPUT, KEYEVENTF_KEYUP, VIRTUAL_KEY,
      VK_BACK, VK_CONTROL, VK_DELETE, VK_DOWN, VK_END, VK_ESCAPE, VK_F1, VK_F2, VK_F3, VK_F4,
      VK_F5, VK_F6, VK_F7, VK_F8, VK_F9, VK_F10, VK_F11, VK_F12, VK_HOME, VK_INSERT, VK_LEFT,
      VK_MENU, VK_NEXT, VK_PRIOR, VK_RETURN, VK_RIGHT, VK_SHIFT, VK_SPACE, VK_TAB, VK_UP,
      VK_LWIN,
    };

    fn normalize_token(token: &str) -> String {
      String::from(token)
        .trim()
        .to_uppercase()
        .replace(' ', "")
        .replace("ARROW", "")
    }

    fn key_inputs(vk: u16, key_up: bool) -> INPUT {
      INPUT {
        r#type: INPUT_KEYBOARD,
        Anonymous: INPUT_0 {
          ki: KEYBDINPUT {
            wVk: VIRTUAL_KEY(vk),
            wScan: 0,
            dwFlags: if key_up { KEYEVENTF_KEYUP } else { Default::default() },
            time: 0,
            dwExtraInfo: 0,
          },
        },
      }
    }

    fn send_vk(vk: u16) -> Result<(), String> {
      let inputs = [key_inputs(vk, false), key_inputs(vk, true)];
      let sent = unsafe { SendInput(&inputs, std::mem::size_of::<INPUT>() as i32) };
      if sent != inputs.len() as u32 {
        return Err(format!("SendInput failed for vk {}", vk));
      }
      Ok(())
    }

    fn send_combo(modifiers: &[u16], main_vk: u16) -> Result<(), String> {
      let mut inputs = Vec::<INPUT>::new();
      for vk in modifiers {
        inputs.push(key_inputs(*vk, false));
      }
      inputs.push(key_inputs(main_vk, false));
      inputs.push(key_inputs(main_vk, true));
      for vk in modifiers.iter().rev() {
        inputs.push(key_inputs(*vk, true));
      }
      let sent = unsafe { SendInput(&inputs, std::mem::size_of::<INPUT>() as i32) };
      if sent != inputs.len() as u32 {
        return Err("SendInput failed for combo".to_string());
      }
      Ok(())
    }

    fn vk_from_token(token: &str) -> Option<u16> {
      let normalized = normalize_token(token);
      match normalized.as_str() {
        "CTRL" | "CONTROL" => Some(VK_CONTROL.0 as u16),
        "ALT" | "MENU" => Some(VK_MENU.0 as u16),
        "SHIFT" => Some(VK_SHIFT.0 as u16),
        "SUPER" | "WIN" | "META" | "CMD" | "COMMAND" => Some(VK_LWIN.0 as u16),
        "ENTER" | "RETURN" => Some(VK_RETURN.0 as u16),
        "TAB" => Some(VK_TAB.0 as u16),
        "SPACE" | "SPACEBAR" => Some(VK_SPACE.0 as u16),
        "ESC" | "ESCAPE" => Some(VK_ESCAPE.0 as u16),
        "BACKSPACE" => Some(VK_BACK.0 as u16),
        "DELETE" | "DEL" => Some(VK_DELETE.0 as u16),
        "INSERT" | "INS" => Some(VK_INSERT.0 as u16),
        "HOME" => Some(VK_HOME.0 as u16),
        "END" => Some(VK_END.0 as u16),
        "PAGEUP" | "PGUP" => Some(VK_PRIOR.0 as u16),
        "PAGEDOWN" | "PGDN" => Some(VK_NEXT.0 as u16),
        "UP" => Some(VK_UP.0 as u16),
        "DOWN" => Some(VK_DOWN.0 as u16),
        "LEFT" => Some(VK_LEFT.0 as u16),
        "RIGHT" => Some(VK_RIGHT.0 as u16),
        "F1" => Some(VK_F1.0 as u16),
        "F2" => Some(VK_F2.0 as u16),
        "F3" => Some(VK_F3.0 as u16),
        "F4" => Some(VK_F4.0 as u16),
        "F5" => Some(VK_F5.0 as u16),
        "F6" => Some(VK_F6.0 as u16),
        "F7" => Some(VK_F7.0 as u16),
        "F8" => Some(VK_F8.0 as u16),
        "F9" => Some(VK_F9.0 as u16),
        "F10" => Some(VK_F10.0 as u16),
        "F11" => Some(VK_F11.0 as u16),
        "F12" => Some(VK_F12.0 as u16),
        _ => {
          if normalized.len() == 1 {
            normalized.as_bytes().first().copied().map(|b| b as u16)
          } else {
            None
          }
        }
      }
    }

    fn run_key_value(raw: &str) -> Result<(), String> {
      let value = raw.trim();
      if value.is_empty() {
        return Ok(());
      }
      let parts = value.split('+').map(str::trim).filter(|p| !p.is_empty()).collect::<Vec<_>>();
      if parts.is_empty() {
        return Ok(());
      }
      if parts.len() == 1 {
        let vk = vk_from_token(parts[0]).ok_or_else(|| format!("unsupported key '{}'", value))?;
        return send_vk(vk);
      }
      let mut modifiers = Vec::<u16>::new();
      for token in &parts[..parts.len() - 1] {
        let vk = vk_from_token(token).ok_or_else(|| format!("unsupported modifier '{}'", token))?;
        modifiers.push(vk);
      }
      let main_vk = vk_from_token(parts[parts.len() - 1])
        .ok_or_else(|| format!("unsupported key '{}'", parts[parts.len() - 1]))?;
      send_combo(&modifiers, main_vk)
    }

    for step in steps {
      let kind = step.kind.trim().to_lowercase();
      let value = step.value.trim().to_string();
      if value.is_empty() {
        continue;
      }
      if kind == "delay" {
        let ms = value.parse::<u64>().map_err(|_| format!("invalid delay '{}'", value))?;
        std::thread::sleep(Duration::from_millis(ms));
        continue;
      }
      run_key_value(&value)?;
    }
    Ok(())
  }
}

#[tauri::command]
fn run_mouse_sequence(steps: Vec<MouseSequenceStep>) -> Result<(), String> {
  #[cfg(not(windows))]
  {
    let _ = steps;
    Err("mouse automation is currently only implemented on Windows".to_string())
  }

  #[cfg(windows)]
  {
    use windows::Win32::UI::Input::KeyboardAndMouse::{
      SendInput, INPUT, INPUT_0, INPUT_MOUSE, MOUSEEVENTF_HWHEEL, MOUSEEVENTF_LEFTDOWN,
      MOUSEEVENTF_LEFTUP, MOUSEEVENTF_MIDDLEDOWN, MOUSEEVENTF_MIDDLEUP, MOUSEEVENTF_MOVE,
      MOUSEEVENTF_RIGHTDOWN, MOUSEEVENTF_RIGHTUP, MOUSEEVENTF_WHEEL, MOUSEEVENTF_XDOWN,
      MOUSEEVENTF_XUP, MOUSEINPUT, MOUSE_EVENT_FLAGS,
    };
    const XBUTTON1_DATA: u32 = 0x0001;
    const XBUTTON2_DATA: u32 = 0x0002;

    fn mouse_input(flags: u32, data: u32, dx: i32, dy: i32) -> INPUT {
      INPUT {
        r#type: INPUT_MOUSE,
        Anonymous: INPUT_0 {
          mi: MOUSEINPUT {
            dx,
            dy,
            mouseData: data,
            dwFlags: MOUSE_EVENT_FLAGS(flags),
            time: 0,
            dwExtraInfo: 0,
          },
        },
      }
    }

    fn send_inputs(inputs: &[INPUT]) -> Result<(), String> {
      let sent = unsafe { SendInput(inputs, std::mem::size_of::<INPUT>() as i32) };
      if sent != inputs.len() as u32 {
        return Err("SendInput failed for mouse sequence".to_string());
      }
      Ok(())
    }

    fn parse_button(value: &str) -> Option<(&'static str, u32)> {
      match value.trim().to_lowercase().as_str() {
        "left" => Some(("left", 0)),
        "right" => Some(("right", 0)),
        "middle" => Some(("middle", 0)),
        "x1" => Some(("x", XBUTTON1_DATA)),
        "x2" => Some(("x", XBUTTON2_DATA)),
        _ => None,
      }
    }

    fn button_inputs(button: &str, x_button: u32, pressed: bool) -> Vec<INPUT> {
      match (button, pressed) {
        ("left", true) => vec![mouse_input(MOUSEEVENTF_LEFTDOWN.0, 0, 0, 0)],
        ("left", false) => vec![mouse_input(MOUSEEVENTF_LEFTUP.0, 0, 0, 0)],
        ("right", true) => vec![mouse_input(MOUSEEVENTF_RIGHTDOWN.0, 0, 0, 0)],
        ("right", false) => vec![mouse_input(MOUSEEVENTF_RIGHTUP.0, 0, 0, 0)],
        ("middle", true) => vec![mouse_input(MOUSEEVENTF_MIDDLEDOWN.0, 0, 0, 0)],
        ("middle", false) => vec![mouse_input(MOUSEEVENTF_MIDDLEUP.0, 0, 0, 0)],
        ("x", true) => vec![mouse_input(MOUSEEVENTF_XDOWN.0, x_button, 0, 0)],
        ("x", false) => vec![mouse_input(MOUSEEVENTF_XUP.0, x_button, 0, 0)],
        _ => Vec::new(),
      }
    }

    fn run_button_action(button_value: &str, mode: &str) -> Result<(), String> {
      let (button, x_button) = parse_button(button_value)
        .ok_or_else(|| format!("unsupported mouse button '{}'", button_value))?;
      let inputs = if mode == "click" {
        let mut items = button_inputs(button, x_button, true);
        items.extend(button_inputs(button, x_button, false));
        items
      } else if mode == "down" {
        button_inputs(button, x_button, true)
      } else {
        button_inputs(button, x_button, false)
      };
      send_inputs(&inputs)
    }

    fn run_move(value: &str) -> Result<(), String> {
      let parts = value
        .split(',')
        .map(str::trim)
        .filter(|part| !part.is_empty())
        .collect::<Vec<_>>();
      if parts.len() != 2 && parts.len() != 3 {
        return Err(format!("invalid mouse move '{}'", value));
      }
      let dx = parts[0]
        .parse::<i32>()
        .map_err(|_| format!("invalid mouse move x '{}'", parts[0]))?;
      let dy = parts[1]
        .parse::<i32>()
        .map_err(|_| format!("invalid mouse move y '{}'", parts[1]))?;
      let duration_ms = if parts.len() >= 3 {
        parts[2]
          .parse::<u64>()
          .map_err(|_| format!("invalid mouse move duration '{}'", parts[2]))?
      } else {
        220
      };
      if duration_ms == 0 {
        let inputs = [mouse_input(MOUSEEVENTF_MOVE.0, 0, dx, dy)];
        return send_inputs(&inputs);
      }

      let distance = ((dx.abs() + dy.abs()) as u64).max(1);
      let mut steps = std::cmp::max(8u64, distance / 6);
      steps = std::cmp::min(steps, 120);
      let sleep_ms = std::cmp::max(1, duration_ms / steps.max(1));
      let mut sent_x = 0i32;
      let mut sent_y = 0i32;

      for step_idx in 1..=steps {
        let target_x = ((dx as i64) * (step_idx as i64) / (steps as i64)) as i32;
        let target_y = ((dy as i64) * (step_idx as i64) / (steps as i64)) as i32;
        let move_x = target_x - sent_x;
        let move_y = target_y - sent_y;
        sent_x = target_x;
        sent_y = target_y;
        if move_x != 0 || move_y != 0 {
          let inputs = [mouse_input(MOUSEEVENTF_MOVE.0, 0, move_x, move_y)];
          send_inputs(&inputs)?;
        }
        std::thread::sleep(Duration::from_millis(sleep_ms));
      }
      Ok(())
    }

    fn run_scroll(value: &str, horizontal: bool) -> Result<(), String> {
      let parts = value
        .split(',')
        .map(str::trim)
        .filter(|part| !part.is_empty())
        .collect::<Vec<_>>();
      if parts.is_empty() || parts.len() > 2 {
        return Err(format!("invalid mouse scroll '{}'", value));
      }
      let amount = parts[0]
        .parse::<i32>()
        .map_err(|_| format!("invalid mouse scroll '{}'", value))?;
      let duration_ms = if parts.len() >= 2 {
        parts[1]
          .parse::<u64>()
          .map_err(|_| format!("invalid mouse scroll duration '{}'", parts[1]))?
      } else {
        180
      };
      let flag = if horizontal { MOUSEEVENTF_HWHEEL.0 } else { MOUSEEVENTF_WHEEL.0 };
      if duration_ms == 0 {
        let inputs = [mouse_input(flag, amount as u32, 0, 0)];
        return send_inputs(&inputs);
      }

      let magnitude = amount.unsigned_abs() as u64;
      let mut steps = std::cmp::max(6u64, magnitude / 40);
      steps = std::cmp::min(steps, 48);
      let sleep_ms = std::cmp::max(1, duration_ms / steps.max(1));
      let mut sent_amount = 0i32;

      for step_idx in 1..=steps {
        let target = ((amount as i64) * (step_idx as i64) / (steps as i64)) as i32;
        let delta = target - sent_amount;
        sent_amount = target;
        if delta != 0 {
          let inputs = [mouse_input(flag, delta as u32, 0, 0)];
          send_inputs(&inputs)?;
        }
        std::thread::sleep(Duration::from_millis(sleep_ms));
      }
      Ok(())
    }

    for step in steps {
      let kind = step.kind.trim().to_lowercase();
      let value = step.value.trim().to_string();
      if value.is_empty() {
        continue;
      }
      match kind.as_str() {
        "delay" => {
          let ms = value.parse::<u64>().map_err(|_| format!("invalid delay '{}'", value))?;
          std::thread::sleep(Duration::from_millis(ms));
        }
        "click" | "down" | "up" => run_button_action(&value, &kind)?,
        "move" => run_move(&value)?,
        "scroll" => run_scroll(&value, false)?,
        "hscroll" => run_scroll(&value, true)?,
        _ => return Err(format!("unsupported mouse step '{}'", kind)),
      }
    }
    Ok(())
  }
}

#[tauri::command]
fn run_system_sequence(steps: Vec<SystemSequenceStep>) -> Result<(), String> {
  #[cfg(not(windows))]
  {
    let _ = steps;
    Err("system automation is currently only implemented on Windows".to_string())
  }

  #[cfg(windows)]
  {
    use windows::Win32::UI::Input::KeyboardAndMouse::{
      SendInput, INPUT, INPUT_0, INPUT_KEYBOARD, KEYBDINPUT, KEYEVENTF_KEYUP, VIRTUAL_KEY,
      VK_LWIN, VK_MEDIA_NEXT_TRACK, VK_MEDIA_PLAY_PAUSE, VK_MEDIA_PREV_TRACK,
      VK_MENU, VK_SHIFT, VK_VOLUME_DOWN, VK_VOLUME_MUTE, VK_VOLUME_UP,
    };

    fn key_input(vk: u16, key_up: bool) -> INPUT {
      INPUT {
        r#type: INPUT_KEYBOARD,
        Anonymous: INPUT_0 {
          ki: KEYBDINPUT {
            wVk: VIRTUAL_KEY(vk),
            wScan: 0,
            dwFlags: if key_up { KEYEVENTF_KEYUP } else { Default::default() },
            time: 0,
            dwExtraInfo: 0,
          },
        },
      }
    }

    fn send_vk(vk: u16) -> Result<(), String> {
      let inputs = [key_input(vk, false), key_input(vk, true)];
      let sent = unsafe { SendInput(&inputs, std::mem::size_of::<INPUT>() as i32) };
      if sent != inputs.len() as u32 {
        return Err(format!("SendInput failed for vk {}", vk));
      }
      Ok(())
    }

    fn send_combo(keys: &[u16]) -> Result<(), String> {
      let mut inputs = Vec::<INPUT>::new();
      for vk in keys {
        inputs.push(key_input(*vk, false));
      }
      for vk in keys.iter().rev() {
        inputs.push(key_input(*vk, true));
      }
      let sent = unsafe { SendInput(&inputs, std::mem::size_of::<INPUT>() as i32) };
      if sent != inputs.len() as u32 {
        return Err("SendInput failed for combo".to_string());
      }
      Ok(())
    }

    for step in steps {
      let kind = step.kind.trim().to_lowercase();
      let value = step.value.trim().to_lowercase();
      let amount = step.amount.unwrap_or(1).clamp(1, 20) as usize;
      if value.is_empty() {
        continue;
      }
      if kind == "delay" {
        let ms = value.parse::<u64>().map_err(|_| format!("invalid delay '{}'", value))?;
        std::thread::sleep(Duration::from_millis(ms));
        continue;
      }
      match kind.as_str() {
        "volume" => match value.as_str() {
          "volume_up" => {
            for _ in 0..amount {
              send_vk(VK_VOLUME_UP.0 as u16)?;
            }
          }
          "volume_down" => {
            for _ in 0..amount {
              send_vk(VK_VOLUME_DOWN.0 as u16)?;
            }
          }
          "volume_mute" => send_vk(VK_VOLUME_MUTE.0 as u16)?,
          _ => return Err(format!("unsupported volume action '{}'", value)),
        },
        "media" => match value.as_str() {
          "media_play_pause" => send_vk(VK_MEDIA_PLAY_PAUSE.0 as u16)?,
          "media_next" => send_vk(VK_MEDIA_NEXT_TRACK.0 as u16)?,
          "media_previous" => send_vk(VK_MEDIA_PREV_TRACK.0 as u16)?,
          _ => return Err(format!("unsupported media action '{}'", value)),
        },
        "action" | "screenshot" => match value.as_str() {
          "screenshot_image" => send_combo(&[VK_LWIN.0 as u16, VK_SHIFT.0 as u16, b'S' as u16])?,
          "screenshot_video" => send_combo(&[VK_LWIN.0 as u16, VK_MENU.0 as u16, b'R' as u16])?,
          "lock_screen" => {
            let status = Command::new("rundll32.exe")
              .args(["user32.dll,LockWorkStation"])
              .spawn()
              .map_err(|e| e.to_string())?;
            let _ = status;
          }
          _ => return Err(format!("unsupported screenshot action '{}'", value)),
        },
        "lock" => match value.as_str() {
          "lock_screen" => {
            let status = Command::new("rundll32.exe")
              .args(["user32.dll,LockWorkStation"])
              .spawn()
              .map_err(|e| e.to_string())?;
            let _ = status;
          }
          _ => return Err(format!("unsupported lock action '{}'", value)),
        },
        _ => return Err(format!("unsupported system step '{}'", kind)),
      }
    }
    Ok(())
  }
}

#[tauri::command]
fn close_app_target(target: String, app_name: String) -> Result<(), String> {
  #[cfg(windows)]
  {
    use std::os::windows::process::CommandExt;
    const CREATE_NO_WINDOW: u32 = 0x08000000;

    let target = target.trim().to_string();
    let app_name = app_name.trim().to_string();
    if target.is_empty() && app_name.is_empty() {
      return Ok(());
    }

    let escaped_target = target.replace('\'', "''");
    let escaped_name = app_name.replace('\'', "''");
    let script = format!(r#"
$target = '{escaped_target}'
$appName = '{escaped_name}'
$targetPath = $null
$targetArgs = $null
$targetUrl = $null
$appId = $null
$steamAppId = $null
$skipDirectProcessMatch = $false
if ($target -match '^file:///') {{
  $targetPath = [System.Uri]::UnescapeDataString($target.Substring(8)).Replace('/', '\')
}} elseif ($target -match '^[A-Za-z]:\\') {{
  $targetPath = $target
}} elseif ($target -match '^shell:AppsFolder\\') {{
  $appId = $target.Substring(17)
}} elseif ($target -match '^steam://run/([0-9]+)') {{
  $steamAppId = $Matches[1]
}}
$exeStem = $null
if ($targetPath) {{
  try {{
    if ([System.IO.Path]::GetExtension($targetPath).Equals('.lnk', [System.StringComparison]::OrdinalIgnoreCase) -and (Test-Path $targetPath)) {{
      $shell = New-Object -ComObject WScript.Shell
      $shortcut = $shell.CreateShortcut($targetPath)
      if ($shortcut) {{
        if ($shortcut.TargetPath) {{
          $targetPath = $shortcut.TargetPath
        }}
        if ($shortcut.Arguments) {{
          $targetArgs = $shortcut.Arguments
        }}
        try {{
          $resolvedStem = [System.IO.Path]::GetFileNameWithoutExtension($targetPath)
          $resolvedNorm = (($resolvedStem -replace '[^A-Za-z0-9]', '').ToLowerInvariant())
          if (@('chromeproxy','msedgeproxy','braveproxy','vivaldi','opera','operagx') -contains $resolvedNorm) {{
            $skipDirectProcessMatch = $true
          }}
        }} catch {{}}
      }}
    }} elseif ([System.IO.Path]::GetExtension($targetPath).Equals('.url', [System.StringComparison]::OrdinalIgnoreCase) -and (Test-Path $targetPath)) {{
      $urlLine = Get-Content $targetPath -ErrorAction SilentlyContinue | Where-Object {{ $_ -match '^URL=' }} | Select-Object -First 1
      if ($urlLine) {{
        $targetUrl = $urlLine.Substring(4).Trim()
      }}
    }}
    $exeStem = [System.IO.Path]::GetFileNameWithoutExtension($targetPath)
  }} catch {{}}
}}
function Normalize-Name([string]$value) {{
  if (-not $value) {{ return "" }}
  return (($value -replace '[^A-Za-z0-9]', '').ToLowerInvariant())
}}
function Stop-ByExactProcessName([string]$name) {{
  if (-not $name) {{ return }}
  $wanted = Normalize-Name $name
  if (-not $wanted) {{ return }}
  Get-Process -ErrorAction SilentlyContinue | Where-Object {{
    (Normalize-Name $_.ProcessName) -eq $wanted
  }} | ForEach-Object {{
    Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
  }}
}}
function Stop-TreeByExactProcessName([string]$name) {{
  if (-not $name) {{ return }}
  $trimmed = $name.Trim()
  if (-not $trimmed) {{ return }}
  $exeName = if ($trimmed.ToLowerInvariant().EndsWith('.exe')) {{ $trimmed }} else {{ "$trimmed.exe" }}
  & taskkill /IM $exeName /F /T *> $null
}}
function Stop-ByExactWindowTitle([string]$name) {{
  if (-not $name) {{ return }}
  $wanted = Normalize-Name $name
  if (-not $wanted) {{ return }}
  Get-Process -ErrorAction SilentlyContinue | Where-Object {{
    $_.MainWindowTitle -and (Normalize-Name $_.MainWindowTitle) -eq $wanted
  }} | ForEach-Object {{
    Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
  }}
}}
function Stop-ByExactWindowTitleForBrowserHost([string]$name) {{
  if (-not $name) {{ return }}
  $wanted = Normalize-Name $name
  if (-not $wanted) {{ return }}
  $allowedHosts = @('msedge', 'msedgeproxy', 'chrome', 'chromeproxy', 'brave', 'braveproxy', 'vivaldi', 'opera', 'operagx')
  Get-Process -ErrorAction SilentlyContinue | Where-Object {{
    $_.MainWindowTitle -and
    $allowedHosts -contains ($_.ProcessName.ToLowerInvariant()) -and
    (Normalize-Name $_.MainWindowTitle) -eq $wanted
  }} | ForEach-Object {{
    Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
  }}
}}
function Stop-ByPathPrefix([string]$pathPrefix) {{
  if (-not $pathPrefix) {{ return }}
  $trimmed = $pathPrefix.Trim().TrimEnd('\')
  if (-not $trimmed) {{ return }}
  Get-Process -ErrorAction SilentlyContinue | Where-Object {{
    $_.Path -and $_.Path.StartsWith($trimmed, [System.StringComparison]::OrdinalIgnoreCase)
  }} | ForEach-Object {{
    Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
  }}
}}
function Stop-TreeByPathPrefix([string]$pathPrefix) {{
  if (-not $pathPrefix) {{ return }}
  $trimmed = $pathPrefix.Trim().TrimEnd('\')
  if (-not $trimmed) {{ return }}
  Get-CimInstance Win32_Process -ErrorAction SilentlyContinue | Where-Object {{
    $_.ExecutablePath -and $_.ExecutablePath.StartsWith($trimmed, [System.StringComparison]::OrdinalIgnoreCase)
  }} | Sort-Object ProcessId -Descending | ForEach-Object {{
    & taskkill /PID $_.ProcessId /F /T *> $null
  }}
}}
function Get-RegValue([string]$key, [string]$valueName) {{
  try {{
    $line = reg query $key /v $valueName 2>$null | Select-String $valueName | Select-Object -First 1
    if (-not $line) {{ return $null }}
    $text = [string]$line
    $idx = $text.IndexOf('REG_SZ')
    if ($idx -lt 0) {{ return $null }}
    $value = $text.Substring($idx + 6).Trim()
    if ($value) {{ return $value }}
  }} catch {{}}
  return $null
}}
function Get-SteamRoots() {{
  $roots = New-Object System.Collections.Generic.List[string]
  $seen = @{{}}
  function Add-Root([string]$candidate) {{
    if (-not $candidate) {{ return }}
    $expanded = $candidate.Replace('/', '\').TrimEnd('\')
    if (-not (Test-Path $expanded)) {{ return }}
    $key = $expanded.ToLowerInvariant()
    if (-not $seen.ContainsKey($key)) {{
      $seen[$key] = $true
      $roots.Add($expanded)
    }}
  }}
  Add-Root (Join-Path $env:'ProgramFiles(x86)' 'Steam')
  Add-Root (Join-Path $env:ProgramFiles 'Steam')
  Add-Root (Join-Path $env:LOCALAPPDATA 'Steam')
  Add-Root (Get-RegValue 'HKCU\Software\Valve\Steam' 'SteamPath')
  Add-Root (Get-RegValue 'HKLM\SOFTWARE\WOW6432Node\Valve\Steam' 'InstallPath')
  Add-Root (Get-RegValue 'HKLM\SOFTWARE\Valve\Steam' 'InstallPath')
  return $roots
}}
function Get-SteamAppsFolders([string]$steamRoot) {{
  $folders = New-Object System.Collections.Generic.List[string]
  $seen = @{{}}
  function Add-Folder([string]$candidate) {{
    if (-not $candidate) {{ return }}
    $expanded = $candidate.Replace('/', '\').TrimEnd('\')
    if (-not (Test-Path $expanded)) {{ return }}
    $key = $expanded.ToLowerInvariant()
    if (-not $seen.ContainsKey($key)) {{
      $seen[$key] = $true
      $folders.Add($expanded)
    }}
  }}
  $main = Join-Path $steamRoot 'steamapps'
  Add-Folder $main
  $libraryVdf = Join-Path $main 'libraryfolders.vdf'
  if (Test-Path $libraryVdf) {{
    Get-Content $libraryVdf -ErrorAction SilentlyContinue | ForEach-Object {{
      if ($_ -match '"path"\s+"([^"]+)"') {{
        Add-Folder (Join-Path ($Matches[1] -replace '\\\\','\') 'steamapps')
      }} elseif ($_ -match '"\d+"\s+"([^"]+)"') {{
        $raw = $Matches[1] -replace '\\\\','\'
        if ($raw -match '^[A-Za-z]:\\' -or $raw -match '^\\\\') {{
          Add-Folder (Join-Path $raw 'steamapps')
        }}
      }}
    }}
  }}
  return $folders
}}
function Get-VdfSimpleValue([string]$content, [string]$key) {{
  $match = [regex]::Match($content, '"' + [regex]::Escape($key) + '"\s+"([^"]+)"', [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
  if ($match.Success) {{
    return $match.Groups[1].Value
  }}
  return $null
}}
function Stop-SteamGameByAppId([string]$appId) {{
  if (-not $appId) {{ return }}
  foreach ($steamRoot in Get-SteamRoots) {{
    foreach ($steamapps in Get-SteamAppsFolders $steamRoot) {{
      $manifest = Join-Path $steamapps ("appmanifest_" + $appId + ".acf")
      if (-not (Test-Path $manifest)) {{ continue }}
      $content = Get-Content -Raw $manifest -ErrorAction SilentlyContinue
      if (-not $content) {{ continue }}
      $installDir = Get-VdfSimpleValue $content 'installdir'
      if (-not $installDir) {{ continue }}
      $gameRoot = Join-Path (Join-Path $steamapps 'common') $installDir
      if (Test-Path $gameRoot) {{
        Stop-TreeByPathPrefix $gameRoot
        Stop-ByPathPrefix $gameRoot
        return
      }}
    }}
  }}
}}
function Stop-ByCommandLineTokenForBrowserHost([string]$token) {{
  if (-not $token) {{ return }}
  $trimmed = $token.Trim()
  if ($trimmed.Length -lt 6) {{ return }}
  $allowedHosts = @('msedge', 'msedgeproxy', 'chrome', 'chromeproxy', 'brave', 'braveproxy', 'vivaldi', 'opera', 'opera gx')
  Get-CimInstance Win32_Process -ErrorAction SilentlyContinue | Where-Object {{
    $_.CommandLine -and
    $allowedHosts -contains ($_.Name.ToLowerInvariant() -replace '\.exe$', '') -and
    $_.CommandLine.Contains($trimmed)
  }} | ForEach-Object {{
    Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue
  }}
}}
function Stop-ByBrowserAppUrl([string]$url) {{
  if (-not $url) {{ return }}
  $trimmed = $url.Trim()
  if (-not $trimmed) {{ return }}
  $host = $null
  try {{
    $uri = [System.Uri]$trimmed
    $host = $uri.Host
  }} catch {{}}
  $allowedHosts = @('msedge', 'msedgeproxy', 'chrome', 'chromeproxy', 'brave', 'braveproxy', 'vivaldi', 'opera', 'opera gx')
  Get-CimInstance Win32_Process -ErrorAction SilentlyContinue | Where-Object {{
    $_.CommandLine -and
    $allowedHosts -contains ($_.Name.ToLowerInvariant() -replace '\.exe$', '') -and
    (
      $_.CommandLine.Contains($trimmed) -or
      ($host -and $_.CommandLine.Contains($host))
    ) -and
    (
      $_.CommandLine.Contains('--app-url=') -or
      $_.CommandLine.Contains('--app=') -or
      $_.CommandLine.Contains('--app-id=') -or
      $_.CommandLine.Contains('--app-launch-url-for-shortcuts-menu-item=')
    )
  }} | ForEach-Object {{
    Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue
  }}
}}
if ($targetPath -and -not $skipDirectProcessMatch) {{
  Get-Process -ErrorAction SilentlyContinue | Where-Object {{
    $_.Path -and $_.Path -ieq $targetPath
  }} | ForEach-Object {{
    Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
  }}
}}
if ($exeStem -and -not $skipDirectProcessMatch) {{
  Stop-ByExactProcessName $exeStem
  Stop-TreeByExactProcessName $exeStem
}}
if ($targetArgs) {{
  $appIdMatch = [regex]::Match($targetArgs, '--app-id=([A-Za-z0-9]+)')
  if ($appIdMatch.Success) {{
    Stop-ByCommandLineTokenForBrowserHost $appIdMatch.Groups[1].Value
  }}
  $appUrlMatch = [regex]::Match($targetArgs, '--app(?:-url)?=(\"[^\"]+\"|\S+)')
  if ($appUrlMatch.Success) {{
    $matchedUrl = $appUrlMatch.Groups[1].Value.Trim('"')
    Stop-ByBrowserAppUrl $matchedUrl
  }}
  Stop-ByExactWindowTitleForBrowserHost $appName
}}
if ($targetUrl) {{
  Stop-ByBrowserAppUrl $targetUrl
  Stop-ByExactWindowTitleForBrowserHost $appName
}}
if ($steamAppId) {{
  Stop-SteamGameByAppId $steamAppId
}}
if ($appId) {{
  $parts = $appId -split '!'
  $packageFamily = if ($parts.Length -gt 0) {{ $parts[0] }} else {{ "" }}
  $applicationId = if ($parts.Length -gt 1) {{ $parts[1] }} else {{ "" }}
  $resolvedExe = $null
  $pkgInstallLocation = $null
  if ($packageFamily) {{
    $pkg = Get-AppxPackage -PackageFamilyName $packageFamily -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($pkg -and $pkg.InstallLocation) {{
      $pkgInstallLocation = $pkg.InstallLocation
      $manifestPath = Join-Path $pkg.InstallLocation 'AppxManifest.xml'
      if (Test-Path $manifestPath) {{
        try {{
          [xml]$manifest = Get-Content -Raw $manifestPath
          $apps = @($manifest.Package.Applications.Application)
          $appNode = $apps | Where-Object {{ $_.Id -eq $applicationId }} | Select-Object -First 1
          if (-not $appNode) {{ $appNode = $apps | Select-Object -First 1 }}
          if ($appNode -and $appNode.Executable) {{
            $resolvedExe = [System.IO.Path]::GetFileNameWithoutExtension($appNode.Executable)
          }}
        }} catch {{}}
      }}
    }}
  }}
  $blocked = @('applicationframehost', 'msedge', 'msedgeproxy', 'chrome', 'chromeproxy', 'brave', 'braveproxy', 'vivaldi', 'opera', 'operagx', 'browserhost')
  $resolvedNorm = Normalize-Name $resolvedExe
  if ($resolvedNorm -and ($blocked -notcontains $resolvedNorm)) {{
    Stop-ByExactProcessName $resolvedExe
    Stop-TreeByExactProcessName $resolvedExe
  }}
  if ($pkgInstallLocation) {{
    Stop-ByPathPrefix $pkgInstallLocation
  }}
  Stop-ByExactWindowTitle $appName
}}
if ($appName) {{
  $wanted = Normalize-Name $appName
  if ($wanted.Length -ge 5 -and -not $appId) {{
    Stop-ByExactProcessName $appName
    Stop-TreeByExactProcessName $appName
  }}
}}
"#);

    Command::new("powershell")
      .creation_flags(CREATE_NO_WINDOW)
      .args(["-NoProfile", "-WindowStyle", "Hidden", "-Command", script.as_str()])
      .output()
      .map_err(|e| e.to_string())?;
    return Ok(());
  }

  #[cfg(not(windows))]
  {
    let _ = target;
    let _ = app_name;
    Ok(())
  }
}

fn path_to_file_url(path: &Path) -> String {
  let s = path.to_string_lossy().replace('\\', "/");
  #[cfg(target_os = "windows")]
  {
    format!("file:///{}", s)
  }
  #[cfg(not(target_os = "windows"))]
  {
    format!("file://{}", s)
  }
}

#[tauri::command]
fn pick_filesystem_target(kind: String) -> Result<Option<String>, String> {
  let picked = match kind.as_str() {
    "file" => rfd::FileDialog::new().pick_file(),
    "folder" => rfd::FileDialog::new().pick_folder(),
    _ => return Err("unsupported picker kind".to_string()),
  };
  Ok(picked.map(|p| path_to_file_url(&p)))
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
fn load_profile_state(app: tauri::AppHandle) -> Result<serde_json::Value, String> {
  let path = profile_file_path(&app)?;
  let shared_path = shared_profile_file_path();
  let defaults = default_profile_state();
  let (text, source) = if path.exists() {
    (
      std::fs::read_to_string(&path).map_err(|e| e.to_string())?,
      "appdata",
    )
  } else if shared_path.exists() {
    (
      std::fs::read_to_string(&shared_path).map_err(|e| e.to_string())?,
      "shared",
    )
  } else {
    return Ok(with_profile_source(defaults, "default"));
  };
  let parsed: serde_json::Value = serde_json::from_str(&text).map_err(|e| e.to_string())?;
  let mut out = defaults;
  if let (Some(dst), Some(src)) = (out.as_object_mut(), parsed.as_object()) {
    for (k, v) in src {
      if dst.contains_key(k) {
        dst.insert(k.clone(), v.clone());
      }
    }
  }
  Ok(with_profile_source(out, source))
}

#[tauri::command]
fn save_profile_state(app: tauri::AppHandle, state: serde_json::Value) -> Result<(), String> {
  let path = profile_file_path(&app)?;
  let mut out = default_profile_state();
  if let (Some(dst), Some(src)) = (out.as_object_mut(), state.as_object()) {
    for (k, v) in src {
      if dst.contains_key(k) {
        dst.insert(k.clone(), v.clone());
      }
    }
  }
  let json = serde_json::to_string_pretty(&out).map_err(|e| e.to_string())?;
  std::fs::write(path, &json).map_err(|e| e.to_string())?;
  // Avoid a rebuild loop in `tauri dev`: the dev watcher tracks `src-tauri/**`.
  // Writing `profile.shared.json` there on every state change restarts the app repeatedly.
  if !cfg!(debug_assertions) {
    let shared_path = shared_profile_file_path();
    if let Err(e) = std::fs::write(shared_path, json) {
      eprintln!("save shared profile failed: {}", e);
    }
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
fn get_clipboard_payload() -> Result<Option<ClipboardPayload>, String> {
  let mut clipboard = arboard::Clipboard::new().map_err(|e| e.to_string())?;

  if let Ok(img) = clipboard.get_image() {
    let width = img.width as u32;
    let height = img.height as u32;
    let bytes = img.bytes.into_owned();
    if width > 0 && height > 0 && !bytes.is_empty() {
      if let Some(rgba) = image::RgbaImage::from_raw(width, height, bytes.clone()) {
        let mut png = Vec::new();
        let encoder = image::codecs::png::PngEncoder::new(&mut png);
        use image::ImageEncoder;
        use std::hash::{Hash, Hasher};
        encoder
          .write_image(rgba.as_raw(), width, height, image::ColorType::Rgba8.into())
          .map_err(|e| e.to_string())?;
        let b64 = base64::engine::general_purpose::STANDARD.encode(png);
        let mut hasher = std::collections::hash_map::DefaultHasher::new();
        width.hash(&mut hasher);
        height.hash(&mut hasher);
        bytes.len().hash(&mut hasher);
        let take = std::cmp::min(bytes.len(), 4096);
        bytes[..take].hash(&mut hasher);
        let sig = format!("img:{:016x}", hasher.finish());
        return Ok(Some(ClipboardPayload {
          kind: "image".into(),
          text: None,
          data_url: Some(format!("data:image/png;base64,{}", b64)),
          sig,
        }));
      }
    }
  }

  match clipboard.get_text() {
    Ok(text) => {
      if text.trim().is_empty() {
        Ok(None)
      } else {
        let sig = format!("txt:{}:{}", text.len(), text);
        Ok(Some(ClipboardPayload {
          kind: "text".into(),
          text: Some(text),
          data_url: None,
          sig,
        }))
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
fn set_clipboard_image(data_url: String) -> Result<(), String> {
  let mut clipboard = arboard::Clipboard::new().map_err(|e| e.to_string())?;
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
  let width = rgba.width() as usize;
  let height = rgba.height() as usize;
  let pixels = rgba.into_raw();
  clipboard
    .set_image(arboard::ImageData {
      width,
      height,
      bytes: std::borrow::Cow::Owned(pixels),
    })
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

    fn process_name_from_target_path(target_path: &str) -> Option<String> {
      let trimmed = target_path.trim();
      if trimmed.is_empty() {
        return None;
      }
      Path::new(trimmed)
        .file_name()
        .and_then(|value| value.to_str())
        .map(|value| value.trim().to_string())
        .filter(|value| !value.is_empty())
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
        if out[idx].process_name.is_none() && app.process_name.is_some() {
          out[idx].process_name = app.process_name;
        }
      } else {
        seen_by_name.insert(key, out.len());
        out.push(app);
      }
    }

    // Add Steam library games (steam://run/<appid>) so games without Start Menu
    // shortcuts are still discoverable in scan suggestions.
    for app in scan_steam_games() {
      let key = app.name.to_lowercase();
      if let Some(idx) = seen_by_name.get(&key).copied() {
        if out[idx].icon.is_none() && app.icon.is_some() {
          out[idx].icon = app.icon;
        }
        if out[idx].process_name.is_none() && app.process_name.is_some() {
          out[idx].process_name = app.process_name;
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
        let process_name = if ext == "lnk" {
          shortcut_info(path)
            .and_then(|(_, _, target_path)| process_name_from_target_path(&target_path))
        } else {
          None
        };
        let key = name.to_lowercase();
        if let Some(idx) = seen_by_name.get(&key).copied() {
          if out[idx].icon.is_none() && icon.is_some() {
            out[idx].icon = icon;
          }
          if out[idx].process_name.is_none() && process_name.is_some() {
            out[idx].process_name = process_name;
          }
        } else {
          seen_by_name.insert(key, out.len());
          out.push(ScannedApp {
            name,
            launch,
            icon,
            process_name,
          });
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
    .plugin(tauri_plugin_notification::init())
    .plugin(GlobalShortcutBuilder::new().build())
    .manage(ShortcutState {
      registered: Mutex::new(None),
      last_fired: Arc::new(Mutex::new(None)),
    })
    .manage(AppShortcutState {
      registered: Mutex::new(Vec::new()),
      last_fired: Arc::new(Mutex::new(HashMap::new())),
      pressed: Arc::new(Mutex::new(HashSet::new())),
    })
    .manage(QuickLauncherShortcutState {
      last_fired: Arc::new(Mutex::new(None)),
    })
    .setup(|app| {
      #[cfg(windows)]
      {
        let _ = MOUSE_SHORTCUT_APP.set(app.handle().clone());
        let _ = MOUSE_SHORTCUTS.set(Arc::new(Mutex::new(Vec::new())));
        let _ = MOUSE_SHORTCUTS_PRESSED.set(Arc::new(Mutex::new(HashSet::new())));
        let _ = MOUSE_SHORTCUTS_FIRED.set(Arc::new(Mutex::new(HashMap::new())));
        start_mouse_shortcut_hook_thread();
        start_running_process_watch_thread(app.handle().clone());
      }
      if cfg!(debug_assertions) {
        // Logging in dev disabled to keep terminal clean.
        // Uncomment to re-enable:
        // app.handle().plugin(
        //   tauri_plugin_log::Builder::default()
        //     .level(log::LevelFilter::Warn)
        //     .build(),
        // )?;
      }
      let quick_launcher_fired = app
        .state::<QuickLauncherShortcutState>()
        .last_fired
        .clone();
      let register_result = app
        .handle()
        .global_shortcut()
        .on_shortcut(QUICK_LAUNCH_SHORTCUT, move |app, _sc, event| {
          if event.state != HotkeyState::Pressed {
            return;
          }
          let now = Instant::now();
          let mut last_fired = match quick_launcher_fired.lock() {
            Ok(guard) => guard,
            Err(_) => return,
          };
          if let Some(prev_fire) = *last_fired {
            if now.saturating_duration_since(prev_fire)
              < Duration::from_millis(QUICK_LAUNCH_SHORTCUT_COOLDOWN_MS)
            {
              return;
            }
          }
          *last_fired = Some(now);
          drop(last_fired);

          reveal_main_window(app);
          let _ = app.emit_to("main", "kc://quick-launcher-open", ());
        });
      if let Err(err) = register_result {
        eprintln!("quick launcher shortcut registration failed: {}", err);
      }
      apply_default_main_window_icon(app.handle());
      Ok(())
    })
    .invoke_handler(tauri::generate_handler![
      open_external,
      show_native_notification,
      close_app_target,
      pick_filesystem_target,
      scan_desktop_apps,
      set_window_icon,
      run_keyboard_sequence,
      run_mouse_sequence,
      run_system_sequence,
      load_profile_state,
      save_profile_state,
      get_running_process_names,
      set_global_shortcut,
      set_app_shortcuts,
      get_clipboard_text,
      get_clipboard_payload,
      set_clipboard_text,
      set_clipboard_image
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

fn reveal_main_window(app: &tauri::AppHandle) {
  apply_default_main_window_icon(app);
  if let Some(window) = app.get_webview_window("main") {
    let _ = window.unminimize();
    let _ = window.show();
    let _ = window.set_focus();
    let _ = app.emit_to("main", "kc://window-shown-by-shortcut", ());
  }
}

fn apply_default_main_window_icon(app: &tauri::AppHandle) {
  let bytes = include_bytes!("../icons/icon.png");
  let img = match image::load_from_memory(bytes) {
    Ok(img) => img.to_rgba8(),
    Err(_) => return,
  };
  let width = img.width();
  let height = img.height();
  let icon = tauri::image::Image::new_owned(img.into_raw(), width, height);
  if let Some(window) = app.get_webview_window("main") {
    let _ = window.set_icon(icon);
  }
}

#[tauri::command]
fn set_global_shortcut(app: tauri::AppHandle, state: tauri::State<ShortcutState>, shortcut: String) -> Result<(), String> {
  let shortcut = shortcut.trim().to_string();
  let toggle_state = state.last_fired.clone();

  let mut guard = state.registered.lock().map_err(|_| "lock failed")?;
  let prev = guard.clone();

  if let Some(prev_sc) = prev {
    let _ = app.global_shortcut().unregister(prev_sc.as_str());
  }

  if shortcut.is_empty() {
    *guard = None;
    if let Ok(mut last) = toggle_state.lock() {
      *last = None;
    }
    return Ok(());
  }

  app
    .global_shortcut()
    .on_shortcut(shortcut.as_str(), move |app, _sc, event| {
      if event.state != HotkeyState::Pressed {
        return;
      }
      let now = Instant::now();
      let mut last_fired = match toggle_state.lock() {
        Ok(guard) => guard,
        Err(_) => return,
      };
      if let Some(prev_fire) = *last_fired {
        if now.saturating_duration_since(prev_fire) < Duration::from_millis(GLOBAL_SHORTCUT_COOLDOWN_MS) {
          return;
        }
      }
      *last_fired = Some(now);
      drop(last_fired);

      if let Some(w) = app.get_webview_window("main") {
        let minimized = w.is_minimized().unwrap_or(false);
        if w.is_visible().unwrap_or(true) && !minimized {
          let _ = w.hide();
          return;
        }
      }

      reveal_main_window(app);
    })
    .map_err(|e| e.to_string())?;

  *guard = Some(shortcut);
  Ok(())
}

#[tauri::command]
fn set_app_shortcuts(
  app: tauri::AppHandle,
  state: tauri::State<AppShortcutState>,
  shortcuts: Vec<AppShortcutEntry>
) -> Result<(), String> {
  let mut guard = state.registered.lock().map_err(|_| "lock failed")?;
  let fired_state = state.last_fired.clone();
  let pressed_state = state.pressed.clone();

  for prev in guard.iter() {
    let _ = app.global_shortcut().unregister(prev.as_str());
  }
  guard.clear();
  if let Ok(mut fired) = fired_state.lock() {
    fired.clear();
  }
  if let Ok(mut pressed) = pressed_state.lock() {
    pressed.clear();
  }
  #[cfg(windows)]
  {
    if let Some(registry) = MOUSE_SHORTCUTS.get() {
      if let Ok(mut items) = registry.lock() {
        items.clear();
      }
    }
    if let Some(pressed) = MOUSE_SHORTCUTS_PRESSED.get() {
      if let Ok(mut items) = pressed.lock() {
        items.clear();
      }
    }
    if let Some(fired) = MOUSE_SHORTCUTS_FIRED.get() {
      if let Ok(mut items) = fired.lock() {
        items.clear();
      }
    }
  }

  let mut seen = HashSet::<String>::new();
  #[cfg(windows)]
  let mut mouse_bindings = Vec::<MouseShortcutBinding>::new();
  for item in shortcuts {
    let shortcut = item.shortcut.trim().to_string();
    let launch = item.launch.trim().to_string();
    if shortcut.is_empty() || launch.is_empty() {
      continue;
    }
    let key = shortcut.to_lowercase();
    if !seen.insert(key) {
      continue;
    }

    #[cfg(windows)]
    if let Some(binding) = parse_mouse_shortcut(&shortcut, &launch) {
      mouse_bindings.push(binding);
      continue;
    }

    let launch_value = launch.clone();
    let fired_state_local = fired_state.clone();
    let pressed_state_local = pressed_state.clone();
    let shortcut_key = shortcut.to_lowercase();
    app
      .global_shortcut()
      .on_shortcut(shortcut.as_str(), move |app, _sc, event| {
        match event.state {
          HotkeyState::Released => {
            if let Ok(mut pressed) = pressed_state_local.lock() {
              pressed.remove(&shortcut_key);
            }
            if let Some(automation_id) = launch_value.strip_prefix(AUTOMATION_SHORTCUT_SCHEME) {
              let _ = app.emit_to("main", AUTOMATION_SHORTCUT_EVENT, AutomationShortcutEvent {
                id: automation_id.to_string(),
                phase: "released".to_string(),
              });
            }
            return;
          }
          HotkeyState::Pressed => {
            let mut pressed = match pressed_state_local.lock() {
              Ok(guard) => guard,
              Err(_) => return,
            };
            if !pressed.insert(shortcut_key.clone()) {
              return;
            }
          }
        }

        if let Some(automation_id) = launch_value.strip_prefix(AUTOMATION_SHORTCUT_SCHEME) {
          let _ = app.emit_to("main", AUTOMATION_SHORTCUT_EVENT, AutomationShortcutEvent {
            id: automation_id.to_string(),
            phase: "pressed".to_string(),
          });          
        } else if event.state != HotkeyState::Pressed {
          return;
        }
        // Guard against hotkey spam: ignore rapid repeats per shortcut.
        // If the lock is poisoned/unavailable, skip launching instead of bypassing this guard.
        let now = Instant::now();
        let mut fired = match fired_state_local.lock() {
          Ok(guard) => guard,
          Err(_) => return,
        };
        if let Some(prev) = fired.get(&shortcut_key) {
          if now.saturating_duration_since(*prev) < Duration::from_millis(APP_SHORTCUT_COOLDOWN_MS) {
            return;
          }
        }
        fired.insert(shortcut_key.clone(), now);
        drop(fired);
        if launch_value.strip_prefix(AUTOMATION_SHORTCUT_SCHEME).is_some() {
          return;
        }
        let _ = app.shell().open(launch_value.clone(), None);
      })
      .map_err(|e| e.to_string())?;

    guard.push(shortcut);
  }

  #[cfg(windows)]
  {
    if let Some(registry) = MOUSE_SHORTCUTS.get() {
      if let Ok(mut items) = registry.lock() {
        *items = mouse_bindings;
      }
    }
  }

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
        apps.push(ScannedApp {
          name,
          launch,
          icon,
          process_name: None,
        });
      }

      apps
    }

fn scan_steam_games() -> Vec<ScannedApp> {
  fn extract_quoted_tokens(line: &str) -> Vec<String> {
    let mut tokens = Vec::new();
    let mut in_quotes = false;
    let mut current = String::new();
    for ch in line.chars() {
      if ch == '"' {
        if in_quotes {
          tokens.push(current.clone());
          current.clear();
        }
        in_quotes = !in_quotes;
        continue;
      }
      if in_quotes {
        current.push(ch);
      }
    }
    tokens
  }

  fn get_vdf_value(content: &str, wanted_key: &str) -> Option<String> {
    for line in content.lines() {
      let tokens = extract_quoted_tokens(line);
      if tokens.len() >= 2 && tokens[0].eq_ignore_ascii_case(wanted_key) {
        return Some(tokens[1].clone());
      }
    }
    None
  }

  fn parse_reg_sz_value(key: &str, value_name: &str) -> Option<String> {
    let out = Command::new("reg")
      .args(["query", key, "/v", value_name])
      .output()
      .ok()?;
    if !out.status.success() {
      return None;
    }
    let text = String::from_utf8_lossy(&out.stdout);
    for line in text.lines() {
      if !line.contains(value_name) {
        continue;
      }
      if let Some(pos) = line.find("REG_SZ") {
        let val = line[(pos + "REG_SZ".len())..].trim();
        if !val.is_empty() {
          return Some(val.to_string());
        }
      }
    }
    None
  }

  fn detect_steam_root_paths() -> Vec<PathBuf> {
    let mut roots = Vec::<PathBuf>::new();
    let mut seen = HashSet::<String>::new();
    let mut push_unique = |p: PathBuf| {
      if !p.exists() {
        return;
      }
      let key = p.to_string_lossy().to_lowercase();
      if seen.insert(key) {
        roots.push(p);
      }
    };

    if let Ok(pf86) = std::env::var("PROGRAMFILES(X86)") {
      push_unique(PathBuf::from(pf86).join("Steam"));
    }
    if let Ok(pf) = std::env::var("PROGRAMFILES") {
      push_unique(PathBuf::from(pf).join("Steam"));
    }
    if let Ok(local) = std::env::var("LOCALAPPDATA") {
      push_unique(PathBuf::from(local).join("Steam"));
    }
    if let Some(path) = parse_reg_sz_value("HKCU\\Software\\Valve\\Steam", "SteamPath") {
      push_unique(PathBuf::from(path.replace('/', "\\")));
    }
    if let Some(path) = parse_reg_sz_value("HKLM\\SOFTWARE\\WOW6432Node\\Valve\\Steam", "InstallPath") {
      push_unique(PathBuf::from(path));
    }
    if let Some(path) = parse_reg_sz_value("HKLM\\SOFTWARE\\Valve\\Steam", "InstallPath") {
      push_unique(PathBuf::from(path));
    }
    roots
  }

  fn collect_steamapps_paths(steam_root: &Path) -> Vec<PathBuf> {
    let mut out = Vec::<PathBuf>::new();
    let mut seen = HashSet::<String>::new();
    let mut push_unique = |p: PathBuf| {
      if !p.exists() {
        return;
      }
      let key = p.to_string_lossy().to_lowercase();
      if seen.insert(key) {
        out.push(p);
      }
    };

    let main = steam_root.join("steamapps");
    push_unique(main.clone());

    let library_vdf = main.join("libraryfolders.vdf");
    let content = match std::fs::read_to_string(&library_vdf) {
      Ok(c) => c,
      Err(_) => return out,
    };

    for line in content.lines() {
      let tokens = extract_quoted_tokens(line);
      if tokens.len() < 2 {
        continue;
      }

      if tokens[0].eq_ignore_ascii_case("path") {
        let p = tokens[1].replace("\\\\", "\\");
        push_unique(PathBuf::from(p).join("steamapps"));
        continue;
      }

      // Legacy format:
      // "1"   "D:\\SteamLibrary"
      if tokens[0].chars().all(|c| c.is_ascii_digit()) {
        let raw = tokens[1].replace("\\\\", "\\");
        if raw.contains(":\\") || raw.starts_with("\\\\") {
          push_unique(PathBuf::from(raw).join("steamapps"));
        }
      }
    }

    out
  }

  fn icon_data_url_from_file(path: &Path) -> Option<String> {
    let bytes = std::fs::read(path).ok()?;
    if bytes.is_empty() {
      return None;
    }
    let ext = path
      .extension()
      .and_then(|e| e.to_str())
      .unwrap_or("")
      .to_ascii_lowercase();
    let mime = match ext.as_str() {
      "jpg" | "jpeg" => "image/jpeg",
      "png" => "image/png",
      "webp" => "image/webp",
      "bmp" => "image/bmp",
      _ => "application/octet-stream",
    };
    let b64 = base64::engine::general_purpose::STANDARD.encode(bytes);
    Some(format!("data:{};base64,{}", mime, b64))
  }

  fn find_steam_icon(steam_root: &Path, app_id: &str) -> Option<String> {
    let library_cache = steam_root.join("appcache").join("librarycache");
    if !library_cache.exists() {
      return None;
    }

    let candidates = [
      format!("{}_icon.jpg", app_id),
      format!("{}_icon.png", app_id),
      format!("{}_icon.webp", app_id),
      format!("{}_library_600x900.jpg", app_id),
      format!("{}_library_600x900_2x.jpg", app_id),
      format!("{}_library_capsule.jpg", app_id),
      format!("{}_library_capsule_2x.jpg", app_id),
      format!("{}_header.jpg", app_id),
      format!("{}_header_2x.jpg", app_id),
      format!("{}_capsule_231x87.jpg", app_id),
      format!("{}_capsule_616x353.jpg", app_id),
      format!("{}_hero.jpg", app_id),
    ];

    for file in candidates {
      let p = library_cache.join(file);
      if p.exists() {
        if let Some(data_url) = icon_data_url_from_file(&p) {
          return Some(data_url);
        }
      }
    }
    None
  }

  fn steam_icon_cdn_fallback(app_id: &str) -> Option<String> {
    if !app_id.chars().all(|c| c.is_ascii_digit()) {
      return None;
    }
    Some(format!(
      "https://cdn.cloudflare.steamstatic.com/steam/apps/{}/library_600x900.jpg",
      app_id
    ))
  }

  fn normalize_compare_key(value: &str) -> String {
    value
      .chars()
      .filter(|ch| ch.is_ascii_alphanumeric())
      .flat_map(|ch| ch.to_lowercase())
      .collect()
  }

  fn collect_steam_process_names(game_root: &Path, app_name: &str, install_dir_name: &str) -> Option<String> {
    if !game_root.exists() {
      return None;
    }

    let normalized_app = normalize_compare_key(app_name);
    let normalized_dir = normalize_compare_key(install_dir_name);
    let ignore_terms = [
      "launcher",
      "launch",
      "crash",
      "report",
      "unins",
      "uninstall",
      "setup",
      "install",
      "redist",
      "helper",
      "service",
      "anticheat",
      "easyanticheat",
      "eac",
      "battleye",
      "vc_redist",
      "benchmark",
      "config",
      "updater",
    ];

    let mut candidates = Vec::<(String, i32)>::new();
    for entry in WalkDir::new(game_root)
      .max_depth(6)
      .follow_links(false)
      .into_iter()
      .filter_map(Result::ok)
    {
      if !entry.file_type().is_file() {
        continue;
      }
      let path = entry.path();
      let ext = path
        .extension()
        .and_then(|value| value.to_str())
        .unwrap_or("")
        .to_ascii_lowercase();
      if ext != "exe" {
        continue;
      }

      let file_name = match path.file_name().and_then(|value| value.to_str()) {
        Some(value) => value.trim().to_string(),
        None => continue,
      };
      if file_name.is_empty() {
        continue;
      }

      let stem_lower = path
        .file_stem()
        .and_then(|value| value.to_str())
        .unwrap_or("")
        .trim()
        .to_ascii_lowercase();
      if stem_lower.is_empty() {
        continue;
      }

      let mut score = 0i32;
      let normalized_stem = normalize_compare_key(&stem_lower);
      if !normalized_stem.is_empty() {
        if normalized_stem == normalized_app || normalized_stem == normalized_dir {
          score += 12;
        } else if (!normalized_app.is_empty() && normalized_app.contains(&normalized_stem))
          || (!normalized_dir.is_empty() && normalized_dir.contains(&normalized_stem))
        {
          score += 6;
        }
      }

      let path_lower = path.to_string_lossy().to_ascii_lowercase();
      if path_lower.contains("win64") || path_lower.contains("x64") {
        score += 5;
      }
      if path_lower.contains("\\bin\\") || path_lower.contains("/bin/") {
        score += 3;
      }
      if stem_lower.len() <= 16 {
        score += 2;
      }

      if ignore_terms.iter().any(|term| stem_lower.contains(term) || path_lower.contains(term)) {
        score -= 10;
      }

      candidates.push((file_name, score));
    }

    candidates.sort_by(|a, b| b.1.cmp(&a.1).then_with(|| a.0.cmp(&b.0)));

    let mut seen = HashSet::<String>::new();
    let selected = candidates
      .into_iter()
      .filter(|(_, score)| *score > -8)
      .filter_map(|(file_name, _)| {
        let key = file_name.to_ascii_lowercase();
        if seen.insert(key) {
          Some(file_name)
        } else {
          None
        }
      })
      .take(6)
      .collect::<Vec<_>>();

    if selected.is_empty() {
      None
    } else {
      Some(selected.join(", "))
    }
  }

  let mut apps = Vec::<ScannedApp>::new();
  let mut seen_app_ids = HashMap::<String, usize>::new();
  let mut seen_name = HashSet::<String>::new();

  for steam_root in detect_steam_root_paths() {
    for steamapps in collect_steamapps_paths(&steam_root) {
      let rd = match std::fs::read_dir(&steamapps) {
        Ok(r) => r,
        Err(_) => continue,
      };
      for entry in rd.filter_map(Result::ok) {
        let path = entry.path();
        if !path.is_file() {
          continue;
        }
        let file_name = path
          .file_name()
          .and_then(|v| v.to_str())
          .unwrap_or("")
          .to_ascii_lowercase();
        if !file_name.starts_with("appmanifest_") || !file_name.ends_with(".acf") {
          continue;
        }
        let content = match std::fs::read_to_string(&path) {
          Ok(c) => c,
          Err(_) => continue,
        };

        let app_id = get_vdf_value(&content, "appid").or_else(|| {
          let stem = path.file_stem().and_then(|s| s.to_str()).unwrap_or("");
          stem.strip_prefix("appmanifest_").map(|s| s.to_string())
        });
        let app_id = match app_id {
          Some(id) if id.chars().all(|c| c.is_ascii_digit()) => id,
          _ => continue,
        };
        let name = match get_vdf_value(&content, "name") {
          Some(n) if !n.trim().is_empty() => n.trim().to_string(),
          _ => continue,
        };
        let install_dir_name = get_vdf_value(&content, "installdir").unwrap_or_default();
        let process_name = if !install_dir_name.trim().is_empty() {
          collect_steam_process_names(
            &steamapps.join("common").join(install_dir_name.trim()),
            &name,
            install_dir_name.trim(),
          )
        } else {
          None
        };
        let icon = find_steam_icon(&steam_root, &app_id).or_else(|| steam_icon_cdn_fallback(&app_id));

        if let Some(idx) = seen_app_ids.get(&app_id).copied() {
          if apps[idx].icon.is_none() && icon.is_some() {
            apps[idx].icon = icon;
          }
          if apps[idx].process_name.is_none() && process_name.is_some() {
            apps[idx].process_name = process_name;
          }
          continue;
        }

        let key = name.to_lowercase();
        if !seen_name.insert(key) {
          continue;
        }

        let idx = apps.len();
        seen_app_ids.insert(app_id.clone(), idx);
        apps.push(ScannedApp {
          name,
          launch: format!("steam://run/{}", app_id),
          icon,
          process_name,
        });
      }
    }
  }

  apps
}
