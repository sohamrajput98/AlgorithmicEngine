INSERT INTO testcases (id, problem_id, input_data, expected_output, is_sample, time_limit_ms, memory_limit_kb, time_complexity, space_complexity) VALUES
-- Problem 1: Hello, World!
(1,1,'Hello, World!','Hello, World!',true,1000,65536,'O(1)','O(1)'),
(2,1,'Hello, World!','Hello, World!',false,1000,65536,'O(1)','O(1)'),
(3,1,'Hello, World!','Hello, World!',false,1000,65536,'O(1)','O(1)'),

-- Problem 2: Add Two Numbers
(4,2,'2 3','5',true,1000,65536,'O(1)','O(1)'),
(5,2,'-10 4','-6',false,1000,65536,'O(1)','O(1)'),
(6,2,'0 0','0',false,1000,65536,'O(1)','O(1)'),

-- Problem 3: Is Even?
(7,3,'6','true',true,1000,65536,'O(1)','O(1)'),
(8,3,'7','false',false,1000,65536,'O(1)','O(1)'),
(9,3,'0','true',false,1000,65536,'O(1)','O(1)'),

-- Problem 4: Contains Duplicate
(10,4,'1 2 3 1','true',true,1000,65536,'O(n)','O(n)'),
(11,4,'1 2 3 4','false',false,1000,65536,'O(n)','O(n)'),
(12,4,'','false',false,1000,65536,'O(n)','O(n)'),

-- Problem 5: Two Sum
(13,5,'2 7 11 15 9','[0,1]',true,1000,65536,'O(n)','O(n)'),
(14,5,'3 2 4 6','[1,2]',false,1000,65536,'O(n)','O(n)'),
(15,5,'3 3 6','[0,1]',false,1000,65536,'O(n)','O(n)'),

-- Problem 6: Valid Palindrome
(16,6,'A man, a plan, a canal: Panama','true',true,1000,65536,'O(n)','O(1)'),
(17,6,'race a car','false',false,1000,65536,'O(n)','O(1)'),
(18,6,' ','true',false,1000,65536,'O(n)','O(1)'),

-- Problem 7: Find Maximum in Array
(19,7,'3 5 1 9 2','9',true,1000,65536,'O(n)','O(1)'),
(20,7,'-1 -5 -3','-1',false,1000,65536,'O(n)','O(1)'),
(21,7,'42','42',false,1000,65536,'O(n)','O(1)'),

-- Problem 8: Sum of Array Elements
(22,8,'1 2 3 4 5','15',true,1000,65536,'O(n)','O(1)'),
(23,8,'-1 -2 3','0',false,1000,65536,'O(n)','O(1)'),
(24,8,'','0',false,1000,65536,'O(n)','O(1)'),

-- Problem 9: Binary Search
(25,9,'-1 0 3 5 9 12 9','4',true,1000,65536,'O(log n)','O(1)'),
(26,9,'-1 0 3 5 9 12 2','-1',false,1000,65536,'O(log n)','O(1)'),
(27,9,'5 5','0',false,1000,65536,'O(log n)','O(1)'),

-- Problem 10: Reverse Linked List
(28,10,'1 2 3 4 5','5 4 3 2 1',true,1000,65536,'O(n)','O(1)'),
(29,10,'1 2','2 1',false,1000,65536,'O(n)','O(1)'),
(30,10,'','',false,1000,65536,'O(n)','O(1)');

-- Problem 11: Linked List Cycle
REPLACE INTO testcases (id, problem_id, input_data, expected_output, is_sample, time_limit_ms, memory_limit_kb, time_complexity, space_complexity) VALUES
(31, 11, '3 2 0 -4 1', 'true', true, 1000, 65536, 'O(n)', 'O(1)'),
(32, 11, '1 2 0', 'true', false, 1000, 65536, 'O(n)', 'O(1)'),
(33, 11, '1 0', 'false', false, 1000, 65536, 'O(n)', 'O(1)');

-- Problem 12: Implement Queue using Stacks
REPLACE INTO testcases (id, problem_id, input_data, expected_output, is_sample, time_limit_ms, memory_limit_kb, time_complexity, space_complexity) VALUES
(34, 12, 'MyQueue push 1 push 2 peek pop empty', 'null null null 1 1 false', true, 1000, 65536, 'O(1)', 'O(n)'),
(35, 12, 'MyQueue push 1 pop empty', 'null null 1 true', false, 1000, 65536, 'O(1)', 'O(n)'),
(36, 12, 'MyQueue empty', 'null true', false, 1000, 65536, 'O(1)', 'O(n)');

