#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")] // Hides the console window when not in debug mode on Windows
#![feature(fn_traits)] // Enables the function traits feature
#![allow(non_snake_case)] // Allows use of nonSnakeCase variables in Rust
#![allow(dead_code)] // Allows use of dead code in Rust (unused functions, etc)

use std::{thread::sleep, time::Duration, sync::{Arc, Mutex}, path::PathBuf, fs::{File, self, metadata}, io::Write, process::Command};

use store::get_data_dir;
use tauri::{App, Manager, Window, Size, LogicalSize};

mod store;

// Launches the developer tools when we are in a debug build environment.
#[tauri::command]
fn open_devtools(window: Window) {
    #[cfg(debug_assertions)]
    {
        window.open_devtools();
    }
}

// Locks the data store by creating a lock file that the data store checks for before writing to the data store.
#[tauri::command]
fn lock_data() {
    let lock_file_path = get_data_dir().join(PathBuf::from("data.lock"));

    let mut lock_file = File::create(lock_file_path).expect("Failed to lock data.");

    lock_file.write_all(b"").expect("Failed to lock data.");
}

// Unlocks the data store by removing the lock file if it exists.
#[tauri::command]
fn unlock_data() {
    let lock_file_path = get_data_dir().join(PathBuf::from("data.lock"));

    if lock_file_path.exists() {
        fs::remove_file(lock_file_path).expect("Failed to remove lock data.");
    }
}

// https://github.com/tauri-apps/tauri/issues/4062#issuecomment-1338048169
/* Tauri command for opening a folder in the OS's file explorer.
    1. We use cfg target_os so the code only compiles on the target OS.
    2. We use the Command struct to spawn the process.
    3. We use the unwrap method to panic if the process fails to spawn. 
*/
#[tauri::command]
fn open_folder(path: String) {
    #[cfg(target_os = "windows")]
    {
        Command::new("explorer")
            .args(["/select,", &path]) // The comma after select is not a typo
            .spawn()
            .unwrap();
    }

    #[cfg(target_os = "linux")]
    {
        Command::new("xdg-open")
            .arg(&path)
            .spawn()
            .unwrap();
    }

    #[cfg(target_os = "macos")]
    {
        Command::new("open")
            .args(["-R", &path])
            .spawn()
            .unwrap();
    }
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

    let stores = Arc::new(Mutex::new(store::init(application)));

    application.manage(stores.clone());

    // Spawns an async runtime so we can delay the showing of the window to avoid flickering when loading
    tauri::async_runtime::spawn(async move {
        // adapt sleeping time to be long enough
        sleep(Duration::from_millis(500));
        window.show().expect("Failed to show Tauri window");

        window.set_size(Size::Logical(LogicalSize { width: 1280.0, height: 720.0 })).unwrap();
        window.set_size(Size::Logical(LogicalSize { width: 1280.0, height: 720.0 })).unwrap();

        if stores.lock().unwrap().events.get_all_events().len() == 0 {
            window.eval("alert(
                'There are currently no events. Participants will not be able to enter information at this time.'
            );").expect("Failed to open alert");
        }
    });
}

fn main() {
    /*
        Creates a Tauri window builder

        - .plugin: loads plugins needed for the application
        - .invoke_handler: defines all the Tauri JS command handlers
        - .setup: setup the application internals (invokes setup_application() function)
        - .run: starts up the window
        - .expect: expects the result of the window opening to be non-erroneous, otherwise crashes with an error
    */
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::default().build())
        .invoke_handler(tauri::generate_handler![
            open_devtools,
            lock_data,
            unlock_data,
            open_folder,
            /* Events */
            store::events::ipc::events__create_event,
            store::events::ipc::events__get_all_events,
            store::events::ipc::events__delete_event,
            /* Individuals */
            store::individuals::ipc::individuals__create_individual,
            store::individuals::ipc::individuals__get_all_individuals,
            store::individuals::ipc::individuals__delete_individual,
            store::individuals::ipc::individuals__edit_events,
            /* Teams */
            store::teams::ipc::teams__create_team,
            store::teams::ipc::teams__get_all_teams,
            store::teams::ipc::teams__delete_team,
            store::teams::ipc::teams__add_player_to_team,
            store::teams::ipc::teams__remove_player_from_team,
            store::teams::ipc::teams__edit_events,
            /* Results */
            store::results::ipc::results__get_all_results,
            store::results::ipc::results__record_event_results,
            store::results::ipc::results__mark_event_done,
            store::results::ipc::results__reset_all,
        ])
        .setup(|app| Ok(setup_application(app)))
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
