use sqlite::sqlite;
use std::path::Path;

pub fn create_database() {
    let project_dirs = ProjectDirs::from("dev", "kierand", "students_tourney");

    let connection = sqlite::open(Path::new("")).unwrap();
}