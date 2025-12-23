
with open(r'c:\Users\shrey\PycharmProjects\BeatCoders\dashboard.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()
    for i, line in enumerate(lines):
        if '<script' in line.lower():
            print(f'SCRIPT_START: {i+1} : {line.strip()[:50]}')
        if '</script>' in line.lower():
            print(f'SCRIPT_END: {i+1}')
