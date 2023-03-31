use serde::{Serialize, Deserialize};

pub mod api;
pub mod ipc;

// ResultsItem structure for serialising and deserialising a result
#[derive(Serialize, Deserialize, Clone, Copy)]
pub struct ResultsItem {
    participant_id: u64,
    points: u64,
    position: u64,
}