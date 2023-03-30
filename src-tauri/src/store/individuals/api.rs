use serde_json::json;
use serde_json::Value;
use tauri::{Wry};
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
        let all_individuals = &mut self.store.get("individuals").unwrap().as_array().cloned().unwrap();

        all_individuals.clone()
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

    pub fn find_individual_index_by<T: for<'a> FnMut(&'a JsonValue) -> bool>(&mut self, predicate: T) -> Result<usize, &str> {
        let all_individuals = self.get_all_individuals();

        let binding = all_individuals.to_vec();
        let result = binding.iter().clone().position(predicate);

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

    pub fn create_individual(&mut self, name: &str, events_ids_entered: Vec<u64>) -> Result<Value, String> {
        let all_individuals = &mut self.get_all_individuals();

        if all_individuals.len() >= 20 {
            return Err("Cannot create any more teams. Maximum of 20 teams reached.".to_string())
        }

        let data = json!({
            "id": all_individuals.len() + 1,
            "name": name,
            "events_ids_entered": events_ids_entered
        });

        all_individuals.push(data.clone());

        let _ = &self.store.insert("individuals".to_string(), serde_json::to_value(all_individuals).unwrap());

        self.save();

        Ok(data)
    }

    pub fn delete_individual(&mut self, id: u64) -> Result<(), String> {
        let all_individuals = &mut self.get_all_individuals().to_owned();

        match self.find_individual_by(|x| x.get("id")
            .expect("Failed to get id for delete_individual existing check")
            .as_u64()
            .unwrap() == id
        ) {
            Ok(_) => {},
            _ => {
                return Err(format!("Individual with ID '{}' does not exist.", id))
            }
        };

        let filtered: Vec<&JsonValue> = all_individuals
            .iter()
            .filter(|x| x
                .get("id")
                .expect("Failed to get ID in iterator")
                .as_u64()
                .expect("Failed to cast as u64") != id
            ).collect::<_>();

        let _ = &self.store.insert("individuals".to_string(), serde_json::to_value(filtered).unwrap());

        self.save();

        Ok(())
    }

    pub fn edit_events(&mut self, id: u64, events_ids_entered: Vec<u64>) -> Result<(), std::string::String> {
        let all_individuals = &mut self.get_all_individuals();

        let individual_by_id = self.get_individual_by_id(id);
        let individual: &mut JsonValue = &mut match &individual_by_id {
            Ok(t) => t.to_owned(),
            _ => {
                return Err(format!("Individual with ID '{}' does not exist.", id))
            }
        };

        let individual_index = &self.find_individual_index_by(|t| t
            .get("id")
            .expect("Failed to get ID from individual.")
            .as_u64()
            .expect("Failed to cast ID to u64.") == id
        ).expect("Failed to get index of individual in list.");

        let individual_data = individual
            .as_object_mut()
            .unwrap();

        individual_data.insert("events_ids_entered".to_string(), events_ids_entered.into());

        let individual_data_serialised = serde_json::to_value(individual_data)
            .expect("Failed to serialise new individual data");

        let _ = std::mem::replace(&mut all_individuals[*individual_index], individual_data_serialised);        

        let _ = &self.store.insert("individuals".to_string(), serde_json::to_value(all_individuals).unwrap());

        self.save();

        Ok(())
    }
}