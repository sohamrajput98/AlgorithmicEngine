import random

def visualize(activities=None):
    # Base activities if none provided: (start, end)
    activities = activities if activities else [(1,3),(2,5),(4,6),(6,7)]
    steps = []

    # Sort activities by finish time
    steps.append({
        "array": activities.copy(),
        "active_indices": [],
        "description": "Sort activities by finish time",
        "code_line": 10
    })
    activities.sort(key=lambda x: x[1])

    n = len(activities)
    selected = []
    last_end = 0

    for i, (start, end) in enumerate(activities):
        steps.append({
            "array": activities.copy(),
            "active_indices": [i],
            "description": f"Check activity ({start}, {end})",
            "code_line": 17
        })
        if start >= last_end:
            selected.append((start, end))
            last_end = end
            steps.append({
                "array": selected.copy(),
                "active_indices": [len(selected)-1],
                "description": f"Select activity ({start}, {end})",
                "code_line": 21
            })
    steps.append({
        "array": selected.copy(),
        "active_indices": [],
        "description": "Final selected activities",
        "code_line": None
    })
    return steps
