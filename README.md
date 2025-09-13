# AlgorithmicEngine

AlgorithmicEngine is a practice platform inspired by LeetCode.  
It allows users to solve coding problems, track progress with badges, and explore adaptive problem suggestions.

## Features (planned)
- Problem solving interface (with difficulty shown as ⭐)
- User authentication
- Adaptive question recommendations
- Badges for achievements
- Profile tracking
- Export reports

## Tech Stack
- Backend: Python (FastAPI)
- Database: MySQL
- Frontend: React + Tailwind CSS
- Auth: JWT
- Deployment: GitHub + (Docker optional later)

## Setup
1. Copy `.env.example` → `.env` and update values.
2. Run `scripts/setup_dev_env.sh` to install dependencies.
3. Run `scripts/create_databases.sh` to create MySQL databases.