-- Problem 13: Merge Two Sorted Lists
REPLACE INTO testcases (id, problem_id, input_data, expected_output, is_sample, time_limit_ms, memory_limit_kb, time_complexity, space_complexity) VALUES
(37, 13, '1 2 4 1 3 4', '1 1 2 3 4 4', true, 1000, 65536, 'O(n+m)', 'O(1)'),
(38, 13, '', '', false, 1000, 65536, 'O(n+m)', 'O(1)'),
(39, 13, '0', '0', false, 1000, 65536, 'O(n+m)', 'O(1)');

-- Problem 14: Count Primes
REPLACE INTO testcases (id, problem_id, input_data, expected_output, is_sample, time_limit_ms, memory_limit_kb, time_complexity, space_complexity) VALUES
(40, 14, '10', '4', true, 1000, 65536, 'O(n sqrt n)', 'O(1)'),
(41, 14, '0', '0', false, 1000, 65536, 'O(n sqrt n)', 'O(1)'),
(42, 14, '2', '1', false, 1000, 65536, 'O(n sqrt n)', 'O(1)');

-- Problem 15: Factorial of a Number
REPLACE INTO testcases (id, problem_id, input_data, expected_output, is_sample, time_limit_ms, memory_limit_kb, time_complexity, space_complexity) VALUES
(43, 15, '5', '120', true, 1000, 65536, 'O(n)', 'O(1)'),
(44, 15, '0', '1', false, 1000, 65536, 'O(n)', 'O(1)'),
(45, 15, '1', '1', false, 1000, 65536, 'O(n)', 'O(1)');

-- Problem 16: Rotate Array
REPLACE INTO testcases (id, problem_id, input_data, expected_output, is_sample, time_limit_ms, memory_limit_kb, time_complexity, space_complexity) VALUES
(46, 16, '1 2 3 4 5 6 7 3', '5 6 7 1 2 3 4', true, 1000, 65536, 'O(n)', 'O(1)'),
(47, 16, '-1 -100 3 99 2', '3 99 -1 -100', false, 1000, 65536, 'O(n)', 'O(1)'),
(48, 16, '1 2 3', '3 1 2', false, 1000, 65536, 'O(n)', 'O(1)');

-- Problem 17: Longest Increasing Subsequence
REPLACE INTO testcases (id, problem_id, input_data, expected_output, is_sample, time_limit_ms, memory_limit_kb, time_complexity, space_complexity) VALUES
(49, 17, '10 9 2 5 3 7 101 18', '4', true, 1000, 65536, 'O(n^2)', 'O(n)'),
(50, 17, '0 1 0 3 2 3', '4', false, 1000, 65536, 'O(n^2)', 'O(n)'),
(51, 17, '7 7 7 7 7 7 7', '1', false, 1000, 65536, 'O(n^2)', 'O(n)');

-- Problem 18: Valid Parentheses
REPLACE INTO testcases (id, problem_id, input_data, expected_output, is_sample, time_limit_ms, memory_limit_kb, time_complexity, space_complexity) VALUES
(52, 18, '()[]{}', 'true', true, 1000, 65536, 'O(n)', 'O(n)'),
(53, 18, '(]', 'false', false, 1000, 65536, 'O(n)', 'O(n)'),
(54, 18, '([)]', 'false', false, 1000, 65536, 'O(n)', 'O(n)');

-- Problem 19: Best Time to Buy and Sell Stock
REPLACE INTO testcases (id, problem_id, input_data, expected_output, is_sample, time_limit_ms, memory_limit_kb, time_complexity, space_complexity) VALUES
(55, 19, '7 1 5 3 6 4', '5', true, 1000, 65536, 'O(n)', 'O(1)'),
(56, 19, '7 6 4 3 1', '0', false, 1000, 65536, 'O(n)', 'O(1)'),
(57, 19, '2 4 1', '2', false, 1000, 65536, 'O(n)', 'O(1)');

