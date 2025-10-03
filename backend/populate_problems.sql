-- =================================================================
-- Problem 1: Hello, World!
-- =================================================================
INSERT INTO problems (id, title, statement, expected, stars, tags) VALUES
(1, 'Hello, World!',
'Print "Hello, World!" to the output. This is a basic test to ensure your program runs correctly.

Example 1:
Input: none
Output: Hello, World!

Hints:
- Simply print the string exactly as shown.',
'Hello, World!', 1, '["Intro"]')
ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  statement = VALUES(statement),
  expected = VALUES(expected),
  stars = VALUES(stars),
  tags = VALUES(tags);

-- =================================================================
-- Problem 2: Add Two Numbers
-- =================================================================
INSERT INTO problems (id, title, statement, expected, stars, tags) VALUES
(2, 'Add Two Numbers',
'Write a function that takes two integers a and b, and returns their sum.

Example:
Input: a = 5, b = 7
Output: 12

Hints:
- Use simple addition operator.
- Consider negative numbers.',
'The sum of the two integers.', 1, '["Math"]')
ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  statement = VALUES(statement),
  expected = VALUES(expected),
  stars = VALUES(stars),
  tags = VALUES(tags);

-- =================================================================
-- Problem 3: Is Even?
-- =================================================================
INSERT INTO problems (id, title, statement, expected, stars, tags) VALUES
(3, 'Is Even?',
'Given an integer n, return true if it is even, false otherwise.

Example:
Input: n = 4
Output: true

Hints:
- Use modulo operator to check divisibility by 2.',
'true or false.', 1, '["Math","Bit Manipulation"]')
ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  statement = VALUES(statement),
  expected = VALUES(expected),
  stars = VALUES(stars),
  tags = VALUES(tags);

-- =================================================================
-- Problem 4: Contains Duplicate
-- =================================================================
INSERT INTO problems (id, title, statement, expected, stars, tags) VALUES
(4, 'Contains Duplicate',
'Given an array of integers, return true if any element appears at least twice, false if all are unique.

Example:
Input: nums = [1,3,5,3]
Output: true

Hints:
- Use a set or hash table to track duplicates.',
'true or false.', 1, '["Array","Hash Table"]')
ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  statement = VALUES(statement),
  expected = VALUES(expected),
  stars = VALUES(stars),
  tags = VALUES(tags);

-- =================================================================
-- Problem 5: Two Sum
-- =================================================================
INSERT INTO problems (id, title, statement, expected, stars, tags) VALUES
(5, 'Two Sum',
'Given an array of integers and a target, return indices of the two numbers adding to the target. Assume exactly one solution exists.

Example:
Input: nums = [2, 7, 11, 15], target = 9
Output: [0,1]

Hints:
- Consider using a hash table for fast lookups.',
'Array of two indices.', 2, '["Array","Hash Table"]')
ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  statement = VALUES(statement),
  expected = VALUES(expected),
  stars = VALUES(stars),
  tags = VALUES(tags);

-- =================================================================
-- Problem 6: Valid Palindrome
-- =================================================================
INSERT INTO problems (id, title, statement, expected, stars, tags) VALUES
(6, 'Valid Palindrome',
'Check if a string reads the same forward and backward after converting to lowercase and removing non-alphanumeric characters.

Example:
Input: s = "racecar"
Output: true

Hints:
- Two-pointer technique works well.',
'true or false.', 1, '["String","Two Pointers"]')
ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  statement = VALUES(statement),
  expected = VALUES(expected),
  stars = VALUES(stars),
  tags = VALUES(tags);

-- =================================================================
-- Problem 7: Find Maximum in Array
-- =================================================================
INSERT INTO problems (id, title, statement, expected, stars, tags) VALUES
(7, 'Find Maximum in Array',
'Return the largest integer from a non-empty array.

Example:
Input: nums = [3, 6, 2, 9, 4]
Output: 9

Hints:
- Iterate through array while tracking maximum.',
'Maximum integer in the array.', 1, '["Array"]')
ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  statement = VALUES(statement),
  expected = VALUES(expected),
  stars = VALUES(stars),
  tags = VALUES(tags);

