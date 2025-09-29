// --- Main function to get steps, now accepts an args object ---
export function getAlgorithmSteps(algorithmKey, args = {}) {
  const name = (algorithmKey || "").toLowerCase().replace(/\s+/g, ''); // Normalize key

  // The 'array' is the primary input, but others might exist (like 'target')
  const inputArray = args.array || [];

  // Existing Algorithms
  if (/bubblesort/.test(name)) return bubbleSortSteps(inputArray);
  if (/insertionsort/.test(name)) return insertionSortSteps(inputArray);
  if (/mergesort/.test(name)) return mergeSortSteps(inputArray);
  if (/binarysearch/.test(name)) return binarySearchSteps(inputArray, args.target);
  if (/pairsum/.test(name)) return pairSumSteps(inputArray, args.targetSum);
  if (/slowfast/.test(name)) return slowFastSteps(inputArray);

  // Placeholders for new algorithms
  if (/activityselection/.test(name)) return placeholderSteps(args.array, "Activity Selection");
  if (/fractionalknapsack/.test(name)) return placeholderSteps(args.items, "Fractional Knapsack"); // Use items array for placeholder
  if (/bstinsert/.test(name)) return placeholderSteps(args.array, "BST Insert");
  if (/inordertraversal/.test(name)) return placeholderSteps(args.array, "Inorder Traversal");

  // Fallback
  return [{
    array: [...inputArray],
    activeIndices: [],
    description: "No visualization available for this algorithm.",
  }];
}

// --- Algorithm Definitions with Input Metadata ---
export const algorithms = {
  Sorting: [
    {
      key: "bubbleSort",
      name: "Bubble Sort",
      inputs: [
        { name: 'array', type: 'array', default: [8, 3, 5, 1, 9, 2] }
      ]
    },
    {
      key: "insertionSort",
      name: "Insertion Sort",
      inputs: [
        { name: 'array', type: 'array', default: [7, 4, 1, 8, 3] }
      ]
    },
    {
      key: "mergeSort",
      name: "Merge Sort",
      inputs: [
        { name: 'array', type: 'array', default: [9, 1, 7, 3, 5, 8, 2] }
      ]
    },
  ],
  Searching: [
    {
      key: "binarySearch",
      name: "Binary Search",
      inputs: [
        { name: 'array', type: 'array', default: [10, 20, 30, 40, 50, 60, 70], label: 'Sorted Array' },
        { name: 'target', type: 'number', default: 50, label: 'Target Value' }
      ]
    },
  ],
  "Two Pointers": [
    {
      key: "pairSum",
      name: "Pair Sum",
      inputs: [
        { name: 'array', type: 'array', default: [-5, -2, 1, 3, 4, 8] },
        { name: 'targetSum', type: 'number', default: 6, label: 'Target Sum' }
      ]
    },
    {
      key: "slowFast",
      name: "Slow Fast",
      inputs: [
        { name: 'array', type: 'array', default: [1, 2, 3, 4, 5, 6] }
      ]
    },
  ],
  Greedy: [
    {
      key: "activitySelection",
      name: "Activity Selection",
      inputs: [
        { name: 'array', type: 'array', default: [1, 3, 0, 5, 8, 5], label: 'Activities (start/end pairs)' }
      ]
    },
    {
      key: "fractionalKnapsack",
      name: "Fractional Knapsack",
      inputs: [
        { name: 'items', type: 'array', default: [10, 20, 30], label: 'Item Values' },
        { name: 'weights', type: 'array', default: [60, 100, 120], label: 'Item Weights' },
        { name: 'capacity', type: 'number', default: 50, label: 'Knapsack Capacity'}
      ]
    }
  ],
  Tree: [
    {
      key: "bstInsert",
      name: "BST Insert",
      inputs: [
        { name: 'array', type: 'array', default: [10, 5, 15, 2, 7], label: 'Initial Tree (Array)'},
        { name: 'value', type: 'number', default: 12, label: 'Value to Insert'}
      ]
    },
    {
      key: "inorderTraversal",
      name: "Inorder Traversal",
      inputs: [
        { name: 'array', type: 'array', default: [10, 5, 15, 2, 7], label: 'Tree as Array'}
      ]
    }
  ]
};

// --- Helper function for unimplemented algorithms ---
function placeholderSteps(arrIn, name) {
  return [{
    array: Array.isArray(arrIn) ? [...arrIn] : [],
    activeIndices: [],
    description: `Visualization for ${name} is not implemented yet.`,
  }];
}


// --- Bubble Sort steps ---
function bubbleSortSteps(arrIn) {
  const arr = [...arrIn];
  const steps = [];
  const n = arr.length;

  steps.push({
    array: [...arr],
    activeIndices: [],
    description: "Initial array",
    timeComplexity: "O(n^2)",
    spaceComplexity: "O(1)",
  });

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      steps.push({
        array: [...arr],
        activeIndices: [j, j + 1],
        description: `Compare indices ${j} and ${j + 1} (${arr[j]} vs ${arr[j + 1]})`,
      });
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        steps.push({
          array: [...arr],
          activeIndices: [j, j + 1],
          description: `Swap indices ${j} and ${j + 1}`,
        });
      }
    }
  }

  steps.push({
    array: [...arr],
    activeIndices: [],
    description: "Sorting complete.",
  });

  return steps;
}

