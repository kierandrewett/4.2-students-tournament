use std::fs;
use std::ops::Index;
use std::path::PathBuf;

use serde_json::json;
use serde_json::Value;
use tauri::{Wry};
use tauri_plugin_store::{ Store, JsonValue };

use crate::store::get_data_dir;
use crate::unlock_data;

use super::ResultsItem;

pub struct ResultsStore {
    pub store: Store<Wry>
}

// The ResultsStore implementation
impl ResultsStore {
    // Helper function for saving the store
    pub fn save(&mut self) -> () {
        self.store.save().expect("Failed to save ResultsStore");
    }

    // Inits the store and its default keys
    pub fn init(&mut self) -> () {
        if !self.store.has("results") {
            self.store.insert("results".to_string(), json!([]))
                .expect("Failed to create default empty array in ResultsStore");
        }

        self.save();
    }

    // Gets all the results from the store
    pub fn get_all_results(&mut self) -> Vec<JsonValue> {
        let all_results = &mut self.store.get("results").unwrap().as_array().cloned().unwrap();

        all_results.clone()
    }

    // Finds a result using a predicate
    pub fn find_result_by<T: for<'a> FnMut(&'a &JsonValue) -> bool>(&mut self, mut predicate: T) -> Result<JsonValue, &str> {
        let all_results = self.get_all_results();

        let binding = all_results.to_vec();
        let result = binding.iter().clone().find(&mut predicate);

        match result {
            Some(res) => Ok(res.to_owned().to_owned()),
            None => Err("Failed to find result using predicate"),
        }
    }

    // Finds a result using a predicate and returns the index
    pub fn find_result_index_by<T: for<'a> FnMut(&'a JsonValue) -> bool>(&mut self, predicate: T) -> Result<usize, &str> {
        let all_results = &mut self.get_all_results();

        let binding = all_results.to_vec();
        let result = binding.iter().clone().position(predicate);

        match result {
            Some(res) => Ok(res.to_owned().to_owned()),
            None => Err("Failed to find result using predicate"),
        }
    }

    // Gets a result by its event ID
    pub fn get_result_by_event_id(&mut self, id: u64) -> Result<JsonValue, String> {
        match self.find_result_by(|x| x.get("event_id")
            .expect("Failed to get event ID in get_result_by_event_id for iterator")
            .as_u64()
            .unwrap() == id
        ) {
            Ok(event) => Ok(event.to_owned().to_owned()),
            Err(_) => Err(format!("No result found with event ID {}", id)),
        }
    }

    // Record an event's results
    pub fn record_event_results(&mut self, event_id: u64, results: Vec<ResultsItem>) -> Result<JsonValue, String> {
        let all_results = &mut self.get_all_results();

        let result_by_event_id = self.get_result_by_event_id(event_id);

        let mut does_result_exist = true;

        let result: &mut JsonValue = &mut match &result_by_event_id {
            Ok(t) => t.to_owned(),
            _ => {
                does_result_exist = false;
                json!({
                    "event_id": event_id,
                    "results": results
                })
            }
        };

        let mut result_index = all_results.len();

        if does_result_exist {
            result_index = self.find_result_index_by(|t| t
                .get("event_id")
                .expect("Failed to get ID from result.")
                .as_u64()
                .expect("Failed to cast ID to u64.") == event_id
            ).expect("Failed to get result index.");
        }

        let result_data = result
            .as_object_mut()
            .unwrap();

        result_data.insert("results".to_string(), serde_json::to_value(results).expect("Failed to convert results to json."));

        let result_data_serialised = serde_json::to_value(&result_data)
            .expect("Failed to serialise new result data");

        if all_results.get(result_index).is_some() {
            let _ = std::mem::replace(&mut all_results[result_index], result_data_serialised); 
        } else {
            all_results.insert(result_index, result_data_serialised);
        }

        let _ = &self.store.insert("results".to_string(), serde_json::to_value(all_results).unwrap());

        self.save();

        Ok(serde_json::to_value(&result_data)
            .expect("Failed to serialise new result data"))
    }

    // Mark an event as done
    pub fn mark_event_done(&mut self, event_id: u64, done: bool) -> Result<(), String> {
        let all_results = &mut self.get_all_results();

        let result_by_event_id = self.get_result_by_event_id(event_id);

        let result: &mut JsonValue = &mut match &result_by_event_id {
            Ok(t) => t.to_owned(),
            _ => {
                return Err(format!("Event with ID '{}' does not exist.", event_id))
            }
        };

        let result_index = self.find_result_index_by(|t| t
                .get("event_id")
                .expect("Failed to get ID from result.")
                .as_u64()
                .expect("Failed to cast ID to u64.") == event_id
            ).expect("Failed to get result index.");

        let result_data = result
            .as_object_mut()
            .unwrap();

        result_data.insert("done".to_string(), serde_json::Value::Bool(done));

        let result_data_serialised = serde_json::to_value(&result_data)
            .expect("Failed to serialise new result data");

        let _ = std::mem::replace(&mut all_results[result_index], result_data_serialised); 
        let _ = &self.store.insert("results".to_string(), serde_json::to_value(all_results).unwrap());

        self.save();

        Ok(())
    }

    // Nukes the whole results store
    pub fn reset_all(&mut self) -> Result<(), ()> {
        let _ = &self.store.insert("results".to_string(), serde_json::Value::Array(vec![]));

        self.save();

        unlock_data();

        Ok(())
    }
}