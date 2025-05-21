mod base64;
mod file;
mod http;
mod uuid;

use base64::{decode, encode};
use file::append_log;
use http::send_http_request;
use tauri::Manager;
use uuid::uuid_generate;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_sql::Builder::new().build())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_http::init())
        .invoke_handler(tauri::generate_handler![
            encode,
            decode,
            uuid_generate,
            send_http_request,
            append_log
        ])
        .setup(|app| {
            let path = app.path().document_dir().unwrap();
            app.manage(AppPath(Arc::new(path.clone())));
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

use std::path::PathBuf;
use std::sync::Arc;

pub struct AppPath(pub Arc<PathBuf>);
