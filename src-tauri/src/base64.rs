use base64::{Engine as _, engine::general_purpose};

#[derive(Debug)]
enum Base64DecodeError {
    DecodeError,
    NotUtf8,
}

impl std::fmt::Display for Base64DecodeError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Base64DecodeError::DecodeError => write!(f, "解码失败"),
            Base64DecodeError::NotUtf8 => write!(f, "非 UTF-8 字节"),
        }
    }
}

#[tauri::command]
pub fn decode(text: &str) -> String {
    general_purpose::STANDARD
    .decode(text)
    .map_err(|_| Base64DecodeError::DecodeError)
    .and_then(|bytes| String::from_utf8(bytes).map_err(|_| Base64DecodeError::NotUtf8))
    .unwrap_or_else(|e| e.to_string())
}

#[tauri::command]
pub fn encode(text: &str) -> String {
    let encoded: String = general_purpose::STANDARD.encode(text);
    encoded
}