-- =================================================================
-- Problem 8: Sum of Array Elements
-- =================================================================
INSERT INTO problems (id, title, statement, expected, stars, tags) VALUES
(8, 'Sum of Array Elements',
'Compute the sum of all elements in an integer array.

Example:
Input: nums = [1,2,3]
Output: 6

Hints:
- Use a loop or built-in sum function.',
'Sum of all integers.', 1, '["Array","Math"]')
ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  statement = VALUES(statement),
  expected = VALUES(expected),
  stars = VALUES(stars),
  tags = VALUES(tags);

-- =================================================================
-- Problem 9: Binary Search
-- =================================================================
INSERT INTO problems (id, title, statement, expected, stars, tags) VALUES
(9, 'Binary Search',
'Search for a target integer in a sorted array and return its index, or -1 if not found.

Example:
Input: nums = [1,2,4,5,6], target = 5
Output: 3

Hints:
- Use the divide and conquer approach.',
'Index of target or -1.', 2, '["Array","Binary Search"]')
ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  statement = VALUES(statement),
  expected = VALUES(expected),
  stars = VALUES(stars),
  tags = VALUES(tags);

-- =================================================================
-- Problem 10: Reverse Linked List
-- =================================================================
INSERT INTO problems (id, title, statement, expected, stars, tags) VALUES
(10, 'Reverse Linked List',
'Reverse a singly linked list and return the new head.

Example:
Input: head = [1,2,3]
Output: [3,2,1]

Hints:
- Iterative or recursive approach works.',
'Head of reversed list.', 2, '["Linked List","Recursion"]')
ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  statement = VALUES(statement),
  expected = VALUES(expected),
  stars = VALUES(stars),
  tags = VALUES(tags);

-- =================================================================
-- Problem 11: Linked List Cycle
-- =================================================================
INSERT INTO problems (id, title, statement, expected, stars, tags) VALUES
(11, 'Linked List Cycle',
'Determine if a linked list contains a cycle.

Example:
Input: head = [3,2,0,-4], pos = 1
Output: true

Hints:
- Use fast and slow pointers.',
'true or false.', 3, '["Linked List","Two Pointers"]')
ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  statement = VALUES(statement),
  expected = VALUES(expected),
  stars = VALUES(stars),
  tags = VALUES(tags);

-- =================================================================
-- Problem 12: Implement Queue using Stacks
-- =================================================================
INSERT INTO problems (id, title, statement, expected, stars, tags) VALUES
(12, 'Implement Queue using Stacks',
'Implement a queue with push, pop, peek, and empty operations using only two stacks.

Example:
Push 1, Push 2, Pop -> returns 1

Hints:
- Maintain two stacks for input and output.',
'A functional queue class.', 3, '["Stack","Queue","Design"]')
ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  statement = VALUES(statement),
  expected = VALUES(expected),
  stars = VALUES(stars),
  tags = VALUES(tags);

-- =================================================================
-- Problem 13: Merge Two Sorted Lists
-- =================================================================
INSERT INTO problems (id, title, statement, expected, stars, tags) VALUES
(13, 'Merge Two Sorted Lists',
'Merge two sorted linked lists into one sorted list and return its head.

Example:
Input: list1 = [1,2], list2 = [1,3]
Output: [1,1,2,3]

Hints:
- Use dummy head or recursion.',
'Head of merged list.', 2, '["Linked List","Recursion"]')
ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  statement = VALUES(statement),
  expected = VALUES(expected),
  stars = VALUES(stars),
  tags = VALUES(tags);

