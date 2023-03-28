use serde::{Serialize, Deserialize};

pub mod api;
pub mod ipc;

#[derive(Serialize, Deserialize, Clone, Copy)]
pub struct TeamPlayer<'a> {
    name: &'a str
}