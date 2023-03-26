use std::error::Error;

use serde_json::json;
use serde_json::Value;
use tauri::{Wry, App, Manager};
use tauri_plugin_store::{ Store, JsonValue };

use super::EventType;

pub struct EventsStore {
    pub store: Store<Wry>
}

impl EventsStore {
    pub fn save(&mut self) -> () {
        self.store.save().expect("Failed to save EventsStore");
    }

    pub fn init(&mut self) -> () {
        if !self.store.has("events") {
            self.store.insert("events".to_string(), json!([]))
                .expect("Failed to create default empty array in EventsStore");
        }

        self.save();
    }

    pub fn get_all_events(&mut self) -> Vec<JsonValue> {
        let all_events = &mut self.store.get("events").unwrap().as_array().cloned().unwrap();

        all_events.clone()
    }

    pub fn find_event_by<T: for<'a> FnMut(&'a &JsonValue) -> bool>(&mut self, mut predicate: T) -> Result<JsonValue, &str> {
        let all_events = self.get_all_events();

        let binding = all_events.to_vec();
        let result = binding.iter().clone().find(&mut predicate);

        match result {
            Some(event) => Ok(event.to_owned().to_owned()),
            None => Err("Failed to find event using predicate"),
        }
    }

    pub fn get_event_by_id(&mut self, id: u64) -> Result<JsonValue, String> {
        match self.find_event_by(|x| x.get("id")
            .expect("Failed to get ID in get_event_by_id for iterator")
            .as_u64()
            .unwrap() == id
        ) {
            Ok(event) => Ok(event.to_owned().to_owned()),
            Err(_) => Err(format!("No event found with ID {}", id)),
        }
    }

    pub fn create_event(&mut self, name: &str, kind: EventType) -> Result<Value, String> {
        let all_events = &mut self.get_all_events();

        match self.find_event_by(|x| x.get("name")
            .expect("Failed to get name for create_event existing check")
            .as_str()
            .unwrap() == name
        ) {
            Ok(_) => {
                return Err(format!("Event with name '{}' already exists.", name))
            },
            _ => {}
        };

        let data = json!({
            "id": all_events.len() + 1,
            "name": name,
            "kind": kind,
        });

        all_events.push(data.clone());

        let _ = &self.store.insert("events".to_string(), serde_json::to_value(all_events).unwrap());

        self.save();

        Ok(data)
    }
}