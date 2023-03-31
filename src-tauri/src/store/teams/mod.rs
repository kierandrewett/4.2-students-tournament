use serde::{Serialize, Deserialize};

pub mod api;
pub mod ipc;

// The TeamPlayer structure used for IPC
#[derive(Serialize, Deserialize, Clone, Copy)]
pub struct TeamPlayer<'a> {
    name: &'a str
}