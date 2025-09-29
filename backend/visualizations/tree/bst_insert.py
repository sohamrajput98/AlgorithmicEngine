import random

class TreeNode:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None

def visualize(values=None):
    # Base array if none provided
    values = values if values else [4, 2, 6, 1, 3, 5, 7]
    steps = []
    root = None

    for idx, val in enumerate(values):
        steps.append({
            "value_to_insert": val,
            "description": f"Inserting {val} into BST",
            "root_snapshot": root.val if root else None,
            "code_line": 17
        })

        if root is None:
            root = TreeNode(val)
            steps.append({
                "value_to_insert": val,
                "description": f"Inserted {val} as root",
                "root_snapshot": root.val,
                "code_line": 22
            })
            continue

        current = root
        while True:
            steps.append({
                "value_to_insert": val,
                "description": f"Compare {val} with {current.val}",
                "current_node": current.val,
                "code_line": 29
            })
            if val < current.val:
                if current.left is None:
                    current.left = TreeNode(val)
                    steps.append({
                        "value_to_insert": val,
                        "description": f"Inserted {val} to left of {current.val}",
                        "current_node": current.val,
                        "code_line": 34
                    })
                    break
                else:
                    current = current.left
            else:
                if current.right is None:
                    current.right = TreeNode(val)
                    steps.append({
                        "value_to_insert": val,
                        "description": f"Inserted {val} to right of {current.val}",
                        "current_node": current.val,
                        "code_line": 41
                    })
                    break
                else:
                    current = current.right

    steps.append({
        "description": "BST insertion completed",
        "root_snapshot": root.val if root else None,
        "code_line": None
    })
    return steps
