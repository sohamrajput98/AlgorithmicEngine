/**
 * algorithm.js
 * Each exported function accepts an array of values and returns an array of steps.
 * Each step is itself an array of objects: { value, highlight?, description? }
 *
 * Keep functions pure. These are skeletons — feel free to expand for new algos.
 */

export function bubbleSortSteps(input = []) {
  const arr = input.slice();
  const steps = [];

  // push initial state
  steps.push(arr.map((v) => ({ value: v })));

  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      // compare step
      steps.push(
        arr.map((v, idx) => ({ value: v, highlight: idx === j || idx === j + 1 ? "compare" : "" }))
      );
      if (arr[j] > arr[j + 1]) {
        // swap in array
        const tmp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = tmp;
        // after swap
        steps.push(
          arr.map((v, idx) => ({ value: v, highlight: idx === j || idx === j + 1 ? "swap" : "" }))
        );
      }
    }
  }

  steps.push(arr.map((v) => ({ value: v, highlight: "active" })));
  return steps;
}

export function twoPointersSteps(input = []) {
  const arr = input.slice();
  const steps = [];
  if (arr.length === 0) return steps;

  let l = 0;
  let r = arr.length - 1;

  // initial
  steps.push(arr.map((v, idx) => ({ value: v, highlight: idx === l ? "pointer" : idx === r ? "pointer" : "" })));

  // Example logic: move pointers toward center and mark them
  while (l < r) {
    steps.push(arr.map((v, idx) => ({ value: v, highlight: idx === l || idx === r ? "pointer" : "" })));
    l++;
    steps.push(arr.map((v, idx) => ({ value: v, highlight: idx === l || idx === r ? "pointer" : "" })));
    r--;
  }

  steps.push(arr.map((v) => ({ value: v })));
  return steps;
}

export function binarySearchSteps(input = []) {
  const arr = input.slice();
  const steps = [];
  if (arr.length === 0) return steps;

  let l = 0;
  let r = arr.length - 1;

  // ensure sorted for visualization correctness - only for steps display (does not change backend)
  const sorted = arr.slice().sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
  // initial
  steps.push(sorted.map((v, idx) => ({ value: v, highlight: "" })));

  while (l <= r) {
    const mid = Math.floor((l + r) / 2);
    // highlight mid
    steps.push(sorted.map((v, idx) => ({ value: v, highlight: idx === mid ? "mid" : "" })));
    // for visualization we won't actually search a target (this is generic)
    // move pointers: example shrink both sides to illustrate progression
    if (mid === l) break;
    r = mid - 1;
  }

  steps.push(sorted.map((v) => ({ value: v })));
  return steps;
}
