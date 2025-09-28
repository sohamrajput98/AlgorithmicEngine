// Named export - lightweight frontend "AI" matching responses.
// No external calls.

export async function getAIResponse(userQuery = "", algorithm = "") {
  const q = (userQuery || "").toLowerCase();
  const alg = (algorithm || "").toLowerCase();

  const base = {
    bubble: [
      "Bubble sort compares adjacent items and swaps if needed.",
      "Time complexity: O(n^2) worst/average, O(n) best.",
      "Use it for tiny arrays or demos."
    ],
    merge: [
      "Merge sort splits the array and merges sorted halves.",
      "Time: O(n log n). Space: O(n).",
      "Good for stable, large-data sorting."
    ],
    insertion: [
      "Insertion sort inserts elements into the sorted prefix.",
      "Time: O(n^2), best for nearly-sorted arrays.",
      "Space: O(1)."
    ],
    "two pointers": [
      "Two pointers slide indices to find pairs/ranges in O(n).",
      "Useful for sum/pair and window problems.",
      "Often requires sorted input for pair-sum."
    ],
  };

  // pick delegated domain
  let bucket = base.bubble;
  if (alg.includes("merge")) bucket = base.merge;
  else if (alg.includes("insert")) bucket = base.insertion;
  else if (alg.includes("two") || alg.includes("pointer")) bucket = base["two pointers"];

  // simple matching
  if (!q) return bucket[0];
  if (q.includes("time") || q.includes("complex")) return bucket[1];
  if (q.includes("when") || q.includes("use") || q.includes("why")) return bucket[2];

  // fallback: return closest line that includes a keyword
  for (const line of bucket) {
    for (const token of q.split(/\s+/)) {
      if (token && line.toLowerCase().includes(token)) return line;
    }
  }
  // default
  return bucket[0];
}
