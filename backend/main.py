"""
BeatCoders Backend API
FastAPI application for code submission and analysis
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import sys
import os

# Add parent directory to path to import analyzers
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

app = FastAPI(
    title="BeatCoders API",
    description="Code efficiency analysis and submission API",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8000",
        "http://127.0.0.1:8000",
        "http://localhost:5500",  # VS Code Live Server
        "http://127.0.0.1:5500",
        "http://localhost:63342", # PyCharm Default
        "http://localhost:63343", # PyCharm Alternative
        "http://localhost:8001",  # Self
        "http://127.0.0.1:8001",
        "null",  # Allow file:// protocol for development
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database setup
from config.database import engine, Base
from models.user import User
from models.password_reset import PasswordReset
from models.cognitive import CognitiveHistory
from models.problem import Problem
from models.crs import CRSScore
from models.skill_roadmap import SkillRoadmap
from models.mentor_conversation import MentorConversation
from models.submission import Submission
Base.metadata.create_all(bind=engine)

# --- Schema Migration for Elo (Manual Check) ---
from sqlalchemy import text, inspect
def run_migrations():
    try:
        inspector = inspect(engine)
        
        # Migration 1: Add elo_rating to users table
        columns = [c['name'] for c in inspector.get_columns('users')]
        if 'elo_rating' not in columns:
            print("Migrating: Adding elo_rating to users table...")
            with engine.connect() as conn:
                conn.execute(text("ALTER TABLE users ADD COLUMN elo_rating INTEGER DEFAULT 1200"))
                conn.commit()
            print("Migration successful.")
        
        # Migration 2: Add days_active to crs_scores table
        if 'crs_scores' in inspector.get_table_names():
            crs_columns = [c['name'] for c in inspector.get_columns('crs_scores')]
            if 'days_active' not in crs_columns:
                print("Migrating: Adding days_active to crs_scores table...")
                with engine.connect() as conn:
                    conn.execute(text("ALTER TABLE crs_scores ADD COLUMN days_active INTEGER DEFAULT 0"))
                    conn.commit()
                print("Migration successful.")
        
        # Migration 3: Add career fields to users table
        columns = [c['name'] for c in inspector.get_columns('users')]
        if 'is_public_profile' not in columns:
            print("Migrating: Adding career fields to users table...")
            with engine.connect() as conn:
                # SQLite doesn't support multiple columns in one ALTER typically, or we do one by one for safety
                conn.execute(text("ALTER TABLE users ADD COLUMN is_public_profile BOOLEAN DEFAULT 0"))
                conn.execute(text("ALTER TABLE users ADD COLUMN open_to_work BOOLEAN DEFAULT 0"))
                conn.execute(text("ALTER TABLE users ADD COLUMN profile_views INTEGER DEFAULT 0"))
                conn.commit()
            print("Migration successful.")
    except Exception as e:
        print(f"Migration check failed: {e}")

run_migrations()

# Import and include routers
from api.routes import auth, cognitive, submissions, visualization, run_code, problems, battle
from api.routes import crs, skill_roadmap, ai_mentor, career, micro_lessons  # Phase 4 & 14 & 16 routes

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(cognitive.router, prefix="/api/cognitive", tags=["cognitive"])
app.include_router(submissions.router, prefix="/api/submissions", tags=["submissions"])
app.include_router(visualization.router)
app.include_router(run_code.router, tags=["run_code"])
app.include_router(problems.router, prefix="/api", tags=["problems"])

# Phase 4 routes
app.include_router(crs.router, prefix="/api", tags=["crs"])
app.include_router(skill_roadmap.router, prefix="/api", tags=["skill-roadmap"])
app.include_router(ai_mentor.router, prefix="/api", tags=["ai-mentor"])
app.include_router(battle.router, tags=["battle"])
app.include_router(career.router, prefix="/api", tags=["career"])
app.include_router(micro_lessons.router, prefix="/api", tags=["micro-lessons"])

@app.get("/api")
async def root():
    return {
        "message": "BeatCoders API",
        "version": "1.0.0",
        "status": "running",
        "endpoints": {
            "docs": "/docs",
            "health": "/health",
            "submit": "/api/submissions/submit",
            "analysis": "/api/submissions/analysis/{submission_id}"
        }
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# Custom route for JavaScript files to disable caching
@app.get("/static/js/{file_path:path}")
async def serve_js_no_cache(file_path: str):
    """Serve JavaScript files without caching to ensure updates are loaded"""
    parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    js_file_path = os.path.join(parent_dir, "static", "js", file_path)
    
    if not os.path.exists(js_file_path):
        return {"error": "File not found"}, 404
    
    return FileResponse(
        js_file_path,
        media_type="application/javascript",
        headers={
            "Cache-Control": "no-cache, no-store, must-revalidate",
            "Pragma": "no-cache",
            "Expires": "0"
        }
    )

# Mount static files (must be last to avoid overriding API routes)
parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
app.mount("/", StaticFiles(directory=parent_dir, html=True), name="static")

if __name__ == "__main__":
    import uvicorn
    print("Starting BeatCoders API server...")
    print("Dashboard: http://localhost:8001/dashboard.html")
    print("API Documentation: http://localhost:8001/docs")
    print("Health Check: http://localhost:8001/health")
    uvicorn.run(app, host="0.0.0.0", port=8001)
