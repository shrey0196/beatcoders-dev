# BeatCoders

BeatCoders is a comprehensive platform for developers to master coding skills through gamification and detailed feedback.A gamified coding platform with real-time battles, cognitive analysis, and tiered feedback.


## Project Description

*   **What**: An interactive coding platform featuring real-time battles, intelligent cognitive analysis, and structured learning paths (Micro-Lessons).
*   **Why**: To bridge the gap between rote practice and deep understanding by providing tiered feedback and insights into a developer's cognitive state (focus, fatigue, etc.).
*   **Who**: Aspiring software engineers, students, and competitive programmers looking to improve their efficiency and problem-solving speed.

## Features

*   **User Authentication**: Secure password hashing using bcrypt (with industry-standard practices).
.
*   **Real-time Code Execution**: Instant analysis and feedback on user code submissions.
*   **Cognitive Analysis**: Tracks user focus, verification behaviors, and cognitive load in real-time.
*   **Code Battles**: 1v1 simulated coding competitions with live updates.
*   **Multiple Languages**: seamless support for Python and JavaScript execution.
*   **Admin Dashboard**: Comprehensive tools for problem management and user stats.
*   **Tiered Feedback**: Intelligent hints and complexity analysis (Time/Space O-notation).

## Tech Stack

*   **Frontend**: HTML, TailwindCSS, Vanilla JavaScript (ES6 Modules)
*   **Backend**: Python, FastAPI
*   **Database**: SQLite (Development), PostgreSQL (Production Compatible)
*   **Tools**: Git, Mermaid.js (Diagrams), Chart.js
*   **Deployment**: Local / Cloud Ready (AWS/Render compatible)

## High-Level Architecture (Networking Perspective)

BeatCoders implements the OSI model standards:

*   **Layer 7 (Application)**:
    *   **Protocols**: HTTP/HTTPS (Hypertext Transfer Protocol).
    *   **Data Presentation**: JSON (JavaScript Object Notation) for API responses.
    *   **Implementation**: Fast API (Backend) handles request processing; Browser (Frontend) handles user interaction.
*   **Layer 4 (Transport)**:
    *   **Protocol**: TCP (Transmission Control Protocol).
    *   **Implementation**: Uvicorn (ASGI Server) manages reliable connection sockets (e.g., port 8001).
*   **Layer 3 (Network)**:
    *   **Addressing**: IP (Internet Protocol).
    *   **Implementation**: Routing via `localhost` (127.0.0.1) or deployed Server IP.

## Prerequisites

Before running the project on a new system, ensure you have:

*   **Python**: 3.10 or higher
*   **Node.js**: LTS version (Verified with v20+)
*   **Git**: For version control

## Setup Instructions

### 1. Clone Repository
```bash
git clone <repository_url>
cd BeatCoders
```

### 2. Backend Setup
The backend is built with FastAPI and SQLite.

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```

2.  Create and activate a virtual environment:
    ```bash
    python -m venv venv
    # Windows
    .\venv\Scripts\activate
    # Mac/Linux
    source venv/bin/activate
    ```

3.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```

4.  Configure environment variables:
    ```bash
    # Windows
    copy .env.example .env
    # Mac/Linux
    cp .env.example .env
    ```
    *Note: Verify `DATABASE_URL` in `.env` points to `sqlite:///./beatcoders.db`*

### 4. Configuration Reference (`.env`)

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `DATABASE_URL` | Connection string for DB | `sqlite:///./beatcoders.db` |
| `SECRET_KEY` | Key for JWT tokens | *Change this in production!* |
| `ALGORITHM` | Hashing algorithm | `HS256` |
| `SENDGRID_API_KEY`| API key for emails | *(Optional for local dev)* |

### 5. Frontend Setup
The frontend uses TailwindCSS for styling.

1.  Navigate to the project root (if currently in backend):
    ```bash
    cd ..
    ```

2.  Install Node dependencies:
    ```bash
    npm install
    ```

3.  Build CSS:
    ```bash
    npx tailwindcss -i ./static/css/input.css -o ./static/css/output.css
    ```
    *Use `--watch` flag for development to auto-rebuild on changes.*

## Running the Application

1.  Start the Backend Server:
    ```bash
    cd backend
    python main.py
    ```

2.  Access the application:
    *   **Dashboard**: [http://localhost:8001/dashboard.html](http://localhost:8001/dashboard.html)
    *   **API Docs**: [http://localhost:8001/docs](http://localhost:8001/docs)

## Project Structure

```
BeatCoders/
├── backend/                # FastAPI Application
│   ├── api/routes/        # API Endpoints (Auth, Problems, Submissions)
│   ├── models/            # SQLAlchemy Database Models
│   ├── utils/             # Helper functions (hashing, email)
│   ├── main.py            # App Entry Point
│   └── requirements.txt   # Python Dependencies
├── static/                 # Frontend Assets
│   ├── css/               # Tailwind Input/Output CSS
│   └── js/                # Application Logic (Vanilla JS modules)
├── *.html                  # HTML Pages (dashboard, battle, etc.)
├── package.json            # Node Dependencies (TailwindCSS)
└── README.md               # You are here
```

## Troubleshooting

- **Crash on Startup?** Ensure `passlib` is installed (`pip install passlib`) and Python version is 3.10+.
- **Database Errors?** Ensure `.env` exists and `beatcoders.db` is writable.
- **Styling Missing?** Ensure you ran the Tailwind build command.

## Project Status
🚧 Active development — core features implemented, UI and scaling in progress.

## Roadmap / Future Enhancements

*   **Advanced AI Analysis**: Integrating LLMs for personalized code refactoring suggestions.
*   **Multiplayer Coding**: Real-time collaborative coding (Google Docs style) for pair programming.
*   **Mobile App**: React Native mobile application for practicing on the go.
*   **System Design**: Adding system design challenges and architectural pattern tutorials.
*   **Career Integration**: Direct integration with LinkedIn API and resume builder based on solved problems.

### Future Path: Cognitive AI Evolution

**Phase 1: Data Collection Strategy**
*   Keep current heuristic system for immediate feedback.
*   Log all cognitive signals (focus duration, typing cadence, error rates) to database.
*   Track user outcomes (solved/failed, time taken) to build labeled dataset.

**Phase 2: Model Training**
*   Train LSTM/Transformer models on collected behavioral data.
*   **A/B Testing**: Compare Heuristic-based feedback vs. ML-based predictions.
*   Deploy ML models to production if they statistically outperform heuristics.


**Phase 3: Continuous Learning System**
*   Implement automatic weekly model retraining.
*   Deliver hyper-personalized predictions per user based on their unique learning curve.

## License

Distributed under the MIT License. See `LICENSE` for more information.

