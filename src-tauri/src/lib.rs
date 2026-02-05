use tauri_plugin_shell::ShellExt;

#[tauri::command]
fn open_external(app: tauri::AppHandle, url: String) -> Result<(), String> {
  app
    .shell()
    .open(url, None)
    .map_err(|e| e.to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .plugin(tauri_plugin_updater::Builder::new().build())
    .plugin(tauri_plugin_shell::init())
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }
      Ok(())
    })
    .invoke_handler(tauri::generate_handler![open_external])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