-- =================================================================
-- Problem 14: Count Primes
-- =================================================================
INSERT INTO problems (id, title, statement, expected, stars, tags) VALUES
(14, 'Count Primes',
'Count the number of prime numbers less than n.

Example:
Input: n = 10
Output: 4

Hints:
- Use Sieve of Eratosthenes for efficiency.',
'Number of primes < n.', 3, '["Math","Array","Number Theory"]')
ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  statement = VALUES(statement),
  expected = VALUES(expected),
  stars = VALUES(stars),
  tags = VALUES(tags);

-- =================================================================
-- Problem 15: Factorial of a Number
-- =================================================================
INSERT INTO problems (id, title, statement, expected, stars, tags) VALUES
(15, 'Factorial of a Number',
'Compute the factorial of a non-negative integer n.

Example:
Input: n = 5
Output: 120

Hints:
- Can be solved recursively or iteratively.',
'Factorial of n.', 1, '["Math","Recursion"]')
ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  statement = VALUES(statement),
  expected = VALUES(expected),
  stars = VALUES(stars),
  tags = VALUES(tags);

-- =================================================================
-- Problem 16: Rotate Array
-- =================================================================
INSERT INTO problems (id, title, statement, expected, stars, tags) VALUES
(16, 'Rotate Array',
'Rotate an array to the right by k steps.

Example:
Input: nums = [1,2,3,4,5], k = 2
Output: [4,5,1,2,3]

Hints:
- Use reverse technique or extra array.',
'Rotated array.', 3, '["Array","Two Pointers","Math"]')
ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  statement = VALUES(statement),
  expected = VALUES(expected),
  stars = VALUES(stars),
  tags = VALUES(tags);

-- =================================================================
-- Problem 17: Longest Increasing Subsequence
-- =================================================================
INSERT INTO problems (id, title, statement, expected, stars, tags) VALUES
(17, 'Longest Increasing Subsequence',
'Return the length of the longest strictly increasing subsequence in an array.

Example:
Input: nums = [10,9,2,5,3,7,101,18]
Output: 4

Hints:
- Use DP or binary search optimization.',
'Length of LIS.', 4, '["Array","Dynamic Programming","Binary Search"]')
ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  statement = VALUES(statement),
  expected = VALUES(expected),
  stars = VALUES(stars),
  tags = VALUES(tags);

-- =================================================================
-- Problem 18: Valid Parentheses
-- =================================================================
INSERT INTO problems (id, title, statement, expected, stars, tags) VALUES
(18, 'Valid Parentheses',
'Check if parentheses in a string are valid. Open brackets must be closed by same type in order.

Example:
Input: s = "()[]{}"
Output: true

Hints:
- Use stack to track open brackets.',
'true or false.', 2, '["String","Stack"]')
ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  statement = VALUES(statement),
  expected = VALUES(expected),
  stars = VALUES(stars),
  tags = VALUES(tags);

-- =================================================================
-- Problem 19: Best Time to Buy and Sell Stock
-- =================================================================
INSERT INTO problems (id, title, statement, expected, stars, tags) VALUES
(19, 'Best Time to Buy and Sell Stock',
'Maximize profit by buying and selling one stock once from given prices.

Example:
Input: prices = [7,1,5,3,6,4]
Output: 5

Hints:
- Track minimum price and maximum profit.',
'Maximum profit.', 2, '["Array","Dynamic Programming"]')
ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  statement = VALUES(statement),
  expected = VALUES(expected),
  stars = VALUES(stars),
  tags = VALUES(tags);

-- =================================================================
-- Problem 20: Spiral Matrix
-- =================================================================
INSERT INTO problems (id, title, statement, expected, stars, tags) VALUES
(20, 'Spiral Matrix',
'Return elements of a matrix in spiral order.

Example:
Input: [[1,2,3],[4,5,6],[7,8,9]]
Output: [1,2,3,6,9,8,7,4,5]

Hints:
- Traverse layer by layer.',
'List of elements in spiral order.', 3, '["Array","Matrix","Simulation"]')
ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  statement = VALUES(statement),
  expected = VALUES(expected),
  stars = VALUES(stars),
  tags = VALUES(tags);

