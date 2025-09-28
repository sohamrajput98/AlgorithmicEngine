import axios from './api';
import { getToken } from './auth';

// Helper to fetch visualization steps from backend
const fetchSteps = async (group, algorithm, inputData) => {
  if (!group || !algorithm) {
    throw new Error('Missing group or algorithm');
  }

  const payload = { input: inputData }; // backend expects { input: [...] }

  const res = await axios.post(`/visualizations/${group}/${algorithm}`, payload, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return res.data; // expects backend to return { steps: [...], highlights: [...] }
};

// --- Sorting Algorithms ---
export const fetchBubbleSortSteps = async (input) => {
  return fetchSteps('sorting', 'bubble_sort', input);
};

export const fetchInsertionSortSteps = async (input) => {
  return fetchSteps('sorting', 'insertion_sort', input);
};

export const fetchMergeSortSteps = async (input) => {
  return fetchSteps('sorting', 'merge_sort', input);
};

// --- Greedy Algorithms ---
export const fetchActivitySelectionSteps = async (input) => {
  return fetchSteps('greedy', 'activity_selection', input);
};

export const fetchFractionalKnapsackSteps = async (input) => {
  return fetchSteps('greedy', 'fractional_knapsack', input);
};

// --- Two Pointers ---
export const fetchPairSumSteps = async (input) => {
  return fetchSteps('two_pointers', 'pair_sum', input);
};

export const fetchSlowFastSteps = async (input) => {
  return fetchSteps('two_pointers', 'slow_fast', input);
};

// --- Trees ---
export const fetchBSTInsertSteps = async (input) => {
  return fetchSteps('tree', 'bst_insert', input);
};

export const fetchInorderTraversalSteps = async (input) => {
  return fetchSteps('tree', 'inorder_traversal', input);
};

// Optional generic fetch function for any algorithm
export const fetchAlgorithmSteps = async (group, algorithm, input) => {
  return fetchSteps(group, algorithm, input);
};
