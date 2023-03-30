// use std::collections::HashMap;

// use xlsxwriter::Workbook;

// pub fn create_xlsx() -> () {
//     let workbook = Workbook::new("generated.xlsx").expect("Failed to create new workbook.");
//     let mut sheet = workbook.add_worksheet(None).expect("Failed to create new worksheet in workbook.");

//     let mut width_map: HashMap<u16, usize> = HashMap::new();

//     let style = workbook
//         .add_format()
//         .set_text_wrap()
//         .set_font_size(12.0);

//     let date_style = workbook
//         .add_format()
//         .set_num_format("dd/mm/yyyy hh:mm:ss AM/PM")
//         .set_font_size(12.0);

//     // create_headers(&mut sheet, &mut width_map);
// }

// // fn add_row(
// //     row: u32,
// //     thing: &Thing,
// //     sheet: &mut Worksheet,
// //     date_fmt: &Format,
// //     width_map: &mut HashMap<u16, usize>,
// // ) {
// //     // add_string_column(row, 0, &thing.id, sheet, width_map);
// //     // add_date_column(row, 1, &thing.start_date, sheet, width_map, date_fmt);
// //     // add_date_column(row, 2, &thing.end_date, sheet, width_map, date_fmt);
// //     // add_string_column(row, 3, &thing.project, sheet, width_map);
// //     // add_string_column(row, 4, &thing.name, sheet, width_map);
// //     // add_string_column(row, 5, &thing.text, sheet, width_map);

// //     // let _ = sheet.set_row(row, FONT_SIZE, None);
// // }

// // fn add_string_column(
// //     row: u32,
// //     column: u16,
// //     data: &str,
// //     sheet: &mut Worksheet,
// //     mut width_map: &mut HashMap<u16, usize>,
// // ) {
// //     let _ = sheet.write_string(row + 1, column, data, None);
// //     set_new_max_width(column, data.len(), &mut width_map);
// // }