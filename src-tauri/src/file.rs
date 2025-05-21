use crate::AppPath;
use chrono::Utc;
use std::fs::{metadata, rename, OpenOptions};
use std::io::Write;
use std::path::Path;
use tauri::State;

const BASE_DIR: &str = "Nutstore";
const APP_DIR: &str = "vaultique_test";
const MODULE_DIR: &str = "log";
const LOG_FILE_NAME: &str = "log.log";

#[tauri::command]
pub fn append_log(text: &str, app_path: State<'_, AppPath>) -> Result<(), String> {
    // 获取应用程序的路径
    let path = get_log_file_path(app_path);
    let _check = check_and_create_log_file(&path);

    let mut file = OpenOptions::new()
        .append(true)
        .open(&path)
        .map_err(|e| format!("文件打开失败: {}", e))?;
    file.write_all(text.as_bytes())
        .map_err(|e| format!("写入失败: {}", e))?;
    Ok(())
}

pub fn check_and_create_log_file(path: &str) -> Result<(), String> {
    if !Path::new(&path).exists() {
        return create_log_file(path);
    }
    let metadata = metadata(path).map_err(|e| format!("获取元数据失败: {}", e))?;
    if !metadata.is_file() {
        return create_log_file(path);
    }
    let file_size = metadata.len();
    // 文件大小超过100 旧文件重命名 创建新文件
    if file_size > 100 * 1024 {
        rename_log_file(path)?;
        return create_log_file(path);
    }
    Ok(())
}

fn create_log_file(path: &str) -> Result<(), String> {
    OpenOptions::new()
        .create(true)
        .write(true)
        .open(path)
        .map_err(|e| format!("日志文件创建文件失败: {}", e))?;
    Ok(())
}

fn rename_log_file(path: &str) -> Result<(), String> {
    let timestamp = Utc::now().timestamp();
    // 获取文件的父目录
    let parent_dir = Path::new(path).parent().ok_or("获取父目录失败")?;
    // 获取文件的扩展名
    let extension = Path::new(path)
        .extension()
        .and_then(|ext| ext.to_str())
        .unwrap_or("");
    // 获取文件的名称
    let file_name = Path::new(path)
        .file_stem()
        .and_then(|name| name.to_str())
        .unwrap_or("");
    // 拼接新的文件名
    let new_file_name = format!("{}-{}.{}", file_name, timestamp, extension);
    // 拼接新的文件路径
    let new_file_path = parent_dir.join(new_file_name);
    rename(path, &new_file_path).map_err(|e| format!("重命名文件失败: {}", e))
}

fn get_log_file_path(app_path: State<'_, AppPath>) -> String {
    let base_path = &app_path.0;
    let log_dir = base_path.join(BASE_DIR).join(APP_DIR).join(MODULE_DIR);
    let log_file = log_dir.join(LOG_FILE_NAME);
    log_file.to_str().unwrap().to_string()
}
