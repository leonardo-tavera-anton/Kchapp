use axum::{
    routing::{get, post},
    extract::Path,
    Json, Router,
};
use serde::{Deserialize, Serialize};
use tower_http::cors::CorsLayer;
use std::env;

#[derive(Serialize)]
struct HealthResponse {
    status: String,
}

#[tokio::main]
async fn main() {
    dotenvy::dotenv().ok();
    let port = env::var("PORT").unwrap_or_else(|_| "4000".to_string());
    let addr = format!("0.0.0.0:{}", port);

    let app = Router::new()
        .route("/health", get(health_check))
        .route("/api/feed/:user_id", get(get_feed))
        .route("/api/swipe", post(handle_swipe))
        .layer(CorsLayer::permissive());

    println!("Servidor Rust corriendo en {}", addr);
    let listener = tokio::net::TcpListener::bind(&addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

async fn health_check() -> Json<HealthResponse> {
    Json(HealthResponse {
        status: "Backend en Rust (Axum) activo 🚀".to_string(),
    })
}

async fn get_feed(Path(user_id): Path<String>) -> Json<serde_json::Value> {
    // Aquí conectarás con Supabase (vía REST API con reqwest o SQLx)
    Json(serde_json::json!({ "user_id": user_id, "profiles": [] }))
}

#[derive(Deserialize)]
struct SwipePayload {
    user_id: String,
    target_id: String,
    action: String, // 'like' o 'pass'
}

async fn handle_swipe(Json(payload): Json<SwipePayload>) -> Json<serde_json::Value> {
    // Lógica para registrar swipe y evaluar match mutuo
    Json(serde_json::json!({ "success": true, "match": false }))
}