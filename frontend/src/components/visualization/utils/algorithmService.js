// Named exports only
// Returns an array of step objects for the requested algorithm.
// Each step: { array: [...], activeIndices: [i,j], description: string, timeComplexity: string, spaceComplexity: string }

export function getAlgorithmSteps(algorithmName, inputArray = []) {
  const name = (algorithmName || "").toLowerCase();

  // Normalize simple mapping
  if (/bubble/.test(name)) return bubbleSortSteps(inputArray);
  if (/insertion/.test(name)) return insertionSortSteps(inputArray);
  if (/merge/.test(name)) return mergeSortSteps(inputArray);
  if (/binary/.test(name)) return binarySearchSteps(inputArray);
  if (/pair sum|pair|two pointers/.test(name)) return pairSumSteps(inputArray);
  if (/slow fast|floyd|slow-fast/.test(name)) return slowFastSteps(inputArray);

  // fallback: one-step snapshot
  return [
    {
      array: [...inputArray],
      activeIndices: [],
      description: "No visualization available for this algorithm (placeholder).",
      timeComplexity: "N/A",
      spaceComplexity: "N/A",
    },
  ];
}

// --- Bubble Sort steps (example)
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
      // comparison step
      steps.push({
        array: [...arr],
        activeIndices: [j, j + 1],
        description: `Compare indices ${j} and ${j + 1} (${arr[j]} vs ${arr[j + 1]})`,
        timeComplexity: "O(n^2)",
        spaceComplexity: "O(1)",
      });
      if (arr[j] > arr[j + 1]) {
        // swap step
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        steps.push({
          array: [...arr],
          activeIndices: [j, j + 1],
          description: `Swap indices ${j} and ${j + 1}`,
          timeComplexity: "O(n^2)",
          spaceComplexity: "O(1)",
        });
      }
    }
  }

  steps.push({
    array: [...arr],
    activeIndices: [],
    description: "Sorting complete.",
    timeComplexity: "O(n^2)",
    spaceComplexity: "O(1)",
  });

  return steps;
}

// --- Insertion Sort
function insertionSortSteps(arrIn) {
  const arr = [...arrIn];
  const steps = [
    {
      array: [...arr],
      activeIndices: [],
      description: "Initial array",
      timeComplexity: "O(n^2)",
      spaceComplexity: "O(1)",
    },
  ];

  for (let i = 1; i < arr.length; i++) {
    const key = arr[i];
    let j = i - 1;
    steps.push({
      array: [...arr],
      activeIndices: [i],
      description: `Pick key ${key} at index ${i}`,
      timeComplexity: "O(n^2)",
      spaceComplexity: "O(1)",
    });
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      steps.push({
        array: [...arr],
        activeIndices: [j, j + 1],
        description: `Move ${arr[j]} right to index ${j + 1}`,
        timeComplexity: "O(n^2)",
        spaceComplexity: "O(1)",
      });
      j--;
    }
    arr[j + 1] = key;
    steps.push({
      array: [...arr],
      activeIndices: [j + 1],
      description: `Insert ${key} at index ${j + 1}`,
      timeComplexity: "O(n^2)",
      spaceComplexity: "O(1)",
    });
  }

  steps.push({
    array: [...arr],
    activeIndices: [],
    description: "Insertion sort complete.",
    timeComplexity: "O(n^2)",
    spaceComplexity: "O(1)",
  });

  return steps;
}

// --- Merge Sort (lightweight step emission - not full detailed split view)
function mergeSortSteps(arrIn) {
  const arr = [...arrIn];
  const steps = [];
  function mergeSort(arrSub) {
    if (arrSub.length <= 1) return arrSub;
    const mid = Math.floor(arrSub.length / 2);
    const left = mergeSort(arrSub.slice(0, mid));
    const right = mergeSort(arrSub.slice(mid));
    // naive merge for step tracing
    let res = [];
    let i = 0, j = 0;
    while (i < left.length && j < right.length) {
      steps.push({
        array: [...left, ...right],
        activeIndices: [i, left.length + j],
        description: `Merging ${left[i]} and ${right[j]}`,
        timeComplexity: "O(n log n)",
        spaceComplexity: "O(n)",
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
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
  });
  return steps;
}

// --- Binary Search (assumes sorted input)
function binarySearchSteps(arrIn) {
  const arr = [...arrIn].sort((a, b) => a - b);
  const steps = [
    {
      array: [...arr],
      activeIndices: [],
      description: "Sorted input for binary search",
      timeComplexity: "O(log n)",
      spaceComplexity: "O(1)",
    },
  ];
  let l = 0;
  let r = arr.length - 1;
  while (l <= r) {
    const mid = Math.floor((l + r) / 2);
    steps.push({
      array: [...arr],
      activeIndices: [l, mid, r],
      description: `Check mid index ${mid} (value ${arr[mid]})`,
      timeComplexity: "O(log n)",
      spaceComplexity: "O(1)",
    });
    // for visualization we won't pick a target; just show probing
    if (mid === mid) {
      // break after demonstrating
      break;
    }
  }
  steps.push({
    array: [...arr],
    activeIndices: [],
    description: "Binary search demo steps complete.",
    timeComplexity: "O(log n)",
    spaceComplexity: "O(1)",
  });
  return steps;
}

// --- Pair Sum (two pointers)
function pairSumSteps(arrIn) {
  const arr = [...arrIn].sort((a, b) => a - b);
  const steps = [
    { array: [...arr], activeIndices: [], description: "Sorted array for two-pointers", timeComplexity: "O(n)", spaceComplexity: "O(1)" },
  ];
  let l = 0, r = arr.length - 1;
  while (l < r) {
    steps.push({
      array: [...arr],
      activeIndices: [l, r],
      description: `Check sum ${arr[l]} + ${arr[r]}`,
      timeComplexity: "O(n)",
      spaceComplexity: "O(1)",
    });
    if (arr[l] + arr[r] === 0) {
      steps.push({ array: [...arr], activeIndices: [l, r], description: "Found a pair (demo)", timeComplexity: "O(n)", spaceComplexity: "O(1)" });
      l++; r--;
    } else if (arr[l] + arr[r] < 0) l++;
    else r--;
  }
  steps.push({ array: [...arr], activeIndices: [], description: "Two-pointers complete.", timeComplexity: "O(n)", spaceComplexity: "O(1)" });
  return steps;
}

// --- Slow / Fast (demo)
function slowFastSteps(arrIn) {
  const arr = [...arrIn];
  const steps = [];
  let slow = 0, fast = 0;
  while (fast < arr.length) {
    steps.push({ array: [...arr], activeIndices: [slow, fast], description: `Slow at ${slow}, Fast at ${fast}`, timeComplexity: "O(n)", spaceComplexity: "O(1)" });
    slow++;
    fast += 2;
  }
  steps.push({ array: [...arr], activeIndices: [], description: "Traversal complete.", timeComplexity: "O(n)", spaceComplexity: "O(1)" });
  return steps;
}