-- =================================================================
-- Problem 21: Greatest Common Divisor
-- =================================================================
INSERT INTO problems (id, title, statement, expected, stars, tags) VALUES
(21, 'Greatest Common Divisor',
'Compute the GCD of two integers a and b.

Example:
Input: a = 18, b = 24
Output: 6

Hints:
- Use Euclidean algorithm.',
'GCD of a and b.', 2, '["Math"]')
ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  statement = VALUES(statement),
  expected = VALUES(expected),
  stars = VALUES(stars),
  tags = VALUES(tags);

-- =================================================================
-- Problem 22: First Unique Character in a String
-- =================================================================
INSERT INTO problems (id, title, statement, expected, stars, tags) VALUES
(22, 'First Unique Character in a String',
'Return index of first non-repeating character in string, or -1 if none.

Example:
Input: s = "leetcode"
Output: 0

Hints:
- Use a hash table or array to count frequencies.',
'Index or -1.', 2, '["String","Hash Table"]')
ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  statement = VALUES(statement),
  expected = VALUES(expected),
  stars = VALUES(stars),
  tags = VALUES(tags);

-- =================================================================
-- Problem 23: Palindrome Number
-- =================================================================
INSERT INTO problems (id, title, statement, expected, stars, tags) VALUES
(23, 'Palindrome Number',
'Check if an integer reads the same forward and backward.

Example:
Input: x = 121
Output: true

Hints:
- Compare digits from both ends.',
'true or false.', 1, '["Math"]')
ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  statement = VALUES(statement),
  expected = VALUES(expected),
  stars = VALUES(stars),
  tags = VALUES(tags);

-- =================================================================
-- Problem 24: Valid Anagram
-- =================================================================
INSERT INTO problems (id, title, statement, expected, stars, tags) VALUES
(24, 'Valid Anagram',
'Check if two strings are anagrams of each other.

Example:
Input: s = "listen", t = "silent"
Output: true

Hints:
- Count frequency of each character.',
'true or false.', 1, '["String","Hash Table","Sorting"]')
ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  statement = VALUES(statement),
  expected = VALUES(expected),
  stars = VALUES(stars),
  tags = VALUES(tags);

-- =================================================================
-- Problem 25: Maximum Subarray
-- =================================================================
INSERT INTO problems (id, title, statement, expected, stars, tags) VALUES
(25, 'Maximum Subarray',
'Return sum of contiguous subarray with largest sum.

Example:
Input: nums = [-2,1,-3,4,-1,2,1,-5,4]
Output: 6

Hints:
- Use Kadane''s algorithm.',
'Maximum subarray sum.', 3, '["Array","Dynamic Programming","Divide and Conquer"]')
ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  statement = VALUES(statement),
  expected = VALUES(expected),
  stars = VALUES(stars),
  tags = VALUES(tags);

-- =================================================================
-- Problem 26: Invert Binary Tree
-- =================================================================
INSERT INTO problems (id, title, statement, expected, stars, tags) VALUES
(26, 'Invert Binary Tree',
'Invert a binary tree and return its root.

Example:
Input: root = [4,2,7,1,3,6,9]
Output: [4,7,2,9,6,3,1]

Hints:
- Swap left and right children recursively.',
'Root of inverted tree.', 2, '["Tree","Recursion","DFS","BFS"]')
ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  statement = VALUES(statement),
  expected = VALUES(expected),
  stars = VALUES(stars),
  tags = VALUES(tags);

-- =================================================================
-- Problem 27: Climbing Stairs
-- =================================================================
INSERT INTO problems (id, title, statement, expected, stars, tags) VALUES
(27, 'Climbing Stairs',
'Count distinct ways to climb n stairs taking 1 or 2 steps at a time.

Example:
Input: n = 3
Output: 3

Hints:
- Use DP with memoization.',
'Number of ways.', 2, '["Dynamic Programming","Math"]')
ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  statement = VALUES(statement),
  expected = VALUES(expected),
  stars = VALUES(stars),
  tags = VALUES(tags);

