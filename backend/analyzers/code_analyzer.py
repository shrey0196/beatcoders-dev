"""
Code Analyzer - Extracts structure from code for visualization
Parses Python code using AST to generate flowcharts and variable analysis
"""

import ast
from typing import Dict, List, Any


class CodeAnalyzer:
    """Analyzes Python code structure for visualization purposes"""

    def __init__(self):
        self.variables = []
        self.control_flow = []

    def analyze(self, code: str) -> Dict[str, Any]:
        """
        Main analysis function
        Returns structure suitable for visualization
        """
        try:
            tree = ast.parse(code)
            return {
                "success": True,
                "mermaid_diagram": self.generate_mermaid_diagram(code),
                "variables": self.extract_variables(code),
                "complexity": self.calculate_complexity(tree)
            }
        except SyntaxError as e:
            return {
                "success": False,
                "error": f"Syntax error: {str(e)}",
                "mermaid_diagram": None,
                "variables": [],
                "complexity": 0
            }

    def generate_mermaid_diagram(self, code: str) -> str:
        """
        Generate Mermaid flowchart from Python code
        Focuses on control flow (if/else, loops, function calls)
        """
        try:
            tree = ast.parse(code)
            diagram_lines = ["flowchart TD"]
            node_counter = [0]  # Use list to allow modification in nested function

            def get_node_id():
                node_counter[0] += 1
                return f"N{node_counter[0]}"

            def process_node(node, parent_id=None):
                """Recursively process AST nodes"""
                
                if isinstance(node, ast.FunctionDef):
                    func_id = get_node_id()
                    diagram_lines.append(f'    {func_id}["{node.name}()"]')
                    if parent_id:
                        diagram_lines.append(f"    {parent_id} --> {func_id}")
                    
                    # Process function body
                    last_id = func_id
                    for stmt in node.body:
                        last_id = process_node(stmt, last_id)
                    return last_id

                elif isinstance(node, ast.If):
                    if_id = get_node_id()
                    # Get condition text
                    condition = ast.unparse(node.test) if hasattr(ast, 'unparse') else "condition"
                    diagram_lines.append(f'    {if_id}{{{condition}?}}')
                    if parent_id:
                        diagram_lines.append(f"    {parent_id} --> {if_id}")
                    
                    # True branch
                    true_id = get_node_id()
                    diagram_lines.append(f'    {true_id}["True branch"]')
                    diagram_lines.append(f"    {if_id} -->|Yes| {true_id}")
                    for stmt in node.body:
                        true_id = process_node(stmt, true_id)
                    
                    # False branch
                    if node.orelse:
                        false_id = get_node_id()
                        diagram_lines.append(f'    {false_id}["False branch"]')
                        diagram_lines.append(f"    {if_id} -->|No| {false_id}")
                        for stmt in node.orelse:
                            false_id = process_node(stmt, false_id)
                    
                    return if_id

                elif isinstance(node, ast.For):
                    loop_id = get_node_id()
                    target = ast.unparse(node.target) if hasattr(ast, 'unparse') else "item"
                    iter_val = ast.unparse(node.iter) if hasattr(ast, 'unparse') else "iterable"
                    diagram_lines.append(f'    {loop_id}[["for {target} in {iter_val}"]]')
                    if parent_id:
                        diagram_lines.append(f"    {parent_id} --> {loop_id}")
                    
                    # Loop body
                    body_id = loop_id
                    for stmt in node.body:
                        body_id = process_node(stmt, body_id)
                    
                    # Loop back
                    diagram_lines.append(f"    {body_id} --> {loop_id}")
                    return loop_id

                elif isinstance(node, ast.While):
                    while_id = get_node_id()
                    condition = ast.unparse(node.test) if hasattr(ast, 'unparse') else "condition"
                    diagram_lines.append(f'    {while_id}{{{condition}?}}')
                    if parent_id:
                        diagram_lines.append(f"    {parent_id} --> {while_id}")
                    
                    # Loop body
                    body_id = get_node_id()
                    diagram_lines.append(f'    {body_id}["Loop body"]')
                    diagram_lines.append(f"    {while_id} -->|True| {body_id}")
                    for stmt in node.body:
                        body_id = process_node(stmt, body_id)
                    diagram_lines.append(f"    {body_id} --> {while_id}")
                    return while_id

                elif isinstance(node, ast.Return):
                    ret_id = get_node_id()
                    value = ast.unparse(node.value) if hasattr(ast, 'unparse') and node.value else "None"
                    diagram_lines.append(f'    {ret_id}(["return {value}"])')
                    if parent_id:
                        diagram_lines.append(f"    {parent_id} --> {ret_id}")
                    return ret_id

                elif isinstance(node, ast.Assign):
                    assign_id = get_node_id()
                    targets = ", ".join([ast.unparse(t) if hasattr(ast, 'unparse') else "var" for t in node.targets])
                    value = ast.unparse(node.value) if hasattr(ast, 'unparse') else "value"
                    diagram_lines.append(f'    {assign_id}["{targets} = {value}"]')
                    if parent_id:
                        diagram_lines.append(f"    {parent_id} --> {assign_id}")
                    return assign_id

                elif isinstance(node, ast.Expr):
                    # Handle expression statements (like function calls)
                    if isinstance(node.value, ast.Call):
                        call_id = get_node_id()
                        func_name = ast.unparse(node.value.func) if hasattr(ast, 'unparse') else "function"
                        diagram_lines.append(f'    {call_id}["{func_name}()"]')
                        if parent_id:
                            diagram_lines.append(f"    {parent_id} --> {call_id}")
                        return call_id
                    return parent_id

                return parent_id

            # Start processing
            start_id = get_node_id()
            diagram_lines.append(f'    {start_id}([Start])')
            
            last_id = start_id
            for node in tree.body:
                last_id = process_node(node, last_id)
            
            # Add end node
            end_id = get_node_id()
            diagram_lines.append(f'    {end_id}([End])')
            if last_id:
                diagram_lines.append(f"    {last_id} --> {end_id}")

            return "\n".join(diagram_lines)

        except Exception as e:
            return f"flowchart TD\n    Error[\"Error generating diagram: {str(e)}\"]"

    def extract_variables(self, code: str) -> List[Dict[str, str]]:
        """
        Extract all variables from code with their types and scopes
        """
        variables = []
        try:
            tree = ast.parse(code)
            
            for node in ast.walk(tree):
                if isinstance(node, ast.Assign):
                    for target in node.targets:
                        if isinstance(target, ast.Name):
                            variables.append({
                                "name": target.id,
                                "type": "variable",
                                "scope": "local"
                            })
                elif isinstance(node, ast.FunctionDef):
                    # Function parameters
                    for arg in node.args.args:
                        variables.append({
                            "name": arg.arg,
                            "type": "parameter",
                            "scope": node.name
                        })

            # Remove duplicates
            seen = set()
            unique_vars = []
            for var in variables:
                key = (var['name'], var['scope'])
                if key not in seen:
                    seen.add(key)
                    unique_vars.append(var)

            return unique_vars

        except Exception:
            return []

    def calculate_complexity(self, tree: ast.AST) -> int:
        """
        Calculate cyclomatic complexity
        Counts decision points (if, for, while, etc.)
        """
        complexity = 1  # Base complexity
        
        for node in ast.walk(tree):
            if isinstance(node, (ast.If, ast.For, ast.While, ast.ExceptHandler)):
                complexity += 1
            elif isinstance(node, ast.BoolOp):
                # Each boolean operator adds complexity
                complexity += len(node.values) - 1

        return complexity
