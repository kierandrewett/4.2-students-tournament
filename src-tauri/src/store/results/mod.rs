use serde::{Serialize, Deserialize};

pub mod api;
pub mod ipc;

#[derive(Serialize, Deserialize, Clone, Copy)]
pub struct ResultsItem {
    participant_id: u64,
    points: u64,
    position: u64,
}