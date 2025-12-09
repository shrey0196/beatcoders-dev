# BeatCoders Backend

Python FastAPI backend for code submission and efficiency analysis.

## Setup

1. **Create virtual environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Run the server**:
   ```bash
   python main.py
   ```

   Or with uvicorn directly:
   ```bash
   uvicorn main:app --reload --port 8001
   ```

## API Endpoints

### Submit Code
```http
POST /api/submissions/submit
Content-Type: application/json

{
  "problem_id": "two-sum",
  "code": "def two_sum(nums, target): ...",
  "language": "python"
}
```

### Get Analysis
```http
GET /api/submissions/analysis/{submission_id}
```

## Project Structure

```
backend/
├── main.py                 # FastAPI application entry point
├── requirements.txt        # Python dependencies
├── .env.example           # Environment variables template
├── api/
│   └── routes/
│       └── submissions.py  # Submission endpoints
├── analyzers/
│   ├── complexity_analyzer.py    # Code complexity analysis
│   └── feedback_generator.py     # Tiered feedback generation
├── models/                # Database models (TODO)
├── utils/                 # Utility functions
└── config/
    └── settings.py        # Configuration management
```

## Development

- API runs on `http://localhost:8001`
- API docs available at `http://localhost:8001/docs` (Swagger UI)
- Alternative docs at `http://localhost:8001/redoc`

## Testing

```bash
pytest
```

## Next Steps

- [ ] Implement database models
- [ ] Add user authentication
- [ ] Implement code execution sandbox
- [ ] Add more language support
- [ ] Integrate ML model for advanced analysis