-- Problem 20: Spiral Matrix
REPLACE INTO testcases (id, problem_id, input_data, expected_output, is_sample, time_limit_ms, memory_limit_kb, time_complexity, space_complexity) VALUES
(58, 20, '1 2 3 4 5 6 7 8 9', '1 2 3 6 9 8 7 4 5', true, 1000, 65536, 'O(n*m)', 'O(1)'),
(59, 20, '1 2 3 4 5 6 7 8 9 10 11 12', '1 2 3 4 8 12 11 10 9 5 6 7', false, 1000, 65536, 'O(n*m)', 'O(1)'),
(60, 20, '7 9 6', '7 9 6', false, 1000, 65536, 'O(n*m)', 'O(1)');

-- Problem 21: Maximum Subarray
REPLACE INTO testcases (id, problem_id, input_data, expected_output, is_sample, time_limit_ms, memory_limit_kb, time_complexity, space_complexity) VALUES
(61, 21, '-2 1 -3 4 -1 2 1 -5 4', '6', true, 1000, 65536, 'O(n)', 'O(1)'),
(62, 21, '1', '1', false, 1000, 65536, 'O(n)', 'O(1)'),
(63, 21, '5 4 -1 7 8', '23', false, 1000, 65536, 'O(n)', 'O(1)');

-- Problem 22: Intersection of Two Arrays
REPLACE INTO testcases (id, problem_id, input_data, expected_output, is_sample, time_limit_ms, memory_limit_kb, time_complexity, space_complexity) VALUES
(64, 22, '1 2 2 1 2 2', '2', true, 1000, 65536, 'O(n+m)', 'O(n+m)'),
(65, 22, '4 9 5 9 4 9', '9 4', false, 1000, 65536, 'O(n+m)', 'O(n+m)'),
(66, 22, '1 2 3 4 5 6 7 8 9', '1 2 3', false, 1000, 65536, 'O(n+m)', 'O(n+m)');

-- Problem 23: Reverse Linked List
REPLACE INTO testcases (id, problem_id, input_data, expected_output, is_sample, time_limit_ms, memory_limit_kb, time_complexity, space_complexity) VALUES
(67, 23, '1 2 3 4 5', '5 4 3 2 1', true, 1000, 65536, 'O(n)', 'O(1)'),
(68, 23, '', '', false, 1000, 65536, 'O(n)', 'O(1)'),
(69, 23, '1', '1', false, 1000, 65536, 'O(n)', 'O(1)');

-- Problem 24: Linked List Cycle II
REPLACE INTO testcases (id, problem_id, input_data, expected_output, is_sample, time_limit_ms, memory_limit_kb, time_complexity, space_complexity) VALUES
(70, 24, '3 2 0 -4 2', '2', true, 1000, 65536, 'O(n)', 'O(1)'),
(71, 24, '1 2 1', '1', false, 1000, 65536, 'O(n)', 'O(1)'),
(72, 24, '1', '', false, 1000, 65536, 'O(n)', 'O(1)');

-- Problem 25: Climbing Stairs
REPLACE INTO testcases (id, problem_id, input_data, expected_output, is_sample, time_limit_ms, memory_limit_kb, time_complexity, space_complexity) VALUES
(73, 25, '2', '2', true, 1000, 65536, 'O(n)', 'O(1)'),
(74, 25, '3', '3', false, 1000, 65536, 'O(n)', 'O(1)'),
(75, 25, '0', '0', false, 1000, 65536, 'O(n)', 'O(1)');

-- Problem 26: Valid Anagram
REPLACE INTO testcases (id, problem_id, input_data, expected_output, is_sample, time_limit_ms, memory_limit_kb, time_complexity, space_complexity) VALUES
(76, 26, 'anagram nagaram', 'true', true, 1000, 65536, 'O(n)', 'O(1)'),
(77, 26, 'rat car', 'false', false, 1000, 65536, 'O(n)', 'O(1)'),
(78, 26, 'a b', 'false', false, 1000, 65536, 'O(n)', 'O(1)');

-- Problem 27: Merge Intervals
REPLACE INTO testcases (id, problem_id, input_data, expected_output, is_sample, time_limit_ms, memory_limit_kb, time_complexity, space_complexity) VALUES
(79, 27, '1 3 2 6 8 10 15 18', '1 6 8 10 15 18', true, 1000, 65536, 'O(n log n)', 'O(n)'),
(80, 27, '1 4 4 5', '1 5', false, 1000, 65536, 'O(n log n)', 'O(n)'),
(81, 27, '1 4 0 2', '0 4', false, 1000, 65536, 'O(n log n)', 'O(n)');

