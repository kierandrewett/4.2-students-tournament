use std::sync::{Mutex, Arc};

use serde_json::Value;
use tauri_plugin_store::JsonValue;
use tauri::{State, Window, Manager};

use crate::store::{AllStores, is_data_locked};

use super::ResultsItem;

#[tauri::command]
pub fn results__get_all_results(
    stores: State<'_, Arc<Mutex<AllStores>>>, 
) -> Vec<JsonValue> {
    stores.lock().unwrap().results.get_all_results()
}

#[tauri::command]
pub fn results__record_event_results(
    window: Window,
    stores: State<'_, Arc<Mutex<AllStores>>>, 
    event_id: u64,
    results: Vec<ResultsItem>,
) -> Result<Value, std::string::String> {
    match stores.lock().unwrap().results.record_event_results(event_id, results) {
        Ok(res) => {
            window.emit_all("results__on_results_recorded", res.clone()).expect("Failed to dispatch event");
            Ok(res.clone())
        }, 
        Err(err) => {
            Err(err)
        }
    }
}

#[tauri::command]
pub fn results__mark_event_done(
    window: Window,
    stores: State<'_, Arc<Mutex<AllStores>>>, 
    event_id: u64,
    done: bool
) -> Result<(), std::string::String> {
    stores.lock().unwrap().results.mark_event_done(event_id, done)
}