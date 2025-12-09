import os
import re

file_path = 'static/js/main.js'

# Enhanced analysis function
enhanced_analysis = '''
  // Helper function to analyze code quality and assign points with real insights
  function analyzeSolution(code, runtime, cognitiveData) {
    // Analyze code structure
    const codeLines = code.trim().split('\\n').length;
    const hasComments = code.includes('#') || code.includes('//');
    const hasNestedLoops = /for.*for/s.test(code) || /while.*while/s.test(code);
    const hasHashMap = code.includes('{}') || code.includes('dict') || code.includes('seen') || code.includes('hash');
    const hasOptimalStructure = hasHashMap && !hasNestedLoops;
    
    // Parse runtime (assuming format like "42ms")
    const runtimeMs = parseInt(runtime.replace('ms', ''));
    
    // Determine quality tier and insights
    let tier = 'Improvable';
    let points = 50;
    let color = '#f59e0b'; // Orange
    let timeComplexity = 'O(n²)';
    let spaceComplexity = 'O(1)';
    let insights = [];
    
    if (hasNestedLoops) {
      // Brute force approach
      tier = 'Improvable';
      points = 50;
      color = '#f59e0b';
      timeComplexity = 'O(n²)';
      spaceComplexity = 'O(1)';
      insights = [
        { icon: '⚠️', title: 'Nested Loops Detected', desc: 'Using O(n²) time complexity with nested iterations', positive: false },
        { icon: '✓', title: 'Minimal Space Usage', desc: 'No additional data structures used (O(1) space)', positive: true },
        { icon: '💡', title: 'Optimization Possible', desc: 'Consider using a hash map to achieve O(n) time complexity', positive: false }
      ];
    } else if (hasOptimalStructure && runtimeMs < 50) {
      // Optimal solution
      tier = 'Optimal';
      points = 100;
      color = '#22c55e';
      timeComplexity = 'O(n)';
      spaceComplexity = 'O(n)';
      insights = [
        { icon: '✓', title: 'Optimal Time Complexity', desc: 'Using O(n) time with hash map optimization', positive: true },
        { icon: '✓', title: 'Efficient Single Pass', desc: 'Solution completes in one iteration through the array', positive: true },
        { icon: '✓', title: 'Smart Space Trade-off', desc: 'Uses O(n) space for significant time improvement', positive: true }
      ];
    } else {
      // Good solution
      tier = 'Good';
      points = 70;
      color = '#f59e0b';
      timeComplexity = hasHashMap ? 'O(n)' : 'O(n log n)';
      spaceComplexity = hasHashMap ? 'O(n)' : 'O(1)';
      insights = [
        { icon: '✓', title: 'Decent Performance', desc: \`Achieves \${timeComplexity} time complexity\`, positive: true },
        { icon: '✓', title: 'Correct Implementation', desc: 'Solution passes all test cases successfully', positive: true },
        { icon: '💡', title: 'Minor Improvements Possible', desc: 'Small optimizations could improve runtime', positive: false }
      ];
    }
    
    return { tier, points, color, timeComplexity, spaceComplexity, insights };
  }
'''

try:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find and replace the analyzeSolution function
    pattern = r'  // Helper function to analyze code quality and assign points.*?return \{ tier, points, color \};[\s\n]*\}'
    
    content = re.sub(pattern, enhanced_analysis.strip(), content, flags=re.DOTALL)
    
    # Now update the success screen to use the new insights
    # Find the Cognitive Insights section
    old_insights = r'<!-- Cognitive Insights -->[\s\S]*?</div>[\s\S]*?</div>[\s\S]*?<!-- Points Breakdown -->'
    
    new_insights = '''<!-- Cognitive Insights -->
      <div style="margin-bottom: 30px;">
        <h3 style="color: var(--text-primary); margin-bottom: 20px; font-size: 1.2rem;">🧠 Cognitive Insights</h3>
        <div style="background: rgba(255,255,255,0.02); padding: 20px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.05);">
          ${analysis.insights.map(insight => `
            <div style="margin-bottom: 15px;">
              <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                <span style="color: ${insight.positive ? '#22c55e' : '#f59e0b'};">${insight.icon}</span>
                <span style="color: var(--text-primary); font-weight: 500;">${insight.title}</span>
              </div>
              <div style="color: var(--text-secondary); font-size: 0.9rem; padding-left: 30px;">
                ${insight.desc}
              </div>
            </div>
          `).join('')}
        </div>
        
        <!-- Complexity Analysis -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 15px;">
          <div style="background: rgba(255,255,255,0.03); padding: 15px; border-radius: 8px; text-align: center;">
            <div style="color: var(--text-secondary); font-size: 0.85rem; margin-bottom: 5px;">Time Complexity</div>
            <div style="color: ${analysis.color}; font-size: 1.3rem; font-weight: 600;">${analysis.timeComplexity}</div>
          </div>
          <div style="background: rgba(255,255,255,0.03); padding: 15px; border-radius: 8px; text-align: center;">
            <div style="color: var(--text-secondary); font-size: 0.85rem; margin-bottom: 5px;">Space Complexity</div>
            <div style="color: ${analysis.color}; font-size: 1.3rem; font-weight: 600;">${analysis.spaceComplexity}</div>
          </div>
        </div>
      </div>
      
      <!-- Points Breakdown -->'''
    
    content = re.sub(old_insights, new_insights, content, flags=re.DOTALL)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("Successfully enhanced cognitive analysis with real insights")

except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
