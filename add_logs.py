import re

path = 'static/js/main.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add logs to click handler
if "problemsTableBody.addEventListener('click', (e) => {" in content:
    content = content.replace(
        "problemsTableBody.addEventListener('click', (e) => {",
        "problemsTableBody.addEventListener('click', (e) => {\n      console.log('Table clicked', e.target);"
    )

if "const title = row.cells[0].textContent;" in content:
    content = content.replace(
        "const title = row.cells[0].textContent;",
        "const title = row.cells[0].textContent;\n        console.log('Row clicked, title:', title);"
    )

# Add logs to openCodeEditor
if "function openCodeEditor(problemTitle) {" in content:
    content = content.replace(
        "function openCodeEditor(problemTitle) {",
        "function openCodeEditor(problemTitle) {\n    console.log('openCodeEditor called with:', problemTitle);"
    )

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Added console logs to main.js")
