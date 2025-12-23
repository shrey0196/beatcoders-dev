
const AdminApp = {
    init: function () {
        this.loadStats();
        this.loadUsers();
    },

    showSection: function (sectionId, element) {
        // Toggle view
        document.querySelectorAll('.view-section').forEach(el => el.style.display = 'none');
        document.getElementById(sectionId + '-section').style.display = 'block';

        // Toggle active nav
        if (element) {
            document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
            element.classList.add('active');
        }
    },

    loadStats: async function () {
        try {
            const response = await fetch('/api/admin/stats');
            if (!response.ok) throw new Error('Failed to fetch stats');
            const data = await response.json();

            document.getElementById('stat-total-users').textContent = data.total_users;
            document.getElementById('stat-verified-users').textContent = data.verified_users;
            document.getElementById('stat-premium-users').textContent = data.premium_users;
            document.getElementById('stat-total-problems').textContent = data.total_problems;
        } catch (error) {
            console.error('Error loading stats:', error);
        }
    },

    loadUsers: async function () {
        try {
            const response = await fetch('/api/admin/users');
            if (!response.ok) throw new Error('Failed to fetch users');
            const users = await response.json();

            const tbody = document.getElementById('users-table-body');
            tbody.innerHTML = '';

            if (users.length === 0) {
                tbody.innerHTML = '<tr><td colspan="6" style="text-align:center">No users found.</td></tr>';
                return;
            }

            users.forEach(user => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td class="font-mono">${user.user_id}</td>
                    <td>${user.email}</td>
                    <td><span class="status-badge ${user.is_verified ? 'status-verified' : 'status-unverified'}">${user.is_verified ? 'Verified' : 'Unverified'}</span></td>
                    <td>${user.is_premium ? '<span style="color:var(--gold)">Premium</span>' : '<span style="color:var(--text-secondary)">Free</span>'}</td>
                    <td style="color:var(--text-secondary)">${user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</td>
                    <td>
                        <button class="action-btn" onclick="AdminApp.flagUser('${user.user_id}')">Flag / Ban</button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        } catch (error) {
            console.error('Error loading users:', error);
            document.getElementById('users-table-body').innerHTML = '<tr><td colspan="6" style="text-align:center;color:red">Error loading users</td></tr>';
        }
    },

    flagUser: async function (userId) {
        if (!confirm(`Are you sure you want to flag/ban user ${userId}? This is a simulation.`)) return;

        try {
            const response = await fetch(`/api/admin/flag/${userId}`, { method: 'POST' });
            const result = await response.json();
            alert(result.message);
        } catch (error) {
            console.error('Error flagging user:', error);
            alert('Failed to flag user.');
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    AdminApp.init();
});
