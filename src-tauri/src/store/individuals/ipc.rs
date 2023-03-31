use std::sync::{Mutex, Arc};

use serde_json::Value;
use tauri_plugin_store::JsonValue;
use tauri::{State, Window, Manager};

use crate::store::{AllStores, is_data_locked};

// Tauri command that creates a new individual
#[tauri::command]
pub fn individuals__create_individual(
    window: Window,
    stores: State<'_, Arc<Mutex<AllStores>>>, 
    name: &str,
    events_ids_entered: Vec<u64>
) -> Result<Value, std::string::String> {
    // Checks if the data is locked before calling the API.
    match is_data_locked() {
        true => {
            return Err("Unable to make any more changes. Data is locked.".to_string())
        },
        false => {}
    }

    match stores.lock().unwrap().individuals.create_individual(name, events_ids_entered) {
        Ok(res) => {
            // If the result was OK we fire an event to the frontend to say an individual was created
            window.emit_all("individuals__on_individual_created", res.clone()).expect("Failed to dispatch event");
            Ok(res.clone())
        }, 
        Err(err) => {
            Err(err)
        }
    }
}

// Tauri command that gets all individuals
#[tauri::command]
pub fn individuals__get_all_individuals(
    stores: State<'_, Arc<Mutex<AllStores>>>, 
) -> Vec<JsonValue> {
    stores.lock().unwrap().individuals.get_all_individuals()
}

// Tauri command that deletes an individual
#[tauri::command]
pub fn individuals__delete_individual(
    window: Window,
    stores: State<'_, Arc<Mutex<AllStores>>>,
    id: u64
) -> Result<(), String> {
    // Checks if the data is locked before calling the API.
    match is_data_locked() {
        true => {
            return Err("Unable to make any more changes. Data is locked.".to_string())
        },
        false => {}
    }

    match stores.lock().unwrap().individuals.delete_individual(id) {
        Ok(res) => {
            // If the result was OK we fire an event to the frontend to say an individual was deleted
            window.emit_all("individuals__on_individual_deleted", res.clone()).expect("Failed to dispatch event");
            Ok(res.clone())
        }, 
        Err(err) => {
            Err(err)
        }
    }
}

// Tauri command that edits an individual's events
#[tauri::command]
pub fn individuals__edit_events(
    window: Window,
    stores: State<'_, Arc<Mutex<AllStores>>>, 
    individual_id: u64,
    events_ids_entered: Vec<u64>
) -> Result<(), std::string::String> {
    // Checks if the data is locked before calling the API.
    match is_data_locked() {
        true => {
            return Err("Unable to make any more changes. Data is locked.".to_string())
        },
        false => {}
    }

    match stores.lock().unwrap().individuals.edit_events(individual_id, events_ids_entered) {
        Ok(res) => {
            // We don't care that this is firing an individual created event, the frontend does the funny business
            window.emit_all("individuals__on_individual_created", res.clone()).expect("Failed to dispatch event");
            Ok(res.clone())
        }, 
        Err(err) => {
            Err(err)
        }
    }
}