#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]
//use tauri::{CustomMenuItem, Menu, MenuItem};
use std::fs;
use std::fs::File;
use std::io::Write;
use std::fs::OpenOptions;
use std::path::PathBuf;
use std::path::Path;

pub fn create_dir_and_data_file() -> Option<PathBuf>{
  let mut paths = tauri::api::path::data_dir().unwrap().to_owned();
  let mut path = paths.clone();
  paths.push("groceryApp");
  paths.push("data.json");

  if !Path::new(&paths).exists() {
    path.push(r"groceryApp");
    fs::create_dir_all(&path).expect("error mate");
    path.push("data.json");
    File::create(&path).expect("an error occured while creating the file");
  }

  return Some(paths);
}


#[tauri::command]
fn parse_data_file() -> String{
  let mut path = tauri::api::path::data_dir().unwrap();
  path.push("groceryApp");
  path.push("data.json");

  let content = fs::read_to_string(path).expect("couldn't read the file");

  println!("{}", content);

  return content;
}

#[tauri::command]
fn write_file(data: String) -> String{
  let string = data.as_bytes();

  let mut path = tauri::api::path::data_dir().unwrap();
  path.push("groceryApp");
  path.push("data.json");

  let mut file = OpenOptions::new()
  .read(true)
  .truncate(true)
  .write(true)
  .create(true)
  .open(path).expect("couldn't open the file");
  file.write_all(string).expect("couldn't write to file");

  return data;

}

fn main() {
  let context = tauri::generate_context!();
  create_dir_and_data_file();
  tauri::Builder::default()
     /*.setup(|app| {
        app.windows().iter().for_each(|(label, window)| {
          if let Err(error) = window.menu_handle().hide() {
            println!("Failed to hide menu for {label}, {error}");
          }
        });
        Ok(())
      })*/
    .invoke_handler(tauri::generate_handler![write_file, parse_data_file])
    .run(context)
    .expect("error while running tauri application");
}
