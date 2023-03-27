use serde::{Serialize, Deserialize};

pub mod api;
pub mod ipc;

#[derive(Serialize, Deserialize, PartialEq)]
pub enum EventType {
    Individual,
    Team
}