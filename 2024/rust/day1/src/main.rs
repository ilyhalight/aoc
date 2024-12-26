use shared::utils::get_file;

fn main() {
    let input = get_file("day1");
    let data: Vec<&str> = input.split("\n").collect();

    let mut left_values = Vec::<i32>::new();
    let mut right_values = Vec::<i32>::new();

    for line in &data {
        let nums: Vec<&str> = line.split("   ").collect();
        let left = nums[0].trim().parse::<i32>().unwrap();
        left_values.push(left);
        let right = nums[1].trim().parse::<i32>().unwrap();
        right_values.push(right);
    }

    left_values.sort();
    right_values.sort();

    let mut total = 0;
    for i in 0..left_values.len() {
        let current = left_values[i] - right_values[i];
        total += current.abs();
    }

    let mut total_part_two = 0;
    for i in 0..left_values.len() {
        let current = left_values[i];
        let right_count = right_values
            .clone()
            .into_iter()
            .filter(|&value| value == current)
            .count();
        total_part_two += current * right_count as i32;
    }

    println!("Part 1: {total}");
    println!("Part 2: {total_part_two}");
}
