use std::error::Error;

use serde_json::json;
use serde_json::Value;
use tauri::{Wry, App, Manager};
use tauri_plugin_store::{ Store, JsonValue };

pub struct IndividualsStore {
    pub store: Store<Wry>
}

impl IndividualsStore {
    pub fn save(&mut self) -> () {
        self.store.save().expect("Failed to save IndividualsStore");
    }

    pub fn init(&mut self) -> () {
        if !self.store.has("individuals") {
            self.store.insert("individuals".to_string(), json!([]))
                .expect("Failed to create default empty array in IndividualsStore");
        }

        self.save();
    }

    pub fn get_all_individuals(&mut self) -> Vec<JsonValue> {
        let all_events = &mut self.store.get("individuals").unwrap().as_array().cloned().unwrap();

        all_events.clone()
    }

    pub fn find_individual_by<T: for<'a> FnMut(&'a &JsonValue) -> bool>(&mut self, mut predicate: T) -> Result<JsonValue, &str> {
        let all_individuals = self.get_all_individuals();

        let binding = all_individuals.to_vec();
        let result = binding.iter().clone().find(&mut predicate);

        match result {
            Some(event) => Ok(event.to_owned().to_owned()),
            None => Err("Failed to find individual using predicate"),
        }
    }

    pub fn get_individual_by_id(&mut self, id: u64) -> Result<JsonValue, String> {
        match self.find_individual_by(|x| x.get("id")
            .expect("Failed to get ID in get_individual_by_id for iterator")
            .as_u64()
            .unwrap() == id
        ) {
            Ok(event) => Ok(event.to_owned().to_owned()),
            Err(_) => Err(format!("No individual found with ID {}", id)),
        }
    }

    pub fn create_individual(&mut self, name: &str) -> Result<Value, String> {
        let all_individuals = &mut self.get_all_individuals();

        let data = json!({
            "id": all_individuals.len() + 1,
            "name": name,
        });

        all_individuals.push(data.clone());

        let _ = &self.store.insert("individuals".to_string(), serde_json::to_value(all_individuals).unwrap());

        self.save();

        Ok(data)
    }
}