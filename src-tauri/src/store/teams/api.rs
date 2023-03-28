use serde_json::json;
use serde_json::Value;
use tauri::{Wry};
use tauri_plugin_store::{ Store, JsonValue };

use super::TeamPlayer;

pub struct TeamsStore {
    pub store: Store<Wry>
}

impl TeamsStore {
    pub fn save(&mut self) -> () {
        self.store.save().expect("Failed to save TeamsStore");
    }

    pub fn init(&mut self) -> () {
        if !self.store.has("teams") {
            self.store.insert("teams".to_string(), json!([]))
                .expect("Failed to create default empty array in TeamsStore");
        }

        self.save();
    }

    pub fn get_all_teams(&mut self) -> Vec<JsonValue> {
        let all_teams = &mut self.store.get("teams").unwrap().as_array().cloned().unwrap();

        all_teams.clone()
    }

    pub fn find_team_by<T: for<'a> FnMut(&'a &JsonValue) -> bool>(&mut self, mut predicate: T) -> Result<JsonValue, &str> {
        let all_teams = self.get_all_teams();

        let binding = all_teams.to_vec();
        let result = binding.iter().clone().find(&mut predicate);

        match result {
            Some(event) => Ok(event.to_owned().to_owned()),
            None => Err("Failed to find team using predicate"),
        }
    }

    pub fn find_team_index_by<T: for<'a> FnMut(&'a JsonValue) -> bool>(&mut self, predicate: T) -> Result<usize, &str> {
        let all_teams = self.get_all_teams();

        let binding = all_teams.to_vec();
        let result = binding.iter().clone().position(predicate);

        match result {
            Some(event) => Ok(event.to_owned().to_owned()),
            None => Err("Failed to find team using predicate"),
        }
    }

    pub fn get_team_by_id(&mut self, id: u64) -> Result<JsonValue, String> {
        match self.find_team_by(|x| x.get("id")
            .expect("Failed to get ID in get_team_by_id for iterator")
            .as_u64()
            .unwrap() == id
        ) {
            Ok(event) => Ok(event.to_owned().to_owned()),
            Err(_) => Err(format!("No team found with ID {}", id)),
        }
    }

    pub fn create_team(&mut self, name: &str, events_ids_entered: Vec<u64>) -> Result<Value, String> {
        let all_teams = &mut self.get_all_teams();

        let data = json!({
            "id": all_teams.len() + 1,
            "name": name,
            "events_ids_entered": events_ids_entered
        });

        all_teams.push(data.clone());

        let _ = &self.store.insert("teams".to_string(), serde_json::to_value(all_teams).unwrap());

        self.save();

        Ok(data)
    }

    pub fn delete_team(&mut self, id: u64) -> Result<(), String> {
        let all_teams = &mut self.get_all_teams().to_owned();

        match self.find_team_by(|x| x.get("id")
            .expect("Failed to get id for delete_team existing check")
            .as_u64()
            .unwrap() == id
        ) {
            Ok(_) => {},
            _ => {
                return Err(format!("Team with ID '{}' does not exist.", id))
            }
        };

        let filtered: Vec<&JsonValue> = all_teams
            .iter()
            .filter(|x| x
                .get("id")
                .expect("Failed to get ID in iterator")
                .as_u64()
                .expect("Failed to cast as u64") != id
            ).collect::<_>();

        let _ = &self.store.insert("teams".to_string(), serde_json::to_value(filtered).unwrap());

        self.save();

        Ok(())
    }

    pub fn add_player_to_team(&mut self, id: u64, player: TeamPlayer) -> Result<(), std::string::String> {
        let all_teams = &mut self.get_all_teams();

        let team_by_id = self.get_team_by_id(id);
        let team: &mut JsonValue = &mut match &team_by_id {
            Ok(t) => t.to_owned(),
            _ => {
                return Err(format!("Team with ID '{}' does not exist.", id))
            }
        };

        let team_index = &self.find_team_index_by(|t| t
            .get("id")
            .expect("Failed to get ID from team.")
            .as_u64()
            .expect("Failed to cast ID to u64.") == id
        ).expect("Failed to get index of team in list.");

        let team_data = team
            .as_object_mut()
            .unwrap();

        let players_key = team_data.get_mut("players");

        fn serialise_player(players_list: Vec<Value>, player: TeamPlayer) -> Value {
            let mut serialised = serde_json::to_value(player).expect("Failed to parse player as json value.");
                
            serialised
                .as_object_mut()
                .unwrap()
                .insert("id".to_owned(), players_list.len().into());

            serialised
        }

        let mut serialised_player = None;

        match players_key {
            Some(new_players) => {
                let new_players_list = new_players.as_array_mut().expect("Failed to cast new players as array.");

                serialised_player = Some(serialise_player(new_players_list.to_vec(), player));

                new_players_list.append(&mut vec![serialised_player.into()]);
    
                let json = serde_json::to_value(new_players_list).expect("Failed to parse new players list to json.");

                team_data.insert(
                    "players".to_string(), 
                    json
                );
            },
            None => {
                serialised_player = Some(serialise_player(vec![], player));

                let new_players = vec![&serialised_player];
    
                team_data.insert(
                    "players".to_string(), 
                    json!(new_players)
                );
            }
        }

        let team_data_serialised = serde_json::to_value(team_data)
            .expect("Failed to serialise new team data");

        let _ = std::mem::replace(&mut all_teams[*team_index], team_data_serialised);        

        let _ = &self.store.insert("teams".to_string(), serde_json::to_value(all_teams).unwrap());

        self.save();

        Ok(())
    }
}