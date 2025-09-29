import random

def visualize(arr=None):
    arr = arr if arr else [random.randint(1, 20) for _ in range(6)]
    steps = []

    def merge_sort_rec(a, l=0):
        if len(a) > 1:
            mid = len(a) // 2
            L = a[:mid]
            R = a[mid:]

            merge_sort_rec(L, l)
            merge_sort_rec(R, l+mid)

            i = j = k = 0
            while i < len(L) and j < len(R):
                steps.append({
                    "array": a.copy(),
                    "active_indices": [k],
                    "description": f"Compare {L[i]} and {R[j]}",
                    "code_line": 14
                })
                if L[i] < R[j]:
                    a[k] = L[i]
                    i += 1
                else:
                    a[k] = R[j]
                    j += 1
                steps.append({
                    "array": a.copy(),
                    "active_indices": [k],
                    "description": f"Place {a[k]} at position {k}",
                    "code_line": 21
                })
                k += 1
            while i < len(L):
                a[k] = L[i]
                steps.append({
                    "array": a.copy(),
                    "active_indices": [k],
                    "description": f"Place remaining {L[i]} at position {k}",
                    "code_line": 25
                })
                i += 1
                k += 1
            while j < len(R):
                a[k] = R[j]
                steps.append({
                    "array": a.copy(),
                    "active_indices": [k],
                    "description": f"Place remaining {R[j]} at position {k}",
                    "code_line": 30
                })
                j += 1
                k += 1

    merge_sort_rec(arr)
    steps.append({
        "array": arr.copy(),
        "active_indices": [],
        "description": "Array sorted",
        "code_line": None
    })
    return steps
