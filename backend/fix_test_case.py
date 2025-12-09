# Fix the test case
with open('test_cases/problems.py', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Find and replace line 27
for i, line in enumerate(lines):
    if i == 26:  # Line 27 (0-indexed)
        lines[i] = '                "input": {"nums": [1, 5, 3, 7, 9], "target": 12},\r\n'

with open('test_cases/problems.py', 'w', encoding='utf-8') as f:
    f.writelines(lines)

print("Fixed test case - changed target from 10 to 12")