-- =================================================================
-- Problem 28: Min Stack
-- =================================================================
INSERT INTO problems (id, title, statement, expected, stars, tags) VALUES
(28, 'Min Stack',
'Design stack supporting push, pop, top, and retrieving min in O(1).

Example:
Push 2, Push 0, GetMin -> returns 0

Hints:
- Use auxiliary stack to track minimum.',
'Fully functional MinStack class.', 3, '["Stack","Design"]')
ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  statement = VALUES(statement),
  expected = VALUES(expected),
  stars = VALUES(stars),
  tags = VALUES(tags);

-- =================================================================
-- Problem 29: Maximum Depth of Binary Tree
-- =================================================================
INSERT INTO problems (id, title, statement, expected, stars, tags) VALUES
(29, 'Maximum Depth of Binary Tree',
'Return maximum depth of a binary tree.

Example:
Input: root = [3,9,20,null,null,15,7]
Output: 3

Hints:
- Use DFS or BFS.',
'Maximum depth.', 1, '["Tree","Recursion","DFS","BFS"]')
ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  statement = VALUES(statement),
  expected = VALUES(expected),
  stars = VALUES(stars),
  tags = VALUES(tags);

-- =================================================================
-- Problem 30: Product of Array Except Self
-- =================================================================
INSERT INTO problems (id, title, statement, expected, stars, tags) VALUES
(30, 'Product of Array Except Self',
'Return array where each element is product of all other elements.

Example:
Input: nums = [1,2,3,4]
Output: [24,12,8,6]

Hints:
- Use prefix and suffix product arrays.',
'Array of products.', 3, '["Array","Prefix Sum"]')
ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  statement = VALUES(statement),
  expected = VALUES(expected),
  stars = VALUES(stars),
  tags = VALUES(tags);

-- =================================================================
-- Problem 31: Kth Largest Element in an Array
-- =================================================================
INSERT INTO problems (id, title, statement, expected, stars, tags) VALUES
(31, 'Kth Largest Element in an Array',
'Return kth largest element in an array (not necessarily distinct).

Example:
Input: nums = [3,2,1,5,6,4], k = 2
Output: 5

Hints:
- Use min-heap of size k.',
'Kth largest element.', 3, '["Array","Heap","Sorting"]')
ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  statement = VALUES(statement),
  expected = VALUES(expected),
  stars = VALUES(stars),
  tags = VALUES(tags);

-- =================================================================
-- Problem 32: Number of Islands
-- =================================================================
INSERT INTO problems (id, title, statement, expected, stars, tags) VALUES
(32, 'Number of Islands',
'Count islands in a 2D grid of 0s (water) and 1s (land).

Example:
Input: grid = [[1,1,0],[0,1,0],[1,0,1]]
Output: 3

Hints:
- Use DFS/BFS to mark visited land.',
'Number of islands.', 3, '["DFS","BFS","Matrix"]')
ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  statement = VALUES(statement),
  expected = VALUES(expected),
  stars = VALUES(stars),
  tags = VALUES(tags);

-- =================================================================
-- Problem 33: Top K Frequent Elements
-- =================================================================
INSERT INTO problems (id, title, statement, expected, stars, tags) VALUES
(33, 'Top K Frequent Elements',
'Return k most frequent elements from array.

Example:
Input: nums = [1,1,1,2,2,3], k = 2
Output: [1,2]

Hints:
- Use hashmap and heap.',
'Array of k elements.', 3, '["Hash Table","Heap","Sorting"]')
ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  statement = VALUES(statement),
  expected = VALUES(expected),
  stars = VALUES(stars),
  tags = VALUES(tags);

