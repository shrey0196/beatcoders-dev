# Phase 4 Quick Reference Guide

## 🚀 Quick Start

### Enable Premium for Testing
```sql
UPDATE users SET is_premium = 1, premium_since = datetime('now') WHERE user_id = 'your_user_id';
```

### Test the Features
```bash
python test_phase4.py
```

---

## 📊 CRS (Cognitive Rating Score)

**Available to**: All users  
**Location**: Header badge + Dashboard card

### Components
- **Speed** (25%): Problem-solving speed
- **Accuracy** (30%): Success rate
- **Problem Solving** (30%): Difficulty mastery
- **Consistency** (15%): Regular practice

### Tiers
- 🥉 Bronze: 0-400
- 🥈 Silver: 400-600
- 🥇 Gold: 600-800
- 💎 Platinum: 800-1000

### API
```javascript
// Get CRS
GET /api/crs/{user_id}

// Calculate CRS
POST /api/crs/calculate
Body: {"user_id": "xxx"}

// Get history
GET /api/crs/{user_id}/history
```

---

## 🗺️ Skill Roadmap (Premium)

**Available to**: Premium users only  
**Location**: Dashboard side column

### Features
- Skill level assessment
- Weekly adaptive plans
- Focus area recommendations
- Smart course suggestions

### API
```javascript
// Generate roadmap
POST /api/roadmap/{user_id}/generate

// Get roadmap
GET /api/roadmap/{user_id}

// Get suggestions
GET /api/roadmap/{user_id}/suggestions
```

---

## 🤖 AI Mentor (Premium)

**Available to**: Premium users only  
**Location**: Dashboard side column

### Capabilities
- Coding hints
- Concept explanations
- Debugging help
- Encouragement

### API
```javascript
// Start session
POST /api/mentor/session/new
Body: {"user_id": "xxx", "context": {}}

// Send message
POST /api/mentor/chat
Body: {
  "user_id": "xxx",
  "session_id": "xxx",
  "message": "Your question",
  "context": {}
}

// Get sessions
GET /api/mentor/{user_id}/sessions
```

---

## 📁 Key Files

### Backend
- Models: `backend/models/crs.py`, `skill_roadmap.py`, `mentor_conversation.py`
- Analyzers: `backend/analyzers/crs_calculator.py`, `roadmap_generator.py`, `ai_mentor_engine.py`
- Routes: `backend/api/routes/crs.py`, `skill_roadmap.py`, `ai_mentor.py`

### Frontend
- JS: `static/js/phase4.js`
- CSS: `static/css/phase4.css`

### Testing
- Test script: `test_phase4.py`
- Integration: `integrate_phase4.py`

---

## 🔧 Troubleshooting

**CRS not showing?**
- Check if user is logged in
- Verify backend is running
- Check browser console for errors

**Premium features locked?**
- Update database: `is_premium = 1`
- Verify login response includes `is_premium: true`

**Chart not rendering?**
- Ensure Chart.js is loaded
- Check if user has submission history
- Verify CRS history endpoint returns data

---

## 🎯 Testing Checklist

- [ ] CRS badge appears in header
- [ ] CRS dashboard card shows score and components
- [ ] CRS growth chart renders (if history exists)
- [ ] Solve problem → CRS recalculates
- [ ] Premium user sees roadmap
- [ ] Premium user can chat with AI mentor
- [ ] Free user sees premium teasers
- [ ] Premium upgrade button works

---

## 📝 Next Steps

1. Test with real users
2. Add payment integration for premium
3. Enhance AI mentor with OpenAI API
4. Add email notifications for weekly plans
5. Create admin dashboard for analytics
