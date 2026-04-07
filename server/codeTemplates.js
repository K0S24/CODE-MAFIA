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

  `# TASK 1: Fix the binary search function
def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            right = mid - 1  # BUG: should be left = mid + 1
        else:
            left = mid + 1   # BUG: should be right = mid - 1
    return -1

# TASK 2: Complete the function that flattens a nested list
def flatten(lst):
    # TODO: Implement this (return a flat list)
    pass

# TASK 3: Fix the palindrome checker
def is_palindrome(s):
    s = s.lower()
    return s == s[::-1]  # BUG: does not ignore spaces and punctuation`,

  `# TASK 1: Fix the fibonacci function
def fibonacci(n):
    if n <= 0:
        return []
    if n == 1:
        return [0]
    seq = [0, 1]
    for i in range(2, n):
        seq.append(seq[-1] + seq[-2])
    return seq  # BUG: off-by-one, should include n elements

# TASK 2: Complete the Caesar cipher
def caesar_cipher(text, shift):
    # TODO: shift each letter by 'shift' positions, keep non-letters unchanged
    pass

# TASK 3: Fix the duplicate remover
def remove_duplicates(lst):
    seen = []
    for item in lst:
        if item not in seen:
            seen.append(item)
            seen.append(item)  # BUG: appends twice
    return seen`,

  `# TASK 1: Fix the stack implementation
class Stack:
    def __init__(self):
        self.items = []

    def push(self, item):
        self.items.append(item)

    def pop(self):
        return self.items.pop(0)  # BUG: should pop from end

    def peek(self):
        return self.items[-1]

    def is_empty(self):
        return len(self.items) == 0

# TASK 2: Complete the word frequency counter
def word_frequency(text):
    # TODO: return a dict with each word and how often it appears
    pass`,

  `# TASK 1: Fix the temperature converter
def celsius_to_fahrenheit(c):
    return c * 9 / 5 - 32  # BUG: should be + 32

def fahrenheit_to_celsius(f):
    return (f - 32) * 5 / 9

# TASK 2: Complete the function that finds all pairs summing to target
def find_pairs(lst, target):
    # TODO: return list of (a, b) pairs where a + b == target
    pass

# TASK 3: Fix the string truncator
def truncate(s, max_len):
    if len(s) > max_len:
        return s[:max_len] + "..."
    return s  # BUG: adds "..." even when not needed — already correct here, fix task 1`,

  `# TASK 1: Fix the list rotation
def rotate_left(lst, k):
    if not lst:
        return lst
    k = k % len(lst)
    return lst[k:] + lst[:k]  # BUG: rotates right instead of left — swap slices

# TASK 2: Complete the function that checks balanced brackets
def is_balanced(s):
    # TODO: return True if all (), [], {} are properly closed
    pass

# TASK 3: Fix the average calculator
def average(numbers):
    if not numbers:
        return 0
    return sum(numbers) / len(numbers) + 1  # BUG: extra +1`,

  `# TASK 1: Fix the matrix transpose
def transpose(matrix):
    rows = len(matrix)
    cols = len(matrix[0])
    result = [[0] * rows for _ in range(cols)]
    for i in range(rows):
        for j in range(cols):
            result[i][j] = matrix[i][j]  # BUG: should be result[j][i]
    return result

# TASK 2: Complete the run-length encoder
def run_length_encode(s):
    # TODO: e.g. "aaabbc" -> "3a2b1c"
    pass`,

  `# TASK 1: Fix the power function
def power(base, exp):
    if exp == 0:
        return 0  # BUG: should return 1
    return base * power(base, exp - 1)

# TASK 2: Complete the function that checks if two strings are anagrams
def are_anagrams(a, b):
    # TODO: return True if a and b contain the same letters
    pass

# TASK 3: Fix the list intersection
def intersection(lst1, lst2):
    result = []
    for item in lst1:
        if item in lst2 and item not in result:
            result.append(item)
    lst2.remove(item)  # BUG: this line should not be here
    return result`,
];

function getRandom() {
  return templates[Math.floor(Math.random() * templates.length)];
}

module.exports = { getRandom };
