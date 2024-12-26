pub mod utils {
    use core::panic;
    use std::fs;

    pub fn get_file(folder: &str) -> String {
        let input_exists = fs::exists(format!("./{folder}/input.txt")).expect("");
        let file_name = if input_exists {
            "input.txt"
        } else {
            "sample.txt"
        };

        let message = match fs::read_to_string(format!("./{folder}/{file_name}")) {
            Ok(content) => content,
            Err(err) => panic!("Error reading file: {}", err),
        };

        return message;
    }
}
