/**
 * Phase 4 - CRS & Skill Growth Features
 * Frontend JavaScript module for CRS, Skill Roadmap, and AI Mentor
 */

// ============================================================================
// CRS (Cognitive Rating Score) Module
// ============================================================================

const CRSModule = {
  currentCRS: null,

  /**
   * Initialize CRS features
   */
  async init(userId) {
    if (!userId) return;

    await this.fetchCRS(userId);
    this.renderCRSBadge();
    // this.renderCRSDashboardCard(); // Removed from main view
  },

  /**
   * Fetch CRS data from API
   */
  async fetchCRS(userId) {
    try {
      const response = await fetch(`http://localhost:8001/api/crs/${userId}`);
      if (response.ok) {
        this.currentCRS = await response.json();
        return this.currentCRS;
      }
    } catch (error) {
      console.error('Error fetching CRS:', error);
    }
    return null;
  },

  /**
   * Render CRS badge in profile dropdown
   */
  renderCRSBadge() {
    if (!this.currentCRS) return;

    const dropdownMenu = document.getElementById('dropdown-menu');
    if (!dropdownMenu) return;

    // Remove existing if any
    const existingBtn = document.getElementById('crs-dropdown-item');
    if (existingBtn) existingBtn.remove();

    // Create dropdown item
    const crsBtn = document.createElement('button');
    crsBtn.className = 'dropdown-item';
    crsBtn.id = 'crs-dropdown-item';
    crsBtn.onclick = () => this.showCRSModal();

    crsBtn.innerHTML = `
      <span class="crs-tier-icon">${this.getTierIcon(this.currentCRS.tier)}</span>
      <span>CRS Score: ${Math.round(this.currentCRS.score)}</span>
    `;

    // Insert after Profile button (index 0 is profile usually)
    const profileBtn = document.getElementById('profile-btn');
    if (profileBtn && profileBtn.nextSibling) {
      dropdownMenu.insertBefore(crsBtn, profileBtn.nextSibling);
    } else {
      dropdownMenu.insertBefore(crsBtn, dropdownMenu.firstChild);
    }
  },

  /**
   * Show CRS Modal
   */
  showCRSModal() {
    if (!this.currentCRS) return;

    // Create Modal Overlay
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'crs-modal-overlay';
    modalOverlay.onclick = (e) => {
      if (e.target === modalOverlay) modalOverlay.remove();
    };

    // Create Modal Content
    const modalContent = document.createElement('div');
    modalContent.className = 'crs-modal-content';

    modalContent.innerHTML = `
      <button class="crs-modal-close" onclick="this.closest('.crs-modal-overlay').remove()">×</button>
      <div class="card crs-card" style="background: none; border: none; padding: 0;">
        <h3>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
          </svg>
          Cognitive Rating Score (CRS)
        </h3>
        
        <div class="crs-overview">
          <div class="crs-main-score">
            <div class="crs-score-display crs-tier-${this.currentCRS.tier}">
              ${Math.round(this.currentCRS.score)}
            </div>
            <div class="crs-tier-badge crs-tier-${this.currentCRS.tier}">
              ${this.getTierIcon(this.currentCRS.tier)} ${this.currentCRS.tier.toUpperCase()}
            </div>
          </div>
          
          <div class="crs-components">
            <div class="crs-component">
              <span class="component-label">Speed</span>
              <div class="component-bar">
                <div class="component-fill" style="width: ${(this.currentCRS.components.speed / 1000) * 100}%"></div>
              </div>
              <span class="component-value">${Math.round(this.currentCRS.components.speed)}</span>
            </div>
            <div class="crs-component">
              <span class="component-label">Accuracy</span>
              <div class="component-bar">
                <div class="component-fill" style="width: ${(this.currentCRS.components.accuracy / 1000) * 100}%"></div>
              </div>
              <span class="component-value">${Math.round(this.currentCRS.components.accuracy)}</span>
            </div>
            <div class="crs-component">
              <span class="component-label">Problem Solving</span>
              <div class="component-bar">
                <div class="component-fill" style="width: ${(this.currentCRS.components.problem_solving / 1000) * 100}%"></div>
              </div>
              <span class="component-value">${Math.round(this.currentCRS.components.problem_solving)}</span>
            </div>
            <div class="crs-component">
              <span class="component-label">Consistency</span>
              <div class="component-bar">
                <div class="component-fill" style="width: ${(this.currentCRS.components.consistency / 1000) * 100}%"></div>
              </div>
              <span class="component-value">${Math.round(this.currentCRS.components.consistency)}</span>
            </div>
          </div>
        </div>
        
        <div class="crs-graph-container">
          <canvas id="crsGrowthChart"></canvas>
        </div>
        
        <div class="crs-insights">
          <h4>Insights</h4>
          <ul class="insights-list">
            ${this.currentCRS.insights.map(insight => `<li>${insight}</li>`).join('')}
          </ul>
        </div>
      </div>
    `;

    modalOverlay.appendChild(modalContent);
    document.body.appendChild(modalOverlay);

    // Render growth chart (needs short timeout to ensure canvas is in DOM)
    setTimeout(() => this.renderGrowthChart(), 50);
  },

  /**
   * Render CRS growth chart using Chart.js
   */
  async renderGrowthChart() {
    const userId = this.getUserId();
    if (!userId) return;

    try {
      const response = await fetch(`http://localhost:8001/api/crs/${userId}/history`);
      if (!response.ok) return;

      const data = await response.json();
      const history = data.history || [];

      if (history.length === 0) {
        document.getElementById('crsGrowthChart').parentElement.innerHTML =
          '<p style="text-align: center; color: var(--text-secondary); padding: 20px;">Solve more problems to see your growth!</p>';
        return;
      }

      // Prepare chart data
      const labels = history.map(h => new Date(h.timestamp).toLocaleDateString());
      const scores = history.map(h => h.score);

      const ctx = document.getElementById('crsGrowthChart');
      if (!ctx) return;

      new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'CRS Score',
            data: scores,
            borderColor: 'rgb(78, 168, 255)',
            backgroundColor: 'rgba(78, 168, 255, 0.1)',
            tension: 0.4,
            fill: true
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 1000,
              grid: {
                color: 'rgba(255, 255, 255, 0.05)'
              },
              ticks: {
                color: 'var(--text-secondary)'
              }
            },
            x: {
              grid: {
                color: 'rgba(255, 255, 255, 0.05)'
              },
              ticks: {
                color: 'var(--text-secondary)'
              }
            }
          }
        }
      });
    } catch (error) {
      console.error('Error rendering growth chart:', error);
    }
  },

  /**
   * Recalculate CRS after problem submission
   */
  async recalculateCRS(userId, submissionData = null) {
    try {
      const body = { user_id: userId };
      if (submissionData) {
        body.submission_data = [submissionData];
      }

      const response = await fetch('http://localhost:8001/api/crs/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('CRS updated:', result);
        // Refresh CRS display
        await this.fetchCRS(userId);
        this.renderCRSBadge();
      }
    } catch (error) {
      console.error('Error recalculating CRS:', error);
    }
  },

  /**
   * Get tier icon
   */
  getTierIcon(tier) {
    const icons = {
      bronze: '🥉',
      silver: '🥈',
      gold: '🥇',
      platinum: '💎'
    };
    return icons[tier] || '⭐';
  },

  /**
   * Get user ID from session
   */
  getUserId() {
    // Try to get from global variable or storage
    return window.currentUserId || localStorage.getItem('beatCodersUserID') || sessionStorage.getItem('userId') || localStorage.getItem('userId');
  }
};