// --- Insertion Sort ---
function insertionSortSteps(arrIn) {
  const arr = [...arrIn];
  const steps = [{ array: [...arr], activeIndices: [], description: "Initial array" }];

  for (let i = 1; i < arr.length; i++) {
    const key = arr[i];
    let j = i - 1;
    steps.push({
      array: [...arr],
      activeIndices: [i],
      description: `Pick key ${key} at index ${i}`,
    });
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      steps.push({
        array: [...arr],
        activeIndices: [j, j + 1],
        description: `Move ${arr[j]} right to index ${j + 1}`,
      });
      j--;
    }
    arr[j + 1] = key;
    steps.push({
      array: [...arr],
      activeIndices: [j + 1],
      description: `Insert ${key} at index ${j + 1}`,
    });
  }

  steps.push({ array: [...arr], activeIndices: [], description: "Insertion sort complete." });
  return steps;
}

// --- Merge Sort ---
function mergeSortSteps(arrIn) {
  const arr = [...arrIn];
  const steps = [];
  function mergeSort(arrSub) {
    if (arrSub.length <= 1) return arrSub;
    const mid = Math.floor(arrSub.length / 2);
    const left = mergeSort(arrSub.slice(0, mid));
    const right = mergeSort(arrSub.slice(mid));
    let res = [];
    let i = 0, j = 0;
    while (i < left.length && j < right.length) {
      steps.push({
        array: [...left, ...right],
        activeIndices: [i, left.length + j],
        description: `Merging ${left[i]} and ${right[j]}`,
      });
      if (left[i] <= right[j]) res.push(left[i++]);
      else res.push(right[j++]);
    }
    res = res.concat(left.slice(i)).concat(right.slice(j));
    return res;
  }
  mergeSort(arr);
  steps.push({
    array: arr,
    activeIndices: [],
    description: "Merge sort (process complete, merge steps shown abstractly).",
  });
  return steps;
}

// --- Binary Search (Updated) ---
function binarySearchSteps(arrIn, target) {
  const arr = [...arrIn].sort((a, b) => a - b);
  const steps = [];
  steps.push({ array: [...arr], activeIndices: [], description: `Sorted input array. Searching for target: ${target}` });

  let l = 0;
  let r = arr.length - 1;
  while (l <= r) {
    const mid = Math.floor((l + r) / 2);
    steps.push({
      array: [...arr],
      activeIndices: [l, mid, r],
      description: `Left: ${l}, Right: ${r}. Checking middle index ${mid} (value ${arr[mid]})`
    });

    if (arr[mid] === target) {
      steps.push({ array: [...arr], activeIndices: [mid], description: `Target ${target} found at index ${mid}.` });
      return steps;
    } else if (arr[mid] < target) {
      steps.push({ array: [...arr], activeIndices: [l, mid, r], description: `${arr[mid]} < ${target}. Ignoring left half.` });
      l = mid + 1;
    } else {
      steps.push({ array: [...arr], activeIndices: [l, mid, r], description: `${arr[mid]} > ${target}. Ignoring right half.` });
      r = mid - 1;
    }
  }

  steps.push({ array: [...arr], activeIndices: [], description: `Target ${target} not found in the array.` });
  return steps;
}

// --- Pair Sum (Updated) ---
function pairSumSteps(arrIn, targetSum) {
  const arr = [...arrIn].sort((a, b) => a - b);
  const steps = [];
  steps.push({ array: [...arr], activeIndices: [], description: `Sorted array. Looking for a pair with sum: ${targetSum}` });

  let l = 0, r = arr.length - 1;
  while (l < r) {
    const sum = arr[l] + arr[r];
    steps.push({
      array: [...arr],
      activeIndices: [l, r],
      description: `Checking pointers: ${arr[l]} + ${arr[r]} = ${sum}`
    });

    if (sum === targetSum) {
      steps.push({ array: [...arr], activeIndices: [l, r], description: `Found a pair: ${arr[l]} + ${arr[r]} = ${targetSum}.` });
      return steps;
    } else if (sum < targetSum) {
      l++;
    } else {
      r--;
    }
  }

  steps.push({ array: [...arr], activeIndices: [], description: `No pair found with sum ${targetSum}.` });
  return steps;
}

// --- Slow / Fast ---
function slowFastSteps(arrIn) {
  const arr = [...arrIn];
  const steps = [];
  let slow = 0, fast = 0;
  while (fast < arr.length) {
    steps.push({ array: [...arr], activeIndices: [slow, fast], description: `Slow at ${slow}, Fast at ${fast}` });
    slow++;
    fast += 2;
  }
  steps.push({ array: [...arr], activeIndices: [], description: "Traversal complete." });
  return steps;
}