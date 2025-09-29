import random

def visualize(arr=None):
    # Base array if none provided
    arr = arr if arr else [1, 2, 3, 4, 5, 6]
    steps = []

    steps.append({
        "array": arr.copy(),
        "active_indices": [],
        "description": "Initial array",
        "code_line": 5
    })

    slow, fast = 0, 1
    while fast < len(arr):
        steps.append({
            "array": arr.copy(),
            "active_indices": [slow, fast],
            "description": f"Compare arr[{slow}] and arr[{fast}]",
            "code_line": 12
        })

        if arr[slow] == arr[fast]:
            steps.append({
                "array": arr.copy(),
                "active_indices": [slow, fast],
                "description": f"Duplicate found at index {fast}",
                "code_line": 16
            })
            fast += 1
        else:
            slow += 1
            arr[slow] = arr[fast]
            steps.append({
                "array": arr.copy(),
                "active_indices": [slow],
                "description": f"Move arr[{fast}] to arr[{slow}]",
                "code_line": 22
            })
            fast += 1

    steps.append({
        "array": arr[:slow+1].copy(),
        "active_indices": [],
        "description": f"Array after removing duplicates: {arr[:slow+1]}",
        "code_line": None
    })
    return steps
