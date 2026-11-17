#!/usr/bin/env bash
# ==============================================================================
# LabelSense AI - One-Command Startup Script (Linux/macOS Bash)
# Medical Device Label Verification Platform (Assistive MedTech Engine)
# ==============================================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo ""
echo "======================================================================"
echo "   LabelSense AI - Medical Device Label Verification Engine           "
echo "   CodeQuest 2026 - Production System Initializer                     "
echo "======================================================================"
echo ""

# 1. Check Python
echo "[1/5] Checking Python environment..."
PYTHON_CMD="python3"
if ! command -v "$PYTHON_CMD" &> /dev/null; then
    PYTHON_CMD="python"
    if ! command -v "$PYTHON_CMD" &> /dev/null; then
        echo "ERROR: Python 3.10+ is required but was not found."
        exit 1
    fi
fi

# 2. Virtual environment setup
echo "[2/5] Setting up FastAPI backend environment..."
SERVER_DIR="$SCRIPT_DIR/server"
VENV_DIR="$SERVER_DIR/.venv"

if [ ! -d "$VENV_DIR" ]; then
    echo "      Creating Python virtual environment in server/.venv..."
    "$PYTHON_CMD" -m venv "$VENV_DIR"
    "$VENV_DIR/bin/pip" install --upgrade pip
    "$VENV_DIR/bin/pip" install -r "$SERVER_DIR/requirements.txt"
fi

# 3. Seed database
if [ ! -f "$SERVER_DIR/labelsense.db" ]; then
    echo "[3/5] Seeding SQLite database..."
    (cd "$SERVER_DIR" && "$VENV_DIR/bin/python" seed.py)
else
    echo "[3/5] SQLite database verified."
fi

# 4. Check Node.js
echo "[4/5] Checking Node.js frontend dependencies..."
if [ ! -d "$SCRIPT_DIR/node_modules" ]; then
    echo "      Installing npm packages..."
    npm install
else
    echo "      Node modules verified."
fi

# 5. Launch services
echo "[5/5] Launching full-stack services..."
echo "----------------------------------------------------------------------"
echo "   Backend API:   http://127.0.0.1:8000 (FastAPI Swagger: /docs)       "
echo "   Frontend App:  http://127.0.0.1:5173                                "
echo "----------------------------------------------------------------------"

# Trap exit to cleanup background backend process
cleanup() {
    echo ""
    echo "Shutting down backend service..."
    if [ -n "$BACKEND_PID" ]; then
        kill "$BACKEND_PID" 2>/dev/null || true
    fi
    exit 0
}
trap cleanup SIGINT SIGTERM EXIT

# Start backend in background
(cd "$SERVER_DIR" && "$VENV_DIR/bin/python" -m uvicorn app.main:app --host 127.0.0.1 --port 8000) &
BACKEND_PID=$!

# Start Vite frontend
npm run dev -- --host 127.0.0.1 --port 5173
