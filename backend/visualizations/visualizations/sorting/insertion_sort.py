import random

def visualize(arr=None):
    arr = arr if arr else [random.randint(1, 20) for _ in range(6)]
    steps = []

    for i in range(1, len(arr)):
        key = arr[i]
        j = i-1
        steps.append({
            "array": arr.copy(),
            "active_indices": [i],
            "description": f"Pick key {key} at index {i}",
            "code_line": 8
        })
        while j >= 0 and arr[j] > key:
            arr[j+1] = arr[j]
            steps.append({
                "array": arr.copy(),
                "active_indices": [j, j+1],
                "description": f"Shift {arr[j]} to the right",
                "code_line": 12
            })
            j -= 1
        arr[j+1] = key
        steps.append({
            "array": arr.copy(),
            "active_indices": [j+1],
            "description": f"Insert key {key} at position {j+1}",
            "code_line": 15
        })
    steps.append({
        "array": arr.copy(),
        "active_indices": [],
        "description": "Array sorted",
        "code_line": None
    })
    return steps
