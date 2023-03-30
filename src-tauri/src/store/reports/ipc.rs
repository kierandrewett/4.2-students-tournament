use std::{sync::{Mutex, Arc}, collections::HashMap};

use serde_json::Value;
use tauri_plugin_store::JsonValue;
use tauri::{State, Window, Manager, async_runtime::spawn_blocking};
use xlsxwriter::{Workbook};

use crate::store::{AllStores};

#[tauri::command]
pub fn reports__create_xlsx_report(
    stores: State<'_, Arc<Mutex<AllStores>>>
) -> () {


    // let result = spawn_blocking(move || create_xlsx(THINGS.to_vec()))
    //     .await
    //     .expect("can create result");
}