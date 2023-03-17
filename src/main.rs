use adw::{glib, Application};
use gtk4::{gio, prelude::*};
use window::MyWindow;

pub mod components;
pub mod window;

const APP_ID: &str = "dev.kierand.students_tournament";

fn main() -> glib::ExitCode {
    gio::resources_register_include!("window.gresource").expect("Failed to register resources.");

    let application = Application::builder().application_id(APP_ID).build();

    application.connect_activate(build_ui);

    application.run()
}

fn build_ui(application: &Application) {
    let window = MyWindow::new(application);
    window.present();
}