// ============================================================================
// Skill Roadmap Module (Premium Feature)
// ============================================================================

const RoadmapModule = {
  roadmap: null,
  isPremium: false,

  /**
   * Initialize roadmap features
   */
  async init(userId, isPremium) {
    this.isPremium = isPremium;

    if (!userId) return;

    if (isPremium) {
      await this.fetchRoadmap(userId);
      this.renderRoadmapCard();
    } else {
      this.renderPremiumTeaser();
    }
  },

  /**
   * Fetch roadmap from API
   */
  async fetchRoadmap(userId) {
    try {
      const response = await fetch(`http://localhost:8001/api/roadmap/${userId}`);
      if (response.ok) {
        this.roadmap = await response.json();
        return this.roadmap;
      } else if (response.status === 403) {
        this.isPremium = false;
      }
    } catch (error) {
      console.error('Error fetching roadmap:', error);
    }
    return null;
  },

  /**
   * Generate roadmap
   */
  async generateRoadmap(userId) {
    try {
      const response = await fetch(`http://localhost:8001/api/roadmap/${userId}/generate`, {
        method: 'POST'
      });

      if (response.ok) {
        const result = await response.json();
        this.roadmap = result.roadmap;
        // Refresh display
        this.renderRoadmapCard();
        return result;
      }
    } catch (error) {
      console.error('Error generating roadmap:', error);
    }
    return null;
  },

  /**
   * Render roadmap card
   */
  renderRoadmapCard() {
    const sideColumn = document.querySelector('.side-column');
    if (!sideColumn) return;

    if (!this.isPremium) {
      this.renderPremiumTeaser();
      return;
    }

    const roadmapCard = document.createElement('div');
    roadmapCard.className = 'card roadmap-card';

    if (!this.roadmap || !this.roadmap.has_roadmap) {
      roadmapCard.innerHTML = `
        <h3>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          Skill Roadmap
        </h3>
        <p style="color: var(--text-secondary); margin-bottom: 16px;">
          Get a personalized learning path based on your skills!
        </p>
        <button class="solve-btn" onclick="RoadmapModule.generateRoadmap('${this.getUserId()}')">
          Generate My Roadmap
        </button>
      `;
    } else {
      roadmapCard.innerHTML = `
        <h3>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          Your Skill Roadmap
        </h3>
        
        <div class="roadmap-level">
          <span class="level-label">Current Level:</span>
          <span class="level-value">${this.roadmap.current_level}</span>
        </div>
        
        <div class="roadmap-section">
          <h4>This Week's Plan</h4>
          <ul class="weekly-goals">
            ${this.roadmap.weekly_plan.goals.map(goal => `<li>${goal}</li>`).join('')}
          </ul>
        </div>
        
        <div class="roadmap-section">
          <h4>Focus Areas</h4>
          <div class="focus-tags">
            ${this.roadmap.weekly_plan.focus_areas.map(area =>
        `<span class="focus-tag">${area}</span>`
      ).join('')}
          </div>
        </div>
        
        <div class="roadmap-section">
          <h4>Recommended Problems</h4>
          <ul class="recommended-problems">
            ${this.roadmap.weekly_plan.recommended_problems.slice(0, 3).map(problem => `
              <li>
                <span class="problem-title">${problem.title}</span>
                <span class="problem-difficulty difficulty-tag ${problem.difficulty}">${problem.difficulty}</span>
              </li>
            `).join('')}
          </ul>
        </div>
        
        <button class="solve-btn" onclick="RoadmapModule.showFullRoadmap()">
          View Full Roadmap
        </button>
      `;
    }

    // Check for existing card and replace or append
    const existingCard = sideColumn.querySelector('.roadmap-card');
    if (existingCard) {
      sideColumn.replaceChild(roadmapCard, existingCard);
    } else {
      sideColumn.appendChild(roadmapCard);
    }
  },

  /**
   * Render premium teaser for free users
   */
  renderPremiumTeaser() {
    const sideColumn = document.querySelector('.side-column');
    if (!sideColumn) return;

    const teaserCard = document.createElement('div');
    teaserCard.className = 'card premium-teaser roadmap-teaser'; // Added class for specific identification
    teaserCard.innerHTML = `
      <div class="premium-lock-icon">🔒</div>
      <h3>Unlock Your Skill Roadmap</h3>
      <p style="color: var(--text-secondary); margin-bottom: 16px;">
        Get personalized weekly plans, skill assessments, and smart course recommendations.
      </p>
      <ul class="premium-features">
        <li>✓ Adaptive Weekly Plans</li>
        <li>✓ Skill Gap Analysis</li>
        <li>✓ Smart Course Suggestions</li>
        <li>✓ Progress Tracking</li>
      </ul>
      <button class="premium-upgrade-btn" onclick="showPremiumModal()">
        Upgrade to Premium
      </button>
    `;

    // Check for existing card and replace or append
    const existingCard = sideColumn.querySelector('.roadmap-teaser');
    if (existingCard) {
      sideColumn.replaceChild(teaserCard, existingCard);
    } else {
      sideColumn.appendChild(teaserCard);
    }
  },

  /**
   * Show full roadmap modal
   */
  showFullRoadmap() {
    // TODO: Implement full roadmap modal
    alert('Full roadmap view coming soon!');
  },

  getUserId() {
    return window.currentUserId || localStorage.getItem('beatCodersUserID') || sessionStorage.getItem('userId') || localStorage.getItem('userId');
  }
};

