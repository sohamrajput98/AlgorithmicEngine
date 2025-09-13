# AlgorithmicEngine

AlgorithmicEngine is a learning platform for practicing algorithmic problems, featuring personalized problem suggestions, badges, and a lightweight LeetCode-like interface.  

## Project Structure

AlgorithmicEngine/
├─ backend/ # FastAPI backend
│ ├─ requirements.txt # pinned dependencies
├─ frontend/ # React + Vite + Tailwind frontend
│ ├─ package.json
│ ├─ package-lock.json
├─ .env.example # environment variables template
├─ README.md
├─ LICENSE
├─ docs/ # documentation
└─ scripts/ # helper scripts

bash
Copy code

## Setup Instructions

### Backend

1. Create a virtual environment and activate it:

```bash
python3 -m venv .venv
source .venv/bin/activate
Install dependencies:

bash
Copy code
pip install -r backend/requirements.txt
Copy .env.example to .env and update the variables:

bash
Copy code
cp .env.example .env
Create databases (later, when script is ready):

bash
Copy code
bash scripts/create_databases.sh
Frontend
Go to frontend folder:

bash
Copy code
cd frontend
Install dependencies:

bash
Copy code
npm ci
Run development server (later):

bash
Copy code
npm run dev
Notes
Task 1 focused on reproducible dev environment and pinned dependencies.

Optional dev/testing dependencies can be added later (backend/requirements-dev.txt, frontend/.npmrc).

Do not commit your actual .env file.

Status
Task 1: Completed ✅

Next: Database schema and basic backend APIs