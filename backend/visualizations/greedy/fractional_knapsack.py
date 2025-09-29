import random

def visualize(items=None, capacity=50):
    # Base items if none provided: (value, weight)
    items = items if items else [(60,10),(100,20),(120,30)]
    steps = []

    # Calculate value per weight ratio
    items = [(v, w, v/w) for v, w in items]
    steps.append({
        "array": items.copy(),
        "active_indices": [],
        "description": "Calculate value/weight ratio for each item",
        "code_line": 10
    })

    # Sort items by ratio descending
    items.sort(key=lambda x: x[2], reverse=True)
    steps.append({
        "array": items.copy(),
        "active_indices": [],
        "description": "Sort items by value/weight ratio descending",
        "code_line": 15
    })

    total_value = 0
    taken = []

    for i, (v, w, ratio) in enumerate(items):
        if capacity == 0:
            break
        steps.append({
            "array": items.copy(),
            "active_indices": [i],
            "description": f"Consider item {i} (value={v}, weight={w})",
            "code_line": 22
        })
        if w <= capacity:
            total_value += v
            capacity -= w
            taken.append((v, w))
            steps.append({
                "array": taken.copy(),
                "active_indices": [len(taken)-1],
                "description": f"Take full item {i}",
                "code_line": 27
            })
        else:
            fraction = capacity / w
            total_value += v * fraction
            taken.append((v*fraction, capacity))
            steps.append({
                "array": taken.copy(),
                "active_indices": [len(taken)-1],
                "description": f"Take fraction {fraction:.2f} of item {i}",
                "code_line": 32
            })
            capacity = 0

    steps.append({
        "array": taken.copy(),
        "active_indices": [],
        "description": f"Total value collected: {total_value}",
        "code_line": None
    })
    return steps
