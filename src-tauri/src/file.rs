use std::fs::OpenOptions;
use std::io::Write;

#[tauri::command]
pub fn append_log(path: &str, text: &str) {
    let mut file = OpenOptions::new()
        .append(true)
        .open(path)
        .expect("文件打开失败");
    file.write_all(text.as_bytes()).expect("写入失败");
}
