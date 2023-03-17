use crate::glib::Object;
use crate::Application;

mod imp {
    use adw::subclass::prelude::*;
    use glib::subclass::InitializingObject;
    use gtk4::CompositeTemplate;

    #[derive(CompositeTemplate, Default)]
    #[template(resource = "/dev/kierand/students_tournament/window.ui")]
    pub struct MyWindow {
        // Get children like this
        // #[template_child]
        // pub button: TemplateChild<Button>,
    }

    #[glib::object_subclass]
    impl ObjectSubclass for MyWindow {
        // `NAME` needs to match `class` attribute of template
        const NAME: &'static str = "TodoWindow";
        type Type = super::MyWindow;
        type ParentType = adw::ApplicationWindow;

        fn class_init(klass: &mut Self::Class) {
            klass.bind_template();
        }

        fn instance_init(obj: &InitializingObject<Self>) {
            obj.init_template();
        }
    }

    impl ObjectImpl for MyWindow {}
    impl WidgetImpl for MyWindow {}
    impl ApplicationWindowImpl for MyWindow {}
    impl AdwApplicationWindowImpl for MyWindow {}
    impl WindowImpl for MyWindow {}
}

glib::wrapper! {
    pub struct MyWindow(ObjectSubclass<imp::MyWindow>)
        @extends adw::ApplicationWindow, adw::Window, gtk4::Window, gtk4::Widget,
        @implements gtk4::gio::ActionGroup, gtk4::gio::ActionMap, gtk4::Accessible, gtk4::Buildable,
                    gtk4::ConstraintTarget, gtk4::Native, gtk4::Root, gtk4::ShortcutManager;
}

impl MyWindow {
    pub fn new(app: &Application) -> Self {
        // Create new window
        Object::builder().property("application", app).build()
    }
}
