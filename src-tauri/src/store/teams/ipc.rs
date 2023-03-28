use std::sync::{Mutex, Arc};

use serde_json::Value;
use tauri_plugin_store::JsonValue;
use tauri::{State, Window, Manager};

use crate::store::AllStores;

use super::TeamPlayer;

#[tauri::command]
pub fn teams__create_team(
    window: Window,
    stores: State<'_, Arc<Mutex<AllStores>>>, 
    name: &str,
    events_ids_entered: Vec<u64>
) -> Result<Value, std::string::String> {
    match stores.lock().unwrap().teams.create_team(name, events_ids_entered) {
        Ok(res) => {
            window.emit_all("teams__on_team_created", res.clone()).expect("Failed to dispatch event");
            Ok(res.clone())
        }, 
        Err(err) => {
            Err(err)
        }
    }
}

#[tauri::command]
pub fn teams__add_player_to_team(
    window: Window,
    stores: State<'_, Arc<Mutex<AllStores>>>, 
    id: u64,
    player: TeamPlayer
) -> Result<(), std::string::String> {
    match stores.lock().unwrap().teams.add_player_to_team(id, player) {
        Ok(res) => {
            window.emit_all("teams__on_team_player_added", res.clone()).expect("Failed to dispatch event");
            Ok(res.clone())
        }, 
        Err(err) => {
            Err(err)
        }
    }
}

#[tauri::command]
pub fn teams__get_all_teams(
    stores: State<'_, Arc<Mutex<AllStores>>>, 
) -> Vec<JsonValue> {
    stores.lock().unwrap().teams.get_all_teams()
}

#[tauri::command]
pub fn teams__delete_team(
    window: Window,
    stores: State<'_, Arc<Mutex<AllStores>>>,
    id: u64
) -> Result<(), String> {
    match stores.lock().unwrap().teams.delete_team(id) {
        Ok(res) => {
            window.emit_all("teams__on_team_deleted", res.clone()).expect("Failed to dispatch event");
            Ok(res.clone())
        }, 
        Err(err) => {
            Err(err)
        }
    }
}