-- =================================================================
-- Problem 34: Implement Trie
-- =================================================================
INSERT INTO problems (id, title, statement, expected, stars, tags) VALUES
(34, 'Implement Trie',
'Implement Trie with insert, search, and startsWith.

Example:
Insert "apple", Search "app" -> false, startsWith "app" -> true

Hints:
- Standard trie data structure with nodes for each character.',
'Functional Trie class.', 4, '["Design","Trie"]')
ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  statement = VALUES(statement),
  expected = VALUES(expected),
  stars = VALUES(stars),
  tags = VALUES(tags);

-- =================================================================
-- Problem 35: Word Ladder (BFS)
-- =================================================================
INSERT INTO problems (id, title, statement, expected, stars, tags) VALUES
(35, 'Word Ladder',
'Find shortest transformation from beginWord to endWord using valid intermediate words.

Example:
Input: beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]
Output: 5

Hints:
- BFS traversal on word graph.',
'Length of shortest transformation.', 4, '["BFS","Graph","String"]')
ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  statement = VALUES(statement),
  expected = VALUES(expected),
  stars = VALUES(stars),
  tags = VALUES(tags);

-- =================================================================
-- Problem 36: Serialize and Deserialize Binary Tree
-- =================================================================
INSERT INTO problems (id, title, statement, expected, stars, tags) VALUES
(36, 'Serialize and Deserialize Binary Tree',
'Design methods to serialize a tree to string and deserialize back.

Example:
Input: root = [1,2,3,null,null,4,5]
Output: Deserialized tree matches original

Hints:
- Use preorder traversal with markers for null nodes.',
'Methods serialize(root) and deserialize(data).', 4, '["Tree","DFS","Design"]')
ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  statement = VALUES(statement),
  expected = VALUES(expected),
  stars = VALUES(stars),
  tags = VALUES(tags);

-- =================================================================
-- Problem 37: LRU Cache
-- =================================================================
INSERT INTO problems (id, title, statement, expected, stars, tags) VALUES
(37, 'LRU Cache',
'Design LRU Cache with get and put operations in O(1).

Example:
put(1,1), put(2,2), get(1) -> 1

Hints:
- Use hashmap + doubly linked list.',
'Functional LRU Cache class.', 5, '["Design","Hash Table","Linked List"]')
ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  statement = VALUES(statement),
  expected = VALUES(expected),
  stars = VALUES(stars),
  tags = VALUES(tags);

-- =================================================================
-- Problem 38: Course Schedule
-- =================================================================
INSERT INTO problems (id, title, statement, expected, stars, tags) VALUES
(38, 'Course Schedule',
'Determine if all courses can be finished given prerequisites.

Example:
Input: numCourses = 2, prerequisites = [[1,0]]
Output: true

Hints:
- Model as directed graph and detect cycle.',
'true or false.', 4, '["Graph","DFS","BFS","Topological Sort"]')
ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  statement = VALUES(statement),
  expected = VALUES(expected),
  stars = VALUES(stars),
  tags = VALUES(tags);

-- =================================================================
-- Problem 39: Sliding Window Maximum
-- =================================================================
INSERT INTO problems (id, title, statement, expected, stars, tags) VALUES
(39, 'Sliding Window Maximum',
'Return maximum value in each sliding window of size k.

Example:
Input: nums = [1,3,-1,-3,5,3,6,7], k = 3
Output: [3,3,5,5,6,7]

Hints:
- Use deque for efficient max retrieval.',
'Array of window maximums.', 4, '["Array","Deque","Sliding Window"]')
ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  statement = VALUES(statement),
  expected = VALUES(expected),
  stars = VALUES(stars),
  tags = VALUES(tags);

-- =================================================================
-- Problem 40: Word Search
-- =================================================================
INSERT INTO problems (id, title, statement, expected, stars, tags) VALUES
(40, 'Word Search',
'Check if word exists in 2D board by adjacent letters (horizontally or vertically).

Example:
Input: board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"
Output: true

Hints:
- Use DFS with backtracking.',
'true or false.', 4, '["Backtracking","Matrix","DFS"]')
ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  statement = VALUES(statement),
  expected = VALUES(expected),
  stars = VALUES(stars),
  tags = VALUES(tags);
