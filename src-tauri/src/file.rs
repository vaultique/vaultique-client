use std::fs::OpenOptions;
use std::io::Write;

#[tauri::command]
pub fn append_log(path: &str, text: &str) -> Result<(), String> {
    let mut file = OpenOptions::new()
        .append(true)
        .open(path)
        .map_err(|e| format!("文件打开失败: {}", e))?;
    file.write_all(text.as_bytes())
        .map_err(|e| format!("写入失败: {}", e))?;
    Ok(())
}