// ============================================================================
// AI Mentor Module (Premium Feature)
// ============================================================================

const AIMentorModule = {
  currentSession: null,
  isPremium: false,

  /**
   * Initialize AI Mentor
   */
  async init(userId, isPremium) {
    this.isPremium = isPremium;

    if (!userId) return;

    if (isPremium) {
      this.renderMentorCard();
    } else {
      this.renderMentorTeaser();
    }
  },

  /**
   * Start new mentor session
   */
  async startSession(userId, context = {}) {
    try {
      const response = await fetch('http://localhost:8001/api/mentor/session/new', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, context })
      });

      if (response.ok) {
        this.currentSession = await response.json();
        return this.currentSession;
      }
    } catch (error) {
      console.error('Error starting mentor session:', error);
    }
    return null;
  },

  /**
   * Send message to mentor
   */
  async sendMessage(userId, message, context = {}) {
    try {
      const response = await fetch('http://localhost:8001/api/mentor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          session_id: this.currentSession?.session_id,
          message: message,
          context: context
        })
      });

      if (response.ok) {
        const result = await response.json();
        if (!this.currentSession) {
          this.currentSession = { session_id: result.session_id };
        }
        return result;
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
    return null;
  },

  /**
   * Render mentor card
   */
  renderMentorCard() {
    const sideColumn = document.querySelector('.side-column');
    if (!sideColumn) return;

    const mentorCard = document.createElement('div');
    mentorCard.className = 'card ai-mentor-card';
    mentorCard.innerHTML = `
      <h3>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
        AI Coding Mentor
      </h3>
      
      <div class="mentor-chat-preview">
        <p style="color: var(--text-secondary); margin-bottom: 12px;">
          Get instant coding guidance and hints!
        </p>
        <button class="solve-btn" onclick="AIMentorModule.openMentorChat()">
          Start Chat
        </button>
      </div>
    `;

    // Check for existing card and replace or append
    const existingCard = sideColumn.querySelector('.ai-mentor-card');
    if (existingCard) {
      sideColumn.replaceChild(mentorCard, existingCard);
    } else {
      sideColumn.appendChild(mentorCard);
    }
  },

  /**
   * Render mentor teaser for free users
   */
  renderMentorTeaser() {
    const sideColumn = document.querySelector('.side-column');
    if (!sideColumn) return;

    const teaserCard = document.createElement('div');
    teaserCard.className = 'card premium-teaser mentor-teaser'; // Added class for specific identification
    teaserCard.innerHTML = `
      <div class="premium-lock-icon">🔒</div>
      <h3>AI Coding Mentor</h3>
      <p style="color: var(--text-secondary); margin-bottom: 16px;">
        Get 24/7 personalized coding guidance from your AI mentor.
      </p>
      <ul class="premium-features">
        <li>✓ Instant Hints & Tips</li>
        <li>✓ Code Review</li>
        <li>✓ Concept Explanations</li>
        <li>✓ Debugging Help</li>
      </ul>
      <button class="premium-upgrade-btn" onclick="showPremiumModal()">
        Upgrade to Premium
      </button>
    `;

    // Check for existing card and replace or append
    const existingCard = sideColumn.querySelector('.mentor-teaser');
    if (existingCard) {
      sideColumn.replaceChild(teaserCard, existingCard);
    } else {
      sideColumn.appendChild(teaserCard);
    }
  },

  /**
   * Open mentor chat modal
   */
  openMentorChat() {
    // TODO: Implement chat modal
    alert('AI Mentor chat interface coming soon!');
  }
};

// ============================================================================
// Premium Modal
// ============================================================================

function showPremiumModal() {
  alert('Premium upgrade feature coming soon! For now, you can enable premium mode manually in the database.');
}

// ============================================================================
// Initialize Phase 4 Features
// ============================================================================

async function initPhase4Features() {
  // Get user data from session/localStorage
  const userId = localStorage.getItem('beatCodersUserID') || sessionStorage.getItem('userId') || localStorage.getItem('userId');
  const isPremium = true; // For testing, assume premium if key missing. In prod, check API or token.

  if (!userId) {
    console.log('No user logged in, skipping Phase 4 features');
    return;
  }

  // Store globally for easy access
  window.currentUserId = userId;
  window.isPremium = isPremium;

  // Initialize modules
  await CRSModule.init(userId);
  await RoadmapModule.init(userId, isPremium);
  await AIMentorModule.init(userId, isPremium);

  console.log('Phase 4 features initialized');
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPhase4Features);
} else {
  initPhase4Features();
}

// Export modules for external use
window.CRSModule = CRSModule;
window.RoadmapModule = RoadmapModule;
window.AIMentorModule = AIMentorModule;
