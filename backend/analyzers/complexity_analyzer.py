import ast

class ComplexityAnalyzer:
    """
    Analyzes Python code to estimate Time and Space complexity.
    Uses AST (Abstract Syntax Tree) traversal.
    """

    def analyze(self, code: str):
        """
        Returns a dict: {'time': 'O(n)', 'space': 'O(1)', 'details': '...'}
        """
        try:
            tree = ast.parse(code)
        except SyntaxError:
            return {"time": "Unknown", "space": "Unknown", "details": "Syntax Error"}

        max_nesting = 0
        
        # Traverse for loops to find max nesting depth
        for node in ast.walk(tree):
            if isinstance(node, (ast.For, ast.While)):
                depth = self._get_loop_depth(node)
                max_nesting = max(max_nesting, depth)

        time_complexity = self._depth_to_big_o(max_nesting)
        space_complexity = "O(1)" # Default, heuristic refinement needed for arrays

        # Heuristic for space: Look for list multiplications or extensive allocations
        if self._detect_heavy_allocation(tree):
            space_complexity = "O(n)"

        return {
            "time": time_complexity,
            "space": space_complexity,
            "details": f"Detected nesting level: {max_nesting}"
        }

    def _get_loop_depth(self, node, current_depth=1):
        """Recursively calculate loop nesting depth"""
        max_depth = current_depth
        for child in ast.iter_child_nodes(node):
            if isinstance(child, (ast.For, ast.While)):
                max_depth = max(max_depth, self._get_loop_depth(child, current_depth + 1))
        return max_depth

    def _depth_to_big_o(self, depth):
        if depth == 0: return "O(1)"
        if depth == 1: return "O(n)"
        if depth == 2: return "O(n²)"
        if depth == 3: return "O(n³)"
        return f"O(n^{depth})"

    def _detect_heavy_allocation(self, tree):
        """Detect obvious O(n) space allocs like [0]*n or list comprehensions"""
        for node in ast.walk(tree):
            # Check for list multiplication: [x] * n
            if isinstance(node, ast.BinOp) and isinstance(node.op, ast.Mult):
                if isinstance(node.left, ast.List) or isinstance(node.right, ast.List):
                    return True
            # Check for list comprehension
            if isinstance(node, ast.ListComp):
                return True
        return False
