use shared::utils::get_file;

fn is_safe(line: &Vec<i32>, use_dampener: bool) -> bool {
    let mut is_increasing = true;
    let mut count = 0;
    let nums_count = line.len() - 1;
    for i in 0..nums_count {
        let num = line[i];
        let next_num: i32 = line[i + 1];
        if i == 0 {
            is_increasing = num < next_num;
        }

        if (is_increasing && num > next_num) || (!is_increasing && num < next_num) {
            break;
        }

        let diff = (num - next_num).abs();
        if diff < 1 || diff > 3 {
            break;
        }

        count += 1;
    }

    if count == nums_count {
        return true;
    }

    if !use_dampener {
        return false;
    }

    return line.iter().enumerate().any(|(i, _)| {
        let test_line: Vec<_> = line
            .iter()
            .enumerate()
            .filter(|&(idx, _)| idx != i)
            .map(|(_, &val)| val)
            .collect();
        is_safe(&test_line, false)
    });
}

fn main() {
    let input = get_file("day2");
    let data: Vec<&str> = input.split("\n").collect();

    let input_data: Vec<_> = data
        .iter()
        .map(|line| {
            line.split(" ")
                .map(|num| num.trim().parse::<i32>().unwrap())
                .collect::<Vec<_>>()
        })
        .collect();

    let mut total = 0;
    let mut total_part_two = 0;

    for line in &input_data {
        let line_safe = is_safe(line, false);
        let line_safe_with_dampener = is_safe(line, true);
        if line_safe {
            total += 1;
        }

        if line_safe_with_dampener {
            total_part_two += 1;
        }
    }

    println!("Part 1: {total}");
    println!("Part 2: {total_part_two}");
}
