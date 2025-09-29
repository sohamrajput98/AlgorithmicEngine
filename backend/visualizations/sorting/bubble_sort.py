import random

def visualize(arr=None):
    arr = arr if arr else [random.randint(1, 20) for _ in range(6)]
    steps = []
    n = len(arr)

    for i in range(n):
        for j in range(0, n-i-1):
            steps.append({
                "array": arr.copy(),
                "active_indices": [j, j+1],
                "description": f"Compare {arr[j]} and {arr[j+1]}",
                "code_line": 10
            })
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]
                steps.append({
                    "array": arr.copy(),
                    "active_indices": [j, j+1],
                    "description": f"Swap {arr[j]} and {arr[j+1]}",
                    "code_line": 12
                })
    steps.append({
        "array": arr.copy(),
        "active_indices": [],
        "description": "Array sorted",
        "code_line": None
    })
    return steps
