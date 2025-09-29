import random

class TreeNode:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None

def visualize(root=None):
    # Base tree if none provided
    if root is None:
        root = TreeNode(4)
        root.left = TreeNode(2)
        root.right = TreeNode(6)
        root.left.left = TreeNode(1)
        root.left.right = TreeNode(3)
        root.right.left = TreeNode(5)
        root.right.right = TreeNode(7)

    steps = []
    result = []

    def inorder(node):
        if not node:
            return
        steps.append({
            "current": node.val,
            "action": "go_left",
            "description": f"Move to left of {node.val}",
            "result": result.copy(),
            "code_line": 22
        })
        inorder(node.left)
        result.append(node.val)
        steps.append({
            "current": node.val,
            "action": "visit",
            "description": f"Visit node {node.val}",
            "result": result.copy(),
            "code_line": 26
        })
        steps.append({
            "current": node.val,
            "action": "go_right",
            "description": f"Move to right of {node.val}",
            "result": result.copy(),
            "code_line": 29
        })
        inorder(node.right)

    inorder(root)
    steps.append({
        "current": None,
        "action": "done",
        "description": "Inorder traversal completed",
        "result": result.copy(),
        "code_line": None
    })
    return steps
