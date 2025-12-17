if (!window.CareerManager) {
    class CareerManager {
        constructor() {
            this.apiBase = '/api/career';
            this.init();
        }

        init() {
            console.log('[Career] Initializing Career Manager...');

            // Wait for DOM
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.setupNavigation());
            } else {
                this.setupNavigation();
            }
        }

        setupNavigation() {
            const navLink = document.getElementById('nav-career-link');
            if (navLink) {
                navLink.addEventListener('click', (e) => {
                    // We let the default dashboard logic handle view switching (via data-view)
                    // We just ensure the content is rendered.
                    this.render();
                });
            }
        }

        render() {
            // Find the container in dashboard.html
            const container = document.getElementById('career-view');
            if (!container) {
                console.error('[Career] #career-view container not found!');
                return;
            }

            // Render content dynamicall to reflect latest state (localStorage)
            container.innerHTML = this.renderCareerSection();
        }

        async togglePublicProfile(isPublic) {
            try {
                const user = JSON.parse(localStorage.getItem('beatCodersUser') || '{}');
                if (!user.user_id) {
                    this.showToast('Please login first!', 'error');
                    return false;
                }

                const response = await fetch(`${this.apiBase}/profile/publish`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        user_id: user.user_id,
                        is_public_profile: isPublic
                    })
                });

                if (!response.ok) throw new Error('Failed to update profile');

                // Update local user object
                user.is_public_profile = isPublic;
                localStorage.setItem('beatCodersUser', JSON.stringify(user));

                this.showToast(isPublic ? 'Profile is now Public! 🌍' : 'Profile is now Private 🔒', 'success');
                return true;
            } catch (e) {
                console.error(e);
                this.showToast('Error updating profile settings', 'error');
                // Revert checkbox if failed (UI sync needed? Render handles it next time)
                return false;
            }
        }

        async toggleHiringMode(isOpen) {
            // Premium Check
            if (!this.checkPremium()) {
                // Revert toggle visually
                const toggle = document.getElementById('hiring-toggle');
                if (toggle) toggle.checked = !isOpen;
                return false;
            }

            try {
                const user = JSON.parse(localStorage.getItem('beatCodersUser') || '{}');
                const response = await fetch(`${this.apiBase}/profile/publish`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        user_id: user.user_id,
                        is_public_profile: true, // Auto-publish if hiring
                        open_to_work: isOpen
                    })
                });

                if (!response.ok) throw new Error('Failed to update hiring status');

                user.open_to_work = isOpen;
                if (isOpen) user.is_public_profile = true;
                localStorage.setItem('beatCodersUser', JSON.stringify(user));

                this.showToast(isOpen ? 'You are now Open to Work! 💼' : 'Hiring mode disabled', 'success');
                // Re-render to update dependent UI (like Profile Toggle being forced on)
                this.render();
                return true;
            } catch (e) {
                console.error(e);
                this.showToast('Error updating hiring settings', 'error');
                // Revert toggle visually
                const toggle = document.getElementById('hiring-toggle');
                if (toggle) toggle.checked = !isOpen;
                return false;
            }
        }

        isPremium() {
            // Check if user is premium
            const user = JSON.parse(localStorage.getItem('beatCodersUser') || '{}');
            // Check local storage or global settings
            return (user.is_premium || (window.userSettings && window.userSettings.is_premium));
        }

        checkPremium() {
            if (this.isPremium()) return true;
            this.showPremiumModal();
            return false;
        }

        showPremiumModal() {
            // Trigger the existing premium modal if available or alert
            if (window.premiumManager && window.premiumManager.showUnlockModal) {
                window.premiumManager.showUnlockModal('Career Features');
            } else {
                alert("✨ This is a Premium Feature!\n\nUpgrade to unlock Hiring Mode, Certificates, and more.");
            }
        }

        showToast(msg, type = 'info') {
            const toast = document.createElement('div');
            toast.className = `toast toast-${type}`;
            toast.textContent = msg;
            document.body.appendChild(toast);
            // Trigger generic toast styling
            setTimeout(() => toast.classList.add('show'), 100);
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => toast.remove(), 300);
            }, 3000);
        }

        // PDF Certificate Generation (Mock)
        downloadCertificate(tier) {
            if (!this.checkPremium()) return;

            const user = JSON.parse(localStorage.getItem('beatCodersUser') || '{}');
            alert(`Generating ${tier} Certificate for ${user.user_id}...\n\n(This would download a PDF in production)`);
        }

        renderCareerSection() {
            const user = JSON.parse(localStorage.getItem('beatCodersUser') || '{}');
            const isPublic = user.is_public_profile || false;
            const isOpen = user.open_to_work || false;
            const premium = this.isPremium();

            const html = `
                <div class="career-dashboard fade-in">
                    <div class="career-header">
                        <h2>🚀 Career Hub</h2>
                        <p>Manage your professional presence and connect with opportunities.</p>
                    </div>

                    <div class="career-grid">
                        <!-- Profile Settings Card -->
                        <div class="card career-card">
                            <h3>Profile Visibility</h3>
                            <div class="setting-item">
                                <div class="setting-info">
                                    <span class="setting-label">Public Profile</span>
                                    <span class="setting-desc">Allow others to view your stats and solutions.</span>
                                </div>
                                <label class="switch">
                                    <input type="checkbox" id="public-profile-toggle" ${isPublic ? 'checked' : ''} onchange="window.careerManager.togglePublicProfile(this.checked)">
                                    <span class="slider round"></span>
                                </label>
                            </div>
                            
                            <div class="setting-item premium-feature">
                                <div class="setting-info">
                                    <span class="setting-label">Open to Work <span class="badge-premium">PRO</span></span>
                                    <span class="setting-desc">Signal recruiters that you are ready for hire.</span>
                                </div>
                                <label class="switch">
                                    <input type="checkbox" id="hiring-toggle" ${isOpen ? 'checked' : ''} onchange="window.careerManager.toggleHiringMode(this.checked)">
                                    <span class="slider round"></span>
                                </label>
                            </div>
                        </div>

                        <!-- Certificates Card -->
                        <div class="card career-card">
                            <h3>Certificates <span class="badge-premium">PRO</span></h3>
                            <p class="card-desc">Download verified certificates for your achievements.</p>
                            
                            <div class="cert-list">
                                <!-- Rookie Certificate (Always Unlocked for now, or check > 0 problems) -->
                                <div class="cert-item" style="border-left: 3px solid var(--green);">
                                    <div style="display:flex; flex-direction:column;">
                                        <span>🌱 Rookie Developer</span>
                                        <span style="font-size:0.75rem; color:var(--text-secondary);">Beginner Milestone</span>
                                    </div>
                                    <button class="btn-small" onclick="window.careerManager.downloadCertificate('Rookie')">Download</button>
                                </div>

                                <!-- Platinum -->
                                <div class="cert-item ${user.elo_rating >= 1800 ? '' : 'disabled'}">
                                    <div style="display:flex; flex-direction:column;">
                                        <span>🥈 Platinum Tier</span>
                                        <span style="font-size:0.75rem; color:var(--text-secondary);">Elo 1800+</span>
                                    </div>
                                    ${user.elo_rating >= 1800 ?
                    `<button class="btn-small" onclick="window.careerManager.downloadCertificate('Platinum')">Download</button>` :
                    `<span style="font-size:0.8rem; opacity:0.7;">Locked</span>`
                }
                                </div>

                                <!-- Diamond -->
                                <div class="cert-item ${user.elo_rating >= 2200 ? '' : 'disabled'}">
                                    <div style="display:flex; flex-direction:column;">
                                        <span>🏆 Diamond Tier</span>
                                        <span style="font-size:0.75rem; color:var(--text-secondary);">Elo 2200+</span>
                                    </div>
                                    ${user.elo_rating >= 2200 ?
                    `<button class="btn-small" onclick="window.careerManager.downloadCertificate('Diamond')">Download</button>` :
                    `<span style="font-size:0.8rem; opacity:0.7;">Locked</span>`
                }
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Recruiter Analytics (Mock) -->
                    <div class="card career-card full-width" style="margin-top: 20px;">
                        <h3>👀 Profile Views <span class="badge-premium">PRO</span></h3>
                        <div style="height: 200px; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.2); border-radius: 8px;">
                             ${premium ?
                    '<p>You appeared in <strong>12 searches</strong> this week.</p>' :
                    '<div style="text-align:center"><p>Upgrade to see who is viewing your profile.</p><button class="btn-primary" style="margin-top:10px" onclick="window.careerManager.showPremiumModal()">Unlock Analytics</button></div>'
                }
                        </div>
                    </div>
                    
                    <!-- Public Marketplace (New) -->
                    <div class="card career-card full-width" style="margin-top: 20px;">
                        <h3>🌍 Community & Marketplace</h3>
                        <p style="margin-bottom:15px; color:var(--text-secondary);">Top talent currently Open to Work.</p>
                        <div id="marketplace-list" class="marketplace-grid" style="display:grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap:15px;">
                            <div style="text-align:center; padding:20px;">Loading public profiles...</div>
                        </div>
                    </div>
                </div>
            `;

            // Trigger fetch after render
            setTimeout(() => this.loadMarketplace(), 100);
            return html;
        }

        async loadMarketplace() {
            const container = document.getElementById('marketplace-list');
            if (!container) return;

            try {
                const res = await fetch(`${this.apiBase}/marketplace`);
                if (!res.ok) throw new Error('Failed to load');
                const candidates = await res.json();

                if (candidates.length === 0) {
                    container.innerHTML = '<div style="grid-column:1/-1; text-align:center; color:var(--text-secondary);">No public profiles found yet. Be the first!</div>';
                    return;
                }

                container.innerHTML = candidates.map(c => `
                    <div style="background:var(--bg2); padding:15px; border-radius:8px; display:flex; align-items:center; gap:12px; border:1px solid rgba(255,255,255,0.05);">
                        <div style="width:40px; height:40px; border-radius:50%; background:linear-gradient(135deg, var(--accent1), var(--accent2)); display:flex; align-items:center; justify-content:center; font-weight:bold; color:white;">
                            ${c.username.charAt(0).toUpperCase()}
                        </div>
                        <div style="flex:1; min-width:0;">
                             <div style="font-weight:600; color:var(--text-primary); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                                ${c.username}
                                ${c.is_premium ? '<span title="Premium" style="color:gold; font-size:0.8rem; margin-left:4px;">★</span>' : ''}
                             </div>
                             <div style="font-size:0.85rem; color:var(--accent1);">Elo: ${c.elo}</div>
                        </div>
                        <button class="btn-small" style="background:rgba(255,255,255,0.1);" onclick="alert('Viewing Profile: ${c.username}\\n(Detailed View Coming Soon)')">View</button>
                    </div>
                `).join('');

            } catch (e) {
                console.error(e);
                container.innerHTML = '<div style="color:var(--red);">Failed to load profiles.</div>';
            }
        }
    }

    window.CareerManager = CareerManager;
    window.careerManager = new CareerManager();
}
