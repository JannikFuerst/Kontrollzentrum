use tauri::Manager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .plugin(tauri_plugin_updater::Builder::new().build())
    .setup(|app| {
      // Optional Log (nur Debug)
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }

      // ✅ Auto update check on startup (non-blocking)
      let handle = app.handle().clone();
      tauri::async_runtime::spawn(async move {
        // Check for updates
        match tauri_plugin_updater::check(&handle).await {
          Ok(Some(update)) => {
            // Download update
            if let Err(e) = update.download_and_install(|_chunk, _total| {}, || {}).await {
              eprintln!("Updater: download/install failed: {e}");
            } else {
              // Restart after successful install
              let _ = handle.restart();
            }
          }
          Ok(None) => {
            // No update
          }
          Err(e) => {
            eprintln!("Updater: check failed: {e}");
          }
        }
      });

      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
