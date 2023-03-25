#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{thread::sleep, time::Duration};

use tauri::{App, Manager, Window};

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn open_devtools(window: Window) {
    window.open_devtools();
}

fn setup_application(application: &mut App) {
    // Get the current window by its handle name
    let window = application.get_window("main").unwrap();

    // Launch developer tools when we are in a debug build environment
    // The cfg macro will stop the following block of code from being executed if debug_assertions is not true
    #[cfg(debug_assertions)]
    {
        window.open_devtools();
        window.close_devtools();
    }

    tauri::async_runtime::spawn(async move {
        // adapt sleeping time to be long enough
        sleep(Duration::from_millis(500));
        window.show().expect("Failed to show Tauri window");

        window.eval("alert(
            'Some essential information is missing. Participants will not be able to enter information at this time.'
        );").expect("Failed to open alert");
    });
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
            greet,
            open_devtools
        ])
        .setup(|app| Ok(setup_application(app)))
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
