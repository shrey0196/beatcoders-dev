
source_path = r'c:\Users\shrey\PycharmProjects\BeatCoders\dashboard.html'
dest_path = r'c:\Users\shrey\PycharmProjects\BeatCoders\static\css\dashboard_refactored.css'

with open(source_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Extract Block 1: lines 20 to 1742 (indices 19 to 1742)
block1 = lines[19:1742]

# Extract Block 2: lines 4978 to 5023 (indices 4977 to 5023)
block2 = lines[4977:5023]

with open(dest_path, 'a', encoding='utf-8') as f:
    f.write('\n/* Extracted Block 1 */\n')
    f.writelines(block1)
    f.write('\n/* Extracted Block 2 */\n')
    f.writelines(block2)

print("CSS appended successfully.")
