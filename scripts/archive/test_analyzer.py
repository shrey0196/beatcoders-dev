import sys
import os

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from backend.analyzers.code_analyzer import CodeAnalyzer

analyzer = CodeAnalyzer()
code = """
def test(n):
    if n > 0:
        return True
    return False
"""

try:
    result = analyzer.analyze(code)
    print("Success:", result['success'])
    print("Diagram:", result['mermaid_diagram'])
    print("Variables:", result['variables'])
except Exception as e:
    print("Error:", e)
