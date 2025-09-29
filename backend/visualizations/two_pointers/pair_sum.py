import random

def visualize(arr=None, target=10):
    # Base array if none provided
    arr = arr if arr else [1, 2, 3, 4, 5, 6]
    steps = []

    steps.append({
        "array": arr.copy(),
        "active_indices": [],
        "description": "Initial array",
        "code_line": 5
    })

    arr.sort()
    steps.append({
        "array": arr.copy(),
        "active_indices": [],
        "description": "Sort the array",
        "code_line": 10
    })

    left, right = 0, len(arr)-1
    while left < right:
        steps.append({
            "array": arr.copy(),
            "active_indices": [left, right],
            "description": f"Check sum of arr[{left}] + arr[{right}]",
            "code_line": 16
        })
        curr_sum = arr[left] + arr[right]
        if curr_sum == target:
            steps.append({
                "array": arr.copy(),
                "active_indices": [left, right],
                "description": f"Found pair ({arr[left]}, {arr[right]})",
                "code_line": 20
            })
            return steps
        elif curr_sum < target:
            left += 1
        else:
            right -= 1

    steps.append({
        "array": arr.copy(),
        "active_indices": [],
        "description": "No pair found",
        "code_line": None
    })
    return steps
