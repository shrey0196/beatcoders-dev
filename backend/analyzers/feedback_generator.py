"""
Feedback Generator
Generates tiered feedback based on complexity analysis results
Enhanced with positive framing and edge case handling
"""
from typing import Dict, List, Optional
from dataclasses import dataclass
from analyzers.complexity_analyzer import ComplexityAnalysis

@dataclass
class Feedback:
    tier: str  # 'optimal', 'good', 'improvable', 'alternative'
    color: str
    icon: str
    title: str
    message: str
    hints: List[str]
    resources: List[Dict[str, str]]
    show_celebration: bool = False
    alternative_approaches: List[Dict[str, str]] = None
    confidence_level: str = "high"  # 'high', 'medium', 'low'

class FeedbackGenerator:
    """Generates user-friendly feedback based on analysis"""
    
    FEEDBACK_TIERS = {
        'optimal': {
            'color': 'green',
            'icon': '🎉',
            'title': 'Excellent Work!'
        },
        'good': {
            'color': 'yellow',
            'icon': '⚡',
            'title': 'Great Job! Here\'s How to Level Up'
        },
        'improvable': {
            'color': 'orange',
            'icon': '💡',
            'title': 'Nice Solution! Want to Optimize Further?'
        },
        'alternative': {
            'color': 'blue',
            'icon': '🔄',
            'title': 'Perfect! Check Out This Alternative'
        },
        'uncertain': {
            'color': 'blue',
            'icon': '🤔',
            'title': 'Interesting Approach!'
        }
    }
    
    # Problem benchmarks with MULTIPLE optimal solutions
    PROBLEM_BENCHMARKS = {
        'two-sum': {
            'optimal_solutions': [
                {
                    'time': 'O(n)',
                    'space': 'O(n)',
                    'approach': 'Hash Map',
                    'tradeoffs': 'Uses extra space for O(1) lookups'
                },
                {
                    'time': 'O(n log n)',
                    'space': 'O(1)',
                    'approach': 'Two Pointers (sorted)',
                    'tradeoffs': 'Requires sorting but uses constant space'
                }
            ],
            'hints': {
                'O(n²)': {
                    'message': 'Think about how you can avoid checking every pair',
                    'concept': 'hash_maps',
                    'positive_frame': 'You\'ve got the logic right! Now let\'s make it faster.'
                }
            }
        },
        'default': {
            'optimal_solutions': [
                {
                    'time': 'O(n)',
                    'space': 'O(1)',
                    'approach': 'Single Pass',
                    'tradeoffs': 'Most efficient for time and space'
                }
            ],
            'hints': {}
        }
    }
    
    def generate_feedback(self, analysis: ComplexityAnalysis, problem_id: str, 
                         user_tier: str = 'free') -> Feedback:
        """
        Generate feedback based on analysis and problem benchmarks
        
        Args:
            analysis: Code complexity analysis results
            problem_id: Problem identifier
            user_tier: 'free' or 'premium' for hint access
        """
        
        # Get problem benchmark
        benchmark = self.PROBLEM_BENCHMARKS.get(problem_id, self.PROBLEM_BENCHMARKS['default'])
        
        # Check if solution matches any optimal approach
        optimal_match = self._find_optimal_match(analysis, benchmark)
        
        # Determine tier based on confidence and optimality
        if analysis.confidence < 0.6:
            # Conservative approach for uncertain cases
            tier = 'uncertain'
        elif optimal_match:
            tier = 'optimal'
        else:
            tier = self._determine_tier(analysis, benchmark)
        
        tier_info = self.FEEDBACK_TIERS[tier]
        
        # Generate positive, encouraging message
        message = self._generate_positive_message(tier, analysis, benchmark, optimal_match)
        
        # Generate hints (premium users get more detailed hints)
        hints = self._generate_hints(tier, analysis, benchmark, user_tier)
        
        # Get educational resources
        resources = self._get_resources(analysis, tier)
        
        # Get alternative approaches if optimal
        alternatives = self._get_alternatives(optimal_match, benchmark) if tier == 'optimal' else None
        
        return Feedback(
            tier=tier,
            color=tier_info['color'],
            icon=tier_info['icon'],
            title=tier_info['title'],
            message=message,
            hints=hints,
            resources=resources,
            show_celebration=(tier == 'optimal'),
            alternative_approaches=alternatives,
            confidence_level='high' if analysis.confidence >= 0.8 else 'medium' if analysis.confidence >= 0.6 else 'low'
        )
    
    def _find_optimal_match(self, analysis: ComplexityAnalysis, 
                           benchmark: Dict) -> Optional[Dict]:
        """Check if solution matches any optimal approach"""
        for solution in benchmark['optimal_solutions']:
            if (analysis.time_complexity == solution['time'] and 
                analysis.space_complexity == solution['space']):
                return solution
        return None
    
    def _determine_tier(self, analysis: ComplexityAnalysis, benchmark: Dict) -> str:
        """Determine feedback tier based on complexity comparison"""
        
        # Get the best optimal solution for comparison
        best_time = min(benchmark['optimal_solutions'], 
                       key=lambda x: self._complexity_rank(x['time']))['time']
        
        # Check if there's significant room for improvement
        if self._is_significantly_worse(analysis.time_complexity, best_time):
            return 'improvable'
        
        # Check if close to optimal
        if self._is_close_to_optimal(analysis.time_complexity, best_time):
            return 'good'
        
        # Default to good (positive framing)
        return 'good'
    
    def _complexity_rank(self, complexity: str) -> int:
        """Rank complexity for comparison"""
        order = ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)', 'O(n²)', 'O(n³)', 'O(2^n)']
        try:
            return order.index(complexity)
        except ValueError:
            return 999  # Unknown complexity
    
    def _is_significantly_worse(self, actual: str, optimal: str) -> bool:
        """Check if actual complexity is significantly worse (2+ levels)"""
        return self._complexity_rank(actual) - self._complexity_rank(optimal) >= 2
    
    def _is_close_to_optimal(self, actual: str, optimal: str) -> bool:
        """Check if within 1 level of optimal"""
        return abs(self._complexity_rank(actual) - self._complexity_rank(optimal)) <= 1
    
    def _generate_positive_message(self, tier: str, analysis: ComplexityAnalysis, 
                                   benchmark: Dict, optimal_match: Optional[Dict]) -> str:
        """Generate positive, encouraging feedback message"""
        
        if tier == 'optimal':
            if optimal_match:
                return (f"🎉 Excellent work! Your solution is optimal using the "
                       f"{optimal_match['approach']} approach with {analysis.time_complexity} "
                       f"time and {analysis.space_complexity} space complexity.")
            else:
                return "🎉 Great job! Your solution is optimal for this problem!"
        
        elif tier == 'good':
            best_solution = min(benchmark['optimal_solutions'], 
                              key=lambda x: self._complexity_rank(x['time']))
            return (f"✨ Great job solving this! Your solution works with "
                   f"{analysis.time_complexity} time complexity. "
                   f"Want to level up your skills? The optimal approach achieves "
                   f"{best_solution['time']} time complexity.")
        
        elif tier == 'improvable':
            best_solution = min(benchmark['optimal_solutions'], 
                              key=lambda x: self._complexity_rank(x['time']))
            hint_info = benchmark['hints'].get(analysis.time_complexity, {})
            positive_frame = hint_info.get('positive_frame', 'You\'ve solved it correctly!')
            
            return (f"👍 {positive_frame} Your current solution uses "
                   f"{analysis.time_complexity} time complexity. "
                   f"There's a way to optimize this to {best_solution['time']}. "
                   f"Ready for the challenge?")
        
        elif tier == 'uncertain':
            return (f"🤔 Interesting approach! Your solution uses {analysis.time_complexity} "
                   f"time complexity. The complexity analysis for this type of algorithm can "
                   f"vary based on implementation details. Here are some alternative approaches "
                   f"you might find interesting.")
        
        else:
            return "Your solution is optimal! Here's an alternative approach you might find interesting."
    
    def _generate_hints(self, tier: str, analysis: ComplexityAnalysis, 
                       benchmark: Dict, user_tier: str) -> List[str]:
        """Generate contextual hints based on user subscription"""
        
        hints = []
        
        if tier == 'optimal' or tier == 'uncertain':
            return hints
        
        # Get problem-specific hints
        hint_info = benchmark['hints'].get(analysis.time_complexity, {})
        
        if user_tier == 'free':
            # Free users get generic hints
            if hint_info:
                hints.append(f"💡 Hint: {hint_info.get('message', 'Consider a different data structure')}")
            
            # Generic pattern-based hints
            if analysis.nested_loop_depth >= 2:
                hints.append("💡 Try to reduce nested loops")
            
            hints.append("🔒 Unlock detailed hints with Premium")
        
        else:  # Premium users
            # Detailed, specific hints
            if hint_info:
                hints.append(f"💡 {hint_info.get('message', '')}")
                concept = hint_info.get('concept', '')
                if concept:
                    hints.append(f"📚 Key concept: {concept.replace('_', ' ').title()}")
            
            # Pattern-specific detailed hints
            if analysis.nested_loop_depth >= 2:
                hints.append("🎯 Specific hint: Use a hash map to eliminate the inner loop")
                hints.append("Example: Store values in a dictionary for O(1) lookups")
            
            if 'dict' in analysis.data_structures_created:
                hints.append("💾 Space optimization: Consider if you can solve this in-place")
        
        return hints
    
    def _get_resources(self, analysis: ComplexityAnalysis, tier: str) -> List[Dict[str, str]]:
        """Get educational resources based on analysis"""
        
        resources = []
        
        # Add resources based on patterns and tier
        if analysis.nested_loop_depth >= 2:
            resources.append({
                'title': 'Hash Tables for Faster Lookups',
                'url': 'https://www.geeksforgeeks.org/hashing-data-structure/',
                'type': 'article',
                'duration': '5 min read'
            })
            resources.append({
                'title': 'Optimizing Nested Loops',
                'url': 'https://www.youtube.com/watch?v=v4cd1O4zkGw',
                'type': 'video',
                'duration': '12 min'
            })
        
        if tier in ['improvable', 'good']:
            resources.append({
                'title': 'Big O Notation - Complete Guide',
                'url': 'https://www.bigocheatsheet.com/',
                'type': 'reference',
                'duration': 'Quick reference'
            })
        
        return resources
    
    def _get_alternatives(self, current_optimal: Dict, 
                         benchmark: Dict) -> List[Dict[str, str]]:
        """Get alternative optimal approaches"""
        
        alternatives = []
        
        for solution in benchmark['optimal_solutions']:
            # Skip the current approach
            if solution == current_optimal:
                continue
            
            alternatives.append({
                'approach': solution['approach'],
                'time': solution['time'],
                'space': solution['space'],
                'tradeoffs': solution['tradeoffs']
            })
        
        return alternatives

