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
    events_ids_entered: Vec<u64>
) -> Result<Value, std::string::String> {
    match stores.lock().unwrap().individuals.create_individual(name, events_ids_entered) {
        Ok(res) => {
            window.emit_all("individuals__on_individual_created", res.clone()).expect("Failed to dispatch event");
            Ok(res.clone())
        }, 
        Err(err) => {
            Err(err)
        }
    }
}

#[tauri::command]
pub fn individuals__get_all_individuals(
    stores: State<'_, Arc<Mutex<AllStores>>>, 
) -> Vec<JsonValue> {
    stores.lock().unwrap().individuals.get_all_individuals()
}

#[tauri::command]
pub fn individuals__delete_individual(
    window: Window,
    stores: State<'_, Arc<Mutex<AllStores>>>,
    id: u64
) -> Result<(), String> {
    match stores.lock().unwrap().individuals.delete_individual(id) {
        Ok(res) => {
            window.emit_all("individuals__on_individual_deleted", res.clone()).expect("Failed to dispatch event");
            Ok(res.clone())
        }, 
        Err(err) => {
            Err(err)
        }
    }
}