-- Problem 28: Minimum Path Sum
REPLACE INTO testcases (id, problem_id, input_data, expected_output, is_sample, time_limit_ms, memory_limit_kb, time_complexity, space_complexity) VALUES
(82, 28, '1 3 1 1 5 1 4 2 1', '7', true, 1000, 65536, 'O(m*n)', 'O(1)'),
(83, 28, '1 2 3 4 5 6', '12', false, 1000, 65536, 'O(m*n)', 'O(1)'),
(84, 28, '0', '0', false, 1000, 65536, 'O(m*n)', 'O(1)');

-- Problem 29: Pascal's Triangle
REPLACE INTO testcases (id, problem_id, input_data, expected_output, is_sample, time_limit_ms, memory_limit_kb, time_complexity, space_complexity) VALUES
(85, 29, '5', '1 1 1 1 2 1 1 3 3 1', true, 1000, 65536, 'O(n^2)', 'O(n^2)'),
(86, 29, '1', '1', false, 1000, 65536, 'O(n^2)', 'O(n^2)'),
(87, 29, '0', '', false, 1000, 65536, 'O(n^2)', 'O(n^2)');

-- Problem 30: Valid Sudoku
REPLACE INTO testcases (id, problem_id, input_data, expected_output, is_sample, time_limit_ms, memory_limit_kb, time_complexity, space_complexity) VALUES
(88, 30, '5 3 . . 7 . . . . 6 . . 1 9 5 . . . . 9 8 . . . . 6 . 8 . . . 6 . . . 3 4 . . 8 . 3 . . 1 7 . . . 2 . . . 6 . 6 . . . 2 8 . . . 4 1 9 . . 5 . . . . 8 . . 7 9', 'true', true, 1000, 65536, 'O(1)', 'O(1)'),
(89, 30, '8 3 . . 7 . . . . 6 . . 1 9 5 . . . . 9 8 . . . . 6 . 8 . . . 6 . . . 3 4 . . 8 . 3 . . 1 7 . . . 2 . . . 6 . 6 . . . 2 8 . . . 4 1 9 . . 5 . . . . 8 . . 7 9', 'false', false, 1000, 65536, 'O(1)', 'O(1)'),
(90, 30, '5 3 . . 7 . . . . 6 . . 1 9 5', 'true', false, 1000, 65536, 'O(1)', 'O(1)');

-- Problem 31: Rotate Array
REPLACE INTO testcases (id, problem_id, input_data, expected_output, is_sample, time_limit_ms, memory_limit_kb, time_complexity, space_complexity) VALUES
(91, 31, '1 2 3 4 5 6 7 3', '5 6 7 1 2 3 4', true, 1000, 65536, 'O(n)', 'O(1)'),
(92, 31, '-1 -100 3 99 2', '3 99 -1 -100', false, 1000, 65536, 'O(n)', 'O(1)'),
(93, 31, '1 2 3', '3 1 2', false, 1000, 65536, 'O(n)', 'O(1)');

-- Problem 32: Group Anagrams
REPLACE INTO testcases (id, problem_id, input_data, expected_output, is_sample, time_limit_ms, memory_limit_kb, time_complexity, space_complexity) VALUES
(94, 32, 'eat tea tan ate nat bat', '[["eat","tea","ate"],["tan","nat"],["bat"]]', true, 1000, 65536, 'O(n*k)', 'O(n*k)'),
(95, 32, 'a', '[["a"]]', false, 1000, 65536, 'O(n*k)', 'O(n*k)'),
(96, 32, 'abc bca cab', '[["abc","bca","cab"]]', false, 1000, 65536, 'O(n*k)', 'O(n*k)');

-- Problem 33: Longest Substring Without Repeating Characters
REPLACE INTO testcases (id, problem_id, input_data, expected_output, is_sample, time_limit_ms, memory_limit_kb, time_complexity, space_complexity) VALUES
(97, 33, 'abcabcbb', '3', true, 1000, 65536, 'O(n)', 'O(min(n,m))'),
(98, 33, 'bbbbb', '1', false, 1000, 65536, 'O(n)', 'O(min(n,m))'),
(99, 33, 'pwwkew', '3', false, 1000, 65536, 'O(n)', 'O(min(n,m))');

