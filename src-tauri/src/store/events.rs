use serde_json::json;
use tauri::Wry;
use tauri_plugin_store::Store;

pub struct EventsStore {
    pub store: Store<Wry>
}

impl EventsStore {
    pub fn init(&mut self) -> () {
        self.store.insert("events".to_string(), json!([]))
            .expect("Failed to create default empty array in EventsStore");
        self.store.save().expect("Failed to save EventsStore");
    }

    pub fn create_event(&self, name: &str) {
        &self.store;
    }
}