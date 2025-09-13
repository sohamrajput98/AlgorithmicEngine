#!/bin/bash
# Setup Python virtual environment and install backend dependencies

echo "[INFO] Creating Python virtual environment..."
python3 -m venv venv

echo "[INFO] Activating virtual environment..."
source venv/bin/activate

echo "[INFO] Installing backend requirements..."
pip install --upgrade pip
pip install fastapi uvicorn pymysql sqlalchemy alembic python-dotenv

echo "[INFO] Installing frontend dependencies..."
cd frontend || mkdir frontend && cd frontend
npm init -y
npm install react react-dom tailwindcss

echo "[INFO] Setup complete. Activate venv with:"
echo "source venv/bin/activate"