-- Problem 34: Median of Two Sorted Arrays
REPLACE INTO testcases (id, problem_id, input_data, expected_output, is_sample, time_limit_ms, memory_limit_kb, time_complexity, space_complexity) VALUES
(100, 34, '1 3 2 4', '2.5', true, 1000, 65536, 'O(log(min(n,m)))', 'O(1)'),
(101, 34, '1 2 3 4 5 6', '3.5', false, 1000, 65536, 'O(log(min(n,m)))', 'O(1)'),
(102, 34, '0 0 0 0', '0', false, 1000, 65536, 'O(log(min(n,m)))', 'O(1)');

-- Problem 35: Valid Parentheses
REPLACE INTO testcases (id, problem_id, input_data, expected_output, is_sample, time_limit_ms, memory_limit_kb, time_complexity, space_complexity) VALUES
(103, 35, '()', 'true', true, 1000, 65536, 'O(n)', 'O(n)'),
(104, 35, '()[]{}', 'true', false, 1000, 65536, 'O(n)', 'O(n)'),
(105, 35, '(]', 'false', false, 1000, 65536, 'O(n)', 'O(n)');

-- Problem 36: Remove Duplicates from Sorted Array
REPLACE INTO testcases (id, problem_id, input_data, expected_output, is_sample, time_limit_ms, memory_limit_kb, time_complexity, space_complexity) VALUES
(106, 36, '1 1 2', '2', true, 1000, 65536, 'O(n)', 'O(1)'),
(107, 36, '0 0 1 1 1 2 2 3 3 4', '5', false, 1000, 65536, 'O(n)', 'O(1)'),
(108, 36, '', '0', false, 1000, 65536, 'O(n)', 'O(1)');

-- Problem 37: Product of Array Except Self
REPLACE INTO testcases (id, problem_id, input_data, expected_output, is_sample, time_limit_ms, memory_limit_kb, time_complexity, space_complexity) VALUES
(109, 37, '1 2 3 4', '24 12 8 6', true, 1000, 65536, 'O(n)', 'O(1)'),
(110, 37, '0 1', '1 0', false, 1000, 65536, 'O(n)', 'O(1)'),
(111, 37, '-1 1 0 -3 3', '0 0 9 0 0', false, 1000, 65536, 'O(n)', 'O(1)');

-- Problem 38: Find Minimum in Rotated Sorted Array
REPLACE INTO testcases (id, problem_id, input_data, expected_output, is_sample, time_limit_ms, memory_limit_kb, time_complexity, space_complexity) VALUES
(112, 38, '3 4 5 1 2', '1', true, 1000, 65536, 'O(log n)', 'O(1)'),
(113, 38, '4 5 6 7 0 1 2', '0', false, 1000, 65536, 'O(log n)', 'O(1)'),
(114, 38, '11 13 15 17', '11', false, 1000, 65536, 'O(log n)', 'O(1)');

-- Problem 39: Search in Rotated Sorted Array
REPLACE INTO testcases (id, problem_id, input_data, expected_output, is_sample, time_limit_ms, memory_limit_kb, time_complexity, space_complexity) VALUES
(115, 39, '4 5 6 7 0 1 2 0', '4', true, 1000, 65536, 'O(log n)', 'O(1)'),
(116, 39, '4 5 6 7 0 1 2 3', '-1', false, 1000, 65536, 'O(log n)', 'O(1)'),
(117, 39, '1 3 5 7 9 0', '5', false, 1000, 65536, 'O(log n)', 'O(1)');

-- Problem 40: Combination Sum
REPLACE INTO testcases (id, problem_id, input_data, expected_output, is_sample, time_limit_ms, memory_limit_kb, time_complexity, space_complexity) VALUES
(118, 40, '2 3 6 7 7', '7 2 2 3', true, 1000, 65536, 'O(2^n)', 'O(n)'),
(119, 40, '2 3 5 8', '8 2 2 2 2 2 2', false, 1000, 65536, 'O(2^n)', 'O(n)'),
(120, 40, '1', '1', false, 1000, 65536, 'O(2^n)', 'O(n)');
