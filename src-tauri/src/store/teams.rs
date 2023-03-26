use tauri::Wry;
use tauri_plugin_store::Store;
use serde_json::json;

pub struct TeamsStore {
    pub store: Store<Wry>
}

impl TeamsStore {
    pub fn init(&mut self) -> () {
        self.store.insert("teams".to_string(), json!([]))
            .expect("Failed to create default empty array in TeamsStore");
        self.store.save().expect("Failed to save TeamsStore");
    }

    fn create_team(&self, name: String) {
        &self.store;
    }
}