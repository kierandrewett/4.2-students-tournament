use serde::{Serialize, Deserialize};

pub mod api;
pub mod ipc;

#[derive(Serialize, Deserialize)]
pub enum EventType {
    Individual,
    Team
}