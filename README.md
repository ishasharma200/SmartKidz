# SmartGrow AI

SmartGrow AI is an AI-powered educational and digital wellbeing platform for children. This project focuses on the first module, the AI Smart Storyteller, which includes:

- Story generation
- Rhymes and poems
- Age and language controls
- Audio narration using browser speech synthesis
- Interactive quick quizzes
- A child-friendly UI prototype

## Project status

This repository currently contains the first frontend prototype for the SmartGrow AI storyteller experience.

## Run locally

Start the backend API:

```bash
cd "FINAL PROJECT"
python -m pip install -r requirements.txt
uvicorn backend.app:app --host 127.0.0.1 --port 8001
```

Start the frontend static server in a second terminal:

```bash
cd "FINAL PROJECT"
python -m http.server 8000
```

Then open:

```text
http://localhost:8000/
```

## Files

- `index.html` – page structure and content
- `styles.css` – design and responsive layout
- `script.js` – frontend logic and API integration
- `backend/app.py` – FastAPI backend for story/poem generation
- `requirements.txt` – Python dependencies
