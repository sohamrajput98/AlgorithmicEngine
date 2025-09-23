

# ⚙️ AlgorithmicEngine

**AlgorithmicEngine** is a modular learning platform for practicing algorithmic problems, featuring:
- 🎯 Personalized problem suggestions  
- 🏅 Badge system for progress tracking  
- 🧩 Lightweight, LeetCode-style interface  

Built for reproducibility, clarity, and future-proofing.

## 🧱 Project Structure

AlgorithmicEngine/
├── backend/        # FastAPI backend with pinned dependencies
├── frontend/       # React + Vite + Tailwind UI
├── scripts/        # CLI helpers (e.g., DB creation)
├── docs/           # Documentation
├── .env.example    # Environment template
├── LICENSE
└── README.md
```


## 🚀 Setup Instructions

### Backend
```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt
cp .env.example .env
# DB creation (script WIP)
bash scripts/create_databases.sh


### Frontend
```bash
cd frontend
npm ci
# Dev server (WIP)
npm run dev
```


## 🧠 Development Philosophy

- ✅ **Task 1 Complete**: Reproducible dev setup with pinned dependencies  
- 🔒 `.env` is excluded from commits  
- 🧪 Optional dev tooling to be added (`requirements-dev.txt`, `.npmrc`)  
- 🛠️ CLI-first visibility and schema parity checks in progress  
- 📦 Modular commit history and atomic task tracking enforced






