use regex::Regex;
use shared::utils::get_file;

fn mul(a: i32, b: i32) -> i32 {
    return a * b;
}

fn main() {
    let input = get_file("day3");
    let re = Regex::new(r"(mul\(\d{1,3},\d{1,3}\))|(do\(\))|(don't\(\))").unwrap();
    let value_re = Regex::new(r"(\d+),(\d+)").unwrap();
    let valid_instructions: Vec<_> = re
        .captures_iter(input.as_str())
        .map(|val| val.get(0).map_or("", |m| m.as_str()))
        .collect();

    let mut total = 0;
    let mut total_part_two = 0;
    let mut do_it = true;

    for instruction in valid_instructions {
        if !instruction.starts_with("mul") {
            do_it = instruction == "do()";
            continue;
        }

        let mul_str_values = value_re.find(instruction).unwrap().as_str();
        let mul_values: Vec<i32> = mul_str_values
            .split(",")
            .map(|val| val.trim().parse::<i32>().unwrap())
            .collect();

        let result = mul(mul_values[0], mul_values[1]);
        total += result;
        if do_it {
            total_part_two += result
        }
    }

    println!("Part 1: {total}");
    println!("Part 2: {total_part_two}");
}
