import re

# Read the main.js file
with open('static/js/main.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Read the new displayFeedback function
with open('displayFeedback_updated.js', 'r', encoding='utf-8') as f:
    new_function = f.read()

# Find and replace the displayFeedback function
# Pattern to match the entire function
pattern = r'function displayFeedback\(analysis\) \{[\s\S]*?\n  \}'

# Replace
updated_content = re.sub(pattern, new_function.strip(), content)

# Write back
with open('static/js/main.js', 'w', encoding='utf-8') as f:
    f.write(updated_content)

print("Updated main.js with new displayFeedback function")
