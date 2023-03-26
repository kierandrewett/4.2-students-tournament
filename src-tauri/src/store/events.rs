use serde_json::json;
use tauri::Wry;
use tauri_plugin_store::Store;

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

    pub fn create_event(&mut self, name: &str) -> () {
        let val = &mut self.store.get("events").unwrap().as_array().cloned().unwrap();

        println!("events={:#?}", val);

        let data = json!({
            "id": val.len() + 1,
            "name": name
        });

        val.push(data);

        let _ = &self.store.insert("events".to_string(), serde_json::to_value(val).unwrap());

        self.save();
    }
}