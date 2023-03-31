use serde::{Serialize, Deserialize};

pub mod api;
pub mod ipc;

// The EventType enum used for IPC/Store
// This should match in the frontend implementation also
#[derive(Serialize, Deserialize, PartialEq)]
pub enum EventType {
    Individual,
    Team
}