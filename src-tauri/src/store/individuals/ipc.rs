use std::sync::{Mutex, Arc};

use serde_json::Value;
use tauri_plugin_store::JsonValue;
use tauri::{State, Window, Manager};

use crate::store::AllStores;

#[tauri::command]
pub fn individuals__create_individual(
    window: Window,
    stores: State<'_, Arc<Mutex<AllStores>>>, 
    name: &str,
) -> Result<Value, std::string::String> {
    match stores.lock().unwrap().individuals.create_individual(name) {
        Ok(res) => {
            window.emit_all("individuals__on_individual_created", res.clone()).expect("Failed to dispatch event");
            Ok(res.clone())
        }, 
        Err(err) => {
            Err(err)
        }
    }
}
