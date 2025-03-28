use uuid::Uuid;

#[tauri::command]
pub fn uuid_generate() -> String {
    let id = Uuid::new_v4();
    id.to_string()
}