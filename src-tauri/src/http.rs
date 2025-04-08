use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::time::Instant;
use tauri::http::Method;
use tauri_plugin_http::reqwest;

#[derive(Debug, Deserialize)]
pub struct HttpRequestOptions {
    url: String,
    method: String,
    headers: Option<HashMap<String, String>>,
    params: Option<HashMap<String, String>>,
    body: Option<serde_json::Value>,
}

#[derive(Debug, Serialize)]
pub struct HttpResponse {
    status: u16,
    headers: HashMap<String, String>,
    body: serde_json::Value,
    text: Option<String>,
    duration: f64,
}

#[tauri::command]
pub async fn send_http_request(options: HttpRequestOptions) -> Result<HttpResponse, String> {
    let start_time = Instant::now();

    // 创建 HTTP 客户端
    let client = reqwest::Client::new();

    // 解析 HTTP 方法
    let method = match options.method.to_uppercase().as_str() {
        "GET" => Method::GET,
        "POST" => Method::POST,
        "PUT" => Method::PUT,
        "DELETE" => Method::DELETE,
        "PATCH" => Method::PATCH,
        "HEAD" => Method::HEAD,
        "OPTIONS" => Method::OPTIONS,
        _ => return Err(format!("Invalid HTTP method: {}", options.method)),
    };

    // 构建请求
    let mut request = client.request(method, &options.url);

    // 添加查询参数
    if let Some(params) = options.params {
        request = request.query(&params);
    }

    // 添加请求头
    if let Some(headers) = options.headers {
        for (key, value) in headers {
            request = request.header(&key, value);
        }
    }

    // 添加请求体
    if let Some(body) = options.body {
        request = request.body(
            serde_json::to_string(&body).map_err(|e| format!("Failed to serialize body: {}", e))?,
        );
    }

    // 发送请求并获取响应
    let response = request
        .timeout(std::time::Duration::from_secs(10))
        .send()
        .await
        .map_err(|e| {
            // 记录详细错误信息
            format!("网络错误: {}", e)
        })?;

    // 计算请求耗时
    let duration = start_time.elapsed().as_secs_f64();

    // 处理响应头
    let mut response_headers = HashMap::new();
    for (key, value) in response.headers().iter() {
        response_headers.insert(
            key.to_string(),
            value.to_str().unwrap_or_default().to_string(),
        );
    }

    // 读取响应体
    let status = response.status().as_u16();
    let text = response
        .text()
        .await
        .map_err(|e| format!("Failed to read response body: {}", e))?;

    // 尝试解析为 JSON，如果失败则返回原始文本
    let json_body = serde_json::from_str(&text).unwrap_or(serde_json::Value::String(text.clone()));

    Ok(HttpResponse {
        status,
        headers: response_headers,
        body: json_body,
        text: Some(text),
        duration,
    })
}
