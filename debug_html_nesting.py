from html.parser import HTMLParser

class NestingValidator(HTMLParser):
    def __init__(self):
        super().__init__()
        self.stack = []
        self.layout_depth = None
        self.aside_depth = None
        self.main_depth = None
        self.found_layout = False

    def handle_starttag(self, tag, attrs):
        attrs_dict = dict(attrs)
        classes = attrs_dict.get('class', '').split()
        
        if 'layout' in classes:
            self.layout_depth = len(self.stack)
            self.found_layout = True
            print(f"DEBUG: Found .layout at depth {self.layout_depth} (Line {self.getpos()[0]})")
            
        if tag == 'aside':
            if self.layout_depth is not None and len(self.stack) == self.layout_depth + 1:
                 self.aside_depth = len(self.stack)
                 print(f"DEBUG: Found <aside> as direct child of .layout at depth {self.aside_depth} (Line {self.getpos()[0]})")
            else:
                 print(f"WARNING: Found <aside> at depth {len(self.stack)} but .layout is at {self.layout_depth} (Line {self.getpos()[0]})")

        if tag == 'main':
            if self.layout_depth is not None and len(self.stack) == self.layout_depth + 1:
                 self.main_depth = len(self.stack)
                 print(f"DEBUG: Found <main> as direct child of .layout at depth {self.main_depth} (Line {self.getpos()[0]})")
            else:
                 print(f"WARNING: Found <main> at depth {len(self.stack)} but .layout is at {self.layout_depth} (Line {self.getpos()[0]})")

        self.stack.append((tag, self.getpos()[0]))

    def handle_endtag(self, tag):
        if not self.stack:
            print(f"ERROR: Extra closing tag </{tag}> at line {self.getpos()[0]}")
            return

        last_tag, start_line = self.stack.pop()
        
        # Simple check: we barely care about non-div mismatches for this specific layout bug, 
        # but self-closing tags might cause noise if not handled. 
        # HTMLParser handles void elements automatically mostly but let's see.
        
        if tag == 'div' and self.layout_depth is not None:
            if len(self.stack) == self.layout_depth:
                print(f"DEBUG: Closing .layout div at line {self.getpos()[0]}")
                self.layout_depth = None # Layout closed

parser = NestingValidator()

with open(r'c:\Users\shrey\PycharmProjects\BeatCoders\dashboard.html', 'r', encoding='utf-8') as f:
    content = f.read()
    parser.feed(content)
