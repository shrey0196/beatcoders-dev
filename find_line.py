
with open(r'c:\Users\shrey\PycharmProjects\BeatCoders\dashboard.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()
    for i, line in enumerate(lines):
        if 'id="filter-btn"' in line or 'class="search-row"' in line:
            print(f'{i+1}: {line.strip()}')
