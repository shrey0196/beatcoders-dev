
source_path = r'c:\Users\shrey\PycharmProjects\BeatCoders\dashboard.html'
temp_path = r'c:\Users\shrey\PycharmProjects\BeatCoders\dashboard_clean.html'

with open(source_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Ranges to remove (inclusive indices 0-based from valid lines)
# range(916, 2710) -> indices 916 to 2709
# range(2832, 3215) -> indices 2832 to 3214

# We will collect lines that are NOT in these ranges.
new_lines = []
for i, line in enumerate(lines):
    # Check if index i is in any removal range
    if 916 <= i <= 2709:
        continue
    if 2832 <= i <= 3214:
        continue
    new_lines.append(line)

with open(temp_path, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print("Cleaned HTML written to dashboard_clean.html")
