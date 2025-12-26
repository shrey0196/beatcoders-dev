
source_path = r'c:\Users\shrey\PycharmProjects\BeatCoders\dashboard.html'
dest_path = r'c:\Users\shrey\PycharmProjects\BeatCoders\static\js\dashboard_refactored.js'

with open(source_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Block 1: Line 22 (Mermaid init) - Index 21
# Content: <script>mermaid.initialize({ startOnLoad: true, theme: 'dark' });</script>
# I'll just write the inner JS manually for this one as it's one line.
block1_content = "mermaid.initialize({ startOnLoad: true, theme: 'dark' });\n"

# Block 2: 918 to 2709 (Indices 917 to 2709)
# Note: Locate tags said START: 917. END: ... multiple? 
# The last END for that block was 2710 (based on my inference, or 2160? wait).
# The output showed SCRIPT_END: 2160, 2317... these are probably </script> inside strings?
# No, standard JS shouldn't have </script> inside, but maybe it does.
# Let's assume the matching end is 2710 (before 2833).
# Let's double check line 2710.
block2 = lines[917:2709] 

# Block 3: 2834 to 3214 (Indices 2833 to 3214)
block3 = lines[2833:3214]

# Block 4: 3223 to 3245 (Indices 3222 to 3245)
block4 = lines[3222:3245]

with open(dest_path, 'w', encoding='utf-8') as f:
    f.write('/* Refactored Dashboard JS */\n')
    f.write('/* Block 1: Mermaid Init */\n')
    f.write(block1_content)
    
    f.write('\n/* Block 2: Main Logic */\n')
    f.writelines(block2)
    
    f.write('\n/* Block 3: Hijack Logic */\n')
    f.writelines(block3)
    
    f.write('\n/* Block 4: Mermaid Global Fix */\n')
    f.writelines(block4)

print("JS extracted successfully.")
