#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{App, Manager};

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

fn setup_application(application: &mut App) {
    // Launch developer tools when we are in a debug build environment
    // The cfg macro will stop the following block of code from being executed if debug_assertions is not true
    #[cfg(debug_assertions)]
    {
        let window = application.get_window("main").unwrap();
        window.open_devtools();
        window.close_devtools();
    }
}

fn main() {
    /*
        Creates a Tauri window builder

        - .invoke_handler: defines all the Tauri JS command handlers
        - .setup: setup the application internals (invokes setup_application() function)
        - .run: starts up the window
        - .expect: expects the result of the window opening to be non-erroneous, otherwise crashes with an error
    */
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            greet
        ])
        .setup(|app| Ok(setup_application(app)))
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
