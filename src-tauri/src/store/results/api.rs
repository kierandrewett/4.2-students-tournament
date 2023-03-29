use std::ops::Index;

use serde_json::json;
use serde_json::Value;
use tauri::{Wry};
use tauri_plugin_store::{ Store, JsonValue };

use super::ResultsItem;

pub struct ResultsStore {
    pub store: Store<Wry>
}

impl ResultsStore {
    pub fn save(&mut self) -> () {
        self.store.save().expect("Failed to save ResultsStore");
    }

    pub fn init(&mut self) -> () {
        if !self.store.has("results") {
            self.store.insert("results".to_string(), json!([]))
                .expect("Failed to create default empty array in ResultsStore");
        }

        self.save();
    }

    pub fn get_all_results(&mut self) -> Vec<JsonValue> {
        let all_results = &mut self.store.get("results").unwrap().as_array().cloned().unwrap();

        all_results.clone()
    }

    pub fn find_result_by<T: for<'a> FnMut(&'a &JsonValue) -> bool>(&mut self, mut predicate: T) -> Result<JsonValue, &str> {
        let all_results = self.get_all_results();

        let binding = all_results.to_vec();
        let result = binding.iter().clone().find(&mut predicate);

        match result {
            Some(res) => Ok(res.to_owned().to_owned()),
            None => Err("Failed to find result using predicate"),
        }
    }

    pub fn find_result_index_by<T: for<'a> FnMut(&'a JsonValue) -> bool>(&mut self, predicate: T) -> Result<usize, &str> {
        let all_results = &mut self.get_all_results();

        let binding = all_results.to_vec();
        let result = binding.iter().clone().position(predicate);

        match result {
            Some(res) => Ok(res.to_owned().to_owned()),
            None => Err("Failed to find result using predicate"),
        }
    }

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

    pub fn record_event_results(&mut self, event_id: u64, results: Vec<ResultsItem>) -> Result<JsonValue, String> {
        let all_results = &mut self.get_all_results();

        let result_by_event_id = self.get_result_by_event_id(event_id);
        let result: &mut JsonValue = &mut match &result_by_event_id {
            Ok(t) => t.to_owned(),
            _ => json!({
                "event_id": event_id,
                "results": results
            })
        };

        let result_index = &self.find_result_index_by(|t| t
            .get("event_id")
            .expect("Failed to get ID from result.")
            .as_u64()
            .expect("Failed to cast ID to u64.") == event_id
        ).expect("Failed to get index of result in list.");

        let result_data = result
            .as_object_mut()
            .unwrap();

        result_data.insert("results".to_string(), serde_json::to_value(results).expect("Failed to convert results to json."));

        let result_data_serialised = serde_json::to_value(&result_data)
            .expect("Failed to serialise new result data");

        let _ = std::mem::replace(&mut all_results[*result_index], result_data_serialised);        

        let _ = &self.store.insert("results".to_string(), serde_json::to_value(all_results).unwrap());

        self.save();

        Ok(serde_json::to_value(&result_data)
            .expect("Failed to serialise new result data"))
    }
}