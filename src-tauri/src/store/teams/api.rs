use std::ops::Index;

use serde_json::json;
use serde_json::Value;
use tauri::{Wry};
use tauri_plugin_store::{ Store, JsonValue };

use super::TeamPlayer;

pub struct TeamsStore {
    pub store: Store<Wry>
}

// The TeamsStore implementation/class
impl TeamsStore {
    // Helper function to save the store
    pub fn save(&mut self) -> () {
        self.store.save().expect("Failed to save TeamsStore");
    }

    // Initialises the store by creating essential information
    // Since the store is serialised to JSON, we need to create an initial array to store all our teams
    pub fn init(&mut self) -> () {
        if !self.store.has("teams") {
            self.store.insert("teams".to_string(), json!([]))
                .expect("Failed to create default empty array in TeamsStore");
        }

        self.save();
    }

    // Gets the teams key from the store and returns it as a vector/array which includes all our teams as a dictionary.
    pub fn get_all_teams(&mut self) -> Vec<JsonValue> {
        let all_teams = &mut self.store.get("teams").unwrap().as_array().cloned().unwrap();

        all_teams.clone()
    }

    // Finds a team by a predicate. This is a generic function which allows us to pass in a function which will be used to match the team.
    pub fn find_team_by<T: for<'a> FnMut(&'a &JsonValue) -> bool>(&mut self, mut predicate: T) -> Result<JsonValue, &str> {
        // Get all the teams
        let all_teams = self.get_all_teams();

        // Convert the teams to a Rust vector
        let binding = all_teams.to_vec();

        // Pass in our predicate argument to the find function which will return a result.
        let result = binding.iter().clone().find(&mut predicate);

        // Check whether we have a match or not
        match result {
            Some(event) => Ok(event.to_owned().to_owned()),
            None => Err("Failed to find team using predicate"),
        }
    }

    // Finds a team's index in the vector using a predicate.
    pub fn find_team_index_by<T: for<'a> FnMut(&'a JsonValue) -> bool>(&mut self, predicate: T) -> Result<usize, &str> {
        // Get all the teams
        let all_teams = self.get_all_teams();

        // Convert the teams to a Rust vector
        let binding = all_teams.to_vec();

        // Pass in our predicate argument to the find function which will return a result.
        let result = binding.iter().clone().position(predicate);

        // Check whether we have a match or not
        match result {
            Some(event) => Ok(event.to_owned().to_owned()),
            None => Err("Failed to find team using predicate"),
        }
    }

    // Get a specific team in the vector by its ID
    pub fn get_team_by_id(&mut self, id: u64) -> Result<JsonValue, String> {
        // Use the find_team_by function to find a team by its id property.
        match self.find_team_by(|x| x.get("id")
            .expect("Failed to get ID in get_team_by_id for iterator")
            .as_u64()
            .unwrap() == id
        ) {
            Ok(event) => Ok(event.to_owned().to_owned()), // Return the team if we have a match
            Err(_) => Err(format!("No team found with ID {}", id)), // Return an error if we don't have a match
        }
    }

    // Create a new team using a name and the event ids that they are entering in to.
    pub fn create_team(&mut self, name: &str, events_ids_entered: Vec<u64>) -> Result<Value, String> {
        // Get all the teams
        let all_teams = &mut self.get_all_teams();

        // Check on the backend whether we are allowed to make any more teams.
        if all_teams.len() >= 4 {
            return Err("Cannot create any more teams. Maximum of 4 teams reached.".to_string())
        }

        // Construct the JSON object that we will be inserting into the store.
        let data = json!({
            "id": all_teams.len() + 1,
            "name": name,
            "events_ids_entered": events_ids_entered
        });

        // Push the new team into the vector
        all_teams.push(data.clone());

        // Update the teams vector in the store using our new updated information.
        let _ = &self.store.insert("teams".to_string(), serde_json::to_value(all_teams).unwrap());

        self.save();

        Ok(data)
    }

    // Deletes a team by its ID
    pub fn delete_team(&mut self, id: u64) -> Result<(), String> {
        // Get all the teams
        let all_teams = &mut self.get_all_teams().to_owned();

        // Find the team using its ID
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

        // Filter out all the teams that don't match the ID that we want to delete.
        let filtered: Vec<&JsonValue> = all_teams
            .iter()
            .filter(|x| x
                .get("id")
                .expect("Failed to get ID in iterator")
                .as_u64()
                .expect("Failed to cast as u64") != id
            ).collect::<_>();

        // Update the store using our new filtered information
        let _ = &self.store.insert("teams".to_string(), serde_json::to_value(filtered).unwrap());

        self.save();

        Ok(())
    }

    // Add a player to a team
    pub fn add_player_to_team(&mut self, id: u64, player: TeamPlayer) -> Result<(), std::string::String> {
        // Get all the teams
        let all_teams = &mut self.get_all_teams();

        // Get the team by its ID
        let team_by_id = self.get_team_by_id(id);

        // Check if we found the team using the ID or not
        let team: &mut JsonValue = &mut match &team_by_id {
            Ok(t) => t.to_owned(), // Found it!
            _ => {
                return Err(format!("Team with ID '{}' does not exist.", id)) // Didn't find it
            }
        };

        // Find the team index in the vector by its ID so we can easily insert new players to the vector
        let team_index = &self.find_team_index_by(|t| t
            .get("id")
            .expect("Failed to get ID from team.")
            .as_u64()
            .expect("Failed to cast ID to u64.") == id
        ).expect("Failed to get index of team in list.");

        // Convert the existing team to a mutable object so we can insert new players
        let team_data = team
            .as_object_mut()
            .unwrap();

        // Fetch the players key in the object
        let players_key = team_data.get_mut("players");

        // Helper function to serialise the player object into a JSON value
        fn serialise_player(players_list: Vec<Value>, player: TeamPlayer) -> Value {
            let mut serialised = serde_json::to_value(player).expect("Failed to parse player as json value.");
                
            serialised
                .as_object_mut()
                .unwrap()
                .insert("id".to_owned(), players_list.len().into());

            serialised
        }

        let mut serialised_player = None;

        // Check if we have any players in the team already
        match players_key {
            Some(new_players) => {
                let new_players_list = new_players.as_array_mut().expect("Failed to cast new players as array.");

                serialised_player = Some(serialise_player(new_players_list.to_vec(), player));

                // Insert the player into the new players list
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
    
                // If there aren't players in the vector yet, we should create a fresh vector with the player inside.
                team_data.insert(
                    "players".to_string(), 
                    json!(new_players)
                );
            }
        }

        // Serialise the new team data
        let team_data_serialised = serde_json::to_value(team_data)
            .expect("Failed to serialise new team data");

        // Replace the existing team data with the new team data
        let _ = std::mem::replace(&mut all_teams[*team_index], team_data_serialised);        

        // Reflect the changes in the store
        let _ = &self.store.insert("teams".to_string(), serde_json::to_value(all_teams).unwrap());

        self.save();

        Ok(())
    }

    // Removes a specific player from a team using their player id
    pub fn remove_player_from_team(&mut self, team_id: u64, player_id: u64) -> Result<(), std::string::String> {
        // Get all teams
        let all_teams = &mut self.get_all_teams();

        // Get the team by its ID
        let team_by_id = self.get_team_by_id(team_id);
        let team: &mut JsonValue = &mut match &team_by_id {
            Ok(t) => t.to_owned(),
            _ => {
                return Err(format!("Team with ID '{}' does not exist.", team_id))
            }
        };

        // Get the team's index by its ID
        let team_index = &self.find_team_index_by(|t| t
            .get("id")
            .expect("Failed to get ID from team.")
            .as_u64()
            .expect("Failed to cast ID to u64.") == team_id
        ).expect("Failed to get index of team in list.");

        // Convert the existing team to a mutable object so we can insert new players
        let team_data = team
            .as_object_mut()
            .unwrap();

        // Fetch the players key in the object
        let players_key = team_data.get_mut("players");

        // Check if we have any players in the team already
        match players_key {
            Some(new_players) => {
                // Convert the new_players key to a mutable array so we can remove the player from it
                let new_players_list = new_players.as_array_mut().expect("Failed to cast new players as array.");

                // Get the index of the player in the vector
                let player_index = new_players_list.iter().position(|p| p
                    .as_object()
                    .expect("Failed to cast player element as object.")
                    .get("id")
                    .expect("Failed to get ID from player element.")
                    .as_u64()
                    .expect("Failed to cast ID in player element as u64.") == player_id
                ).expect("Failed to get index of player in list.");

                // Remove the player by its index
                new_players_list.remove(player_index);
    
                // Convert the new players list to a JSON value
                let json = serde_json::to_value(new_players_list).expect("Failed to parse new players list to json.");

                // Update the players array in the team object
                team_data.insert(
                    "players".to_string(), 
                    json
                );
            },
            None => {
                // If there aren't players in the vector yet, throw an error as there's nothing to remove.
                return Err("No players on team.".to_owned())
            }
        }

        // Serialise the new team data
        let team_data_serialised = serde_json::to_value(team_data)
            .expect("Failed to serialise new team data");

        // Replace the team by its index with the new team data
        let _ = std::mem::replace(&mut all_teams[*team_index], team_data_serialised);        

        // Reflect the changes in the store
        let _ = &self.store.insert("teams".to_string(), serde_json::to_value(all_teams).unwrap());

        self.save();

        Ok(())
    }

    // Edit the events of the team
    pub fn edit_events(&mut self, id: u64, events_ids_entered: Vec<u64>) -> Result<(), std::string::String> {
        // Get all teams
        let all_teams = &mut self.get_all_teams();

        // Get the team by its ID
        let team_by_id = self.get_team_by_id(id);
        let team: &mut JsonValue = &mut match &team_by_id {
            Ok(t) => t.to_owned(),
            _ => {
                return Err(format!("Team with ID '{}' does not exist.", id))
            }
        };

        // Get the team's index by its ID
        let team_index = &self.find_team_index_by(|t| t
            .get("id")
            .expect("Failed to get ID from team.")
            .as_u64()
            .expect("Failed to cast ID to u64.") == id
        ).expect("Failed to get index of team in list.");

        // Convert the existing team to a mutable object so we can edit the players array
        let team_data = team
            .as_object_mut()
            .unwrap();

        // Update the events array in the team object
        team_data.insert("events_ids_entered".to_string(), events_ids_entered.into());

        // Serialise the new team data
        let team_data_serialised = serde_json::to_value(team_data)
            .expect("Failed to serialise new team data");

        // Replace the team by its index with the new team data
        let _ = std::mem::replace(&mut all_teams[*team_index], team_data_serialised);        

        // Reflect the changes in the store
        let _ = &self.store.insert("teams".to_string(), serde_json::to_value(all_teams).unwrap());

        self.save();

        Ok(())
    }
}