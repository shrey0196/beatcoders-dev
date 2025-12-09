"""
Complexity Analyzer
Analyzes code for time and space complexity using AST parsing and pattern detection
"""
import ast
from typing import Dict, List, Any
from dataclasses import dataclass

@dataclass
class ComplexityAnalysis:
    time_complexity: str
    space_complexity: str
    patterns: List[str]
    nested_loop_depth: int
    recursive_calls: int
    data_structures_created: List[str]
    confidence: float  # 0.0 to 1.0

class ComplexityAnalyzer:
    """Analyzes code complexity using AST parsing"""
    
    def __init__(self):
        self.patterns = {
            'nested_loops': 0,
            'recursive_calls': 0,
            'hash_maps': 0,
            'arrays': 0,
            'sorting': False,
            'binary_search': False
        }
    
    def analyze(self, code: str, language: str) -> ComplexityAnalysis:
        """
        Main analysis method
        """
        if language == 'python':
            return self._analyze_python(code)
        elif language == 'javascript':
            return self._analyze_javascript(code)
        else:
            # Fallback for unsupported languages
            return ComplexityAnalysis(
                time_complexity="Unknown",
                space_complexity="Unknown",
                patterns=[],
                nested_loop_depth=0,
                recursive_calls=0,
                data_structures_created=[],
                confidence=0.0
            )
    
    def _analyze_python(self, code: str) -> ComplexityAnalysis:
        """Analyze Python code using AST"""
        try:
            tree = ast.parse(code)
            
            # Analyze AST
            nested_depth = self._find_nested_loops(tree)
            recursive_count = self._find_recursive_calls(tree)
            data_structures = self._find_data_structures(tree)
            
            # Estimate complexity
            time_complexity = self._estimate_time_complexity(nested_depth, recursive_count)
            space_complexity = self._estimate_space_complexity(data_structures)
            
            # Detect patterns
            patterns = self._detect_patterns(tree, nested_depth, data_structures)
            
            return ComplexityAnalysis(
                time_complexity=time_complexity,
                space_complexity=space_complexity,
                patterns=patterns,
                nested_loop_depth=nested_depth,
                recursive_calls=recursive_count,
                data_structures_created=data_structures,
                confidence=0.8  # High confidence for AST-based analysis
            )
        
        except SyntaxError as e:
            raise ValueError(f"Invalid Python syntax: {e}")
    
    def _find_nested_loops(self, tree: ast.AST) -> int:
        """Find maximum nesting depth of loops"""
        max_depth = 0
        
        class LoopVisitor(ast.NodeVisitor):
            def __init__(self):
                self.current_depth = 0
                self.max_depth = 0
            
            def visit_For(self, node):
                self.current_depth += 1
                self.max_depth = max(self.max_depth, self.current_depth)
                self.generic_visit(node)
                self.current_depth -= 1
            
            def visit_While(self, node):
                self.current_depth += 1
                self.max_depth = max(self.max_depth, self.current_depth)
                self.generic_visit(node)
                self.current_depth -= 1
        
        visitor = LoopVisitor()
        visitor.visit(tree)
        return visitor.max_depth
    
    def _find_recursive_calls(self, tree: ast.AST) -> int:
        """Count recursive function calls"""
        # Simplified: just count function definitions for now
        count = 0
        for node in ast.walk(tree):
            if isinstance(node, ast.FunctionDef):
                count += 1
        return count
    
    def _find_data_structures(self, tree: ast.AST) -> List[str]:
        """Identify data structures being created"""
        structures = []
        for node in ast.walk(tree):
            if isinstance(node, ast.List):
                structures.append('list')
            elif isinstance(node, ast.Dict):
                structures.append('dict')
            elif isinstance(node, ast.Set):
                structures.append('set')
        return structures
    
    def _estimate_time_complexity(self, nested_depth: int, recursive_count: int) -> str:
        """Estimate time complexity based on patterns"""
        if nested_depth == 0 and recursive_count == 0:
            return "O(1)"
        elif nested_depth == 1:
            return "O(n)"
        elif nested_depth == 2:
            return "O(n²)"
        elif nested_depth == 3:
            return "O(n³)"
        elif recursive_count > 0:
            return "O(2^n)"  # Simplified assumption
        else:
            return "O(n)"
    
    def _estimate_space_complexity(self, data_structures: List[str]) -> str:
        """Estimate space complexity based on data structures"""
        if not data_structures:
            return "O(1)"
        elif len(data_structures) == 1:
            return "O(n)"
        else:
            return "O(n)"  # Simplified
    
    def _detect_patterns(self, tree: ast.AST, nested_depth: int, data_structures: List[str]) -> List[str]:
        """Detect common algorithmic patterns"""
        patterns = []
        
        if nested_depth == 1:
            patterns.append("single_pass")
        elif nested_depth == 2:
            patterns.append("nested_iteration")
        
        if 'dict' in data_structures:
            patterns.append("hash_map_usage")
        
        if not data_structures:
            patterns.append("constant_space")
        
        return patterns
    
    def _analyze_javascript(self, code: str) -> ComplexityAnalysis:
        """Analyze JavaScript code (simplified pattern matching)"""
        # TODO: Implement proper JavaScript AST parsing using a JS parser
        # For now, use simple pattern matching
        
        nested_depth = code.count('for') + code.count('while')
        has_recursion = 'function' in code and code.count('(') > 2
        
        return ComplexityAnalysis(
            time_complexity="O(n)" if nested_depth == 1 else "O(n²)",
            space_complexity="O(1)",
            patterns=["pattern_matching_based"],
            nested_loop_depth=nested_depth,
            recursive_calls=1 if has_recursion else 0,
            data_structures_created=[],
            confidence=0.5  # Lower confidence for pattern matching
        )
