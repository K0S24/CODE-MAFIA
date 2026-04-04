const templates = [
  `# TASK 1: Fix the function so it returns the sum of a list
def calculate_sum(numbers):
    total = 0
    for n in numbers:
        total += n
    return total  # BUG: return wrong value

# TASK 2: Complete the function that checks if a number is prime
def is_prime(n):
    # TODO: Implement this function
    pass

# TASK 3: Fix the sorting algorithm
def bubble_sort(arr):
    for i in range(len(arr)):
        for j in range(len(arr) - 1):
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j], arr[j+1]
    return arr`,

  `# TASK 1: Fix the factorial function
def factorial(n):
    if n == 0:
        return 0  # BUG: should return 1
    return n * factorial(n - 1)

# TASK 2: Write a function that reverses a string
def reverse_string(s):
    # TODO: Implement this
    pass

# TASK 3: Fix the function that finds the maximum in a list
def find_max(lst):
    max_val = lst[0]
    for item in lst:
        if item < max_val:  # BUG: wrong comparison
            max_val = item
    return max_val`,

  `# TASK 1: Fix the FizzBuzz function
def fizzbuzz(n):
    result = []
    for i in range(1, n + 1):
        if i % 15 == 0:
            result.append("FizzBuzz")
        elif i % 3 == 0:
            result.append("Buzz")  # BUG: should be "Fizz"
        elif i % 5 == 0:
            result.append("Fizz")  # BUG: should be "Buzz"
        else:
            result.append(str(i))
    return result

# TASK 2: Complete the function that counts vowels
def count_vowels(s):
    # TODO: Implement this
    pass`,
];

function getRandom() {
  return templates[Math.floor(Math.random() * templates.length)];
}

module.exports = { getRandom };
