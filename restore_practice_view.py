# Restore Practice View in dashboard.html
import os

dashboard_path = 'dashboard.html'

with open(dashboard_path, 'r', encoding='utf-8') as f:
    content = f.read()

practice_view_html = """
      <div id="practice-view" class="hidden">
        <div class="card">
          <h3>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
              style="color: var(--accent2);">
              <polyline points="16 18 22 12 16 6"></polyline>
              <polyline points="8 6 2 12 8 18"></polyline>
            </svg>
            Practice Problems
          </h3>
          <p style="color: var(--text-secondary); margin-bottom: 20px;">
            Filter by topic or search by name to find your next challenge.
          </p>
          <div class="practice-controls">
            <div class="topic-filters-container">
              <div class="topic-filters" id="topic-filters">
                <!-- Dynamically populated -->
              </div>
            </div>
            <div class="search-container">
              <input type="text" id="problem-search-input" class="search-input" placeholder="Search by name...">
            </div>
          </div>
          <div class="table-container">
            <table class="problems-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Difficulty</th>
                  <th>Acceptance</th>
                </tr>
              </thead>
              <tbody id="problems-table-body">
                <!-- Dynamically populated -->
              </tbody>
            </table>
          </div>
        </div>
      </div>
"""

if 'id="practice-view"' not in content:
    # Insert before contests-view
    if 'id="contests-view"' in content:
        content = content.replace('<div id="contests-view"', practice_view_html + '\n\n      <div id="contests-view"')
        with open(dashboard_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print("Restored practice-view in dashboard.html")
    else:
        print("Could not find contests-view to insert before")
else:
    print("practice-view already exists")
