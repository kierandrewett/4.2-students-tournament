use gtk4::prelude::*;
use gtk4::{Builder, Button, MessageDialog, ResponseType};

pub fn build(builder: &Builder) {
    let hello_world_btn: Button = builder.object("hello_world_btn").expect("Failed to get hello_world_button");
    let hello_world_dialog: MessageDialog = builder
        .object("hello_world_dialog")
        .expect("Failed to get hello_world_dialog");

    hello_world_dialog.connect_response(move |d: &MessageDialog, _: ResponseType| {
        d.hide();
    });

    hello_world_btn.connect_clicked(move |_| {
        hello_world_dialog.show();
    });
}