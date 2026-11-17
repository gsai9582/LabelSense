# ==============================================================================
# LabelSense AI - One-Command Startup Script (Windows PowerShell)
# Medical Device Label Verification Platform (Assistive MedTech Engine)
# ==============================================================================

Write-Host ""
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "   LabelSense AI - Medical Device Label Verification Engine            " -ForegroundColor White
Write-Host "   CodeQuest 2026 - Production System Initializer                      " -ForegroundColor Cyan
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host ""

$SCRIPT_DIR = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $SCRIPT_DIR

# 1. Check Python installation
Write-Host "[1/5] Checking Python environment..." -ForegroundColor Yellow
$PYTHON_CMD = "python"
if (-not (Get-Command $PYTHON_CMD -ErrorAction SilentlyContinue)) {
    $PYTHON_CMD = "py"
    if (-not (Get-Command $PYTHON_CMD -ErrorAction SilentlyContinue)) {
        Write-Host "ERROR: Python 3.10+ is required but was not found in PATH." -ForegroundColor Red
        Exit 1
    }
}

# 2. Check and prepare backend virtual environment
Write-Host "[2/5] Setting up FastAPI backend environment..." -ForegroundColor Yellow
$SERVER_DIR = Join-Path $SCRIPT_DIR "server"
$VENV_DIR = Join-Path $SERVER_DIR ".venv"
$VENV_PYTHON = Join-Path $VENV_DIR "Scripts\python.exe"

if (-not (Test-Path $VENV_PYTHON)) {
    Write-Host "      Creating Python virtual environment in server/.venv..." -ForegroundColor Gray
    & $PYTHON_CMD -m venv $VENV_DIR
    & $VENV_PYTHON -m pip install --upgrade pip
    & $VENV_PYTHON -m pip install -r (Join-Path $SERVER_DIR "requirements.txt")
}

# 3. Seed database if not present
$DB_FILE = Join-Path $SERVER_DIR "labelsense.db"
if (-not (Test-Path $DB_FILE)) {
    Write-Host "[3/5] Seeding SQLite database with clinical scenarios and genesis block..." -ForegroundColor Yellow
    Push-Location $SERVER_DIR
    & $VENV_PYTHON seed.py
    Pop-Location
} else {
    Write-Host "[3/5] SQLite database verified at server/labelsense.db" -ForegroundColor Green
}

# 4. Check Node.js and packages
Write-Host "[4/5] Checking Node.js frontend dependencies..." -ForegroundColor Yellow
if (-not (Test-Path (Join-Path $SCRIPT_DIR "node_modules"))) {
    Write-Host "      Installing npm packages..." -ForegroundColor Gray
    npm install
} else {
    Write-Host "      Node modules verified." -ForegroundColor Green
}

# 5. Launch Full-Stack Application
Write-Host "[5/5] Launching full-stack services..." -ForegroundColor Green
Write-Host ""
Write-Host "----------------------------------------------------------------------" -ForegroundColor DarkGray
Write-Host "   Backend API:   http://127.0.0.1:8000 (FastAPI Swagger: /docs)       " -ForegroundColor White
Write-Host "   Frontend App:  http://127.0.0.1:5173                                " -ForegroundColor White
Write-Host "   Demo Personas: Dr. Aris Thorne (QA Lead), Elena Rostova (Reviewer)  " -ForegroundColor Gray
Write-Host "----------------------------------------------------------------------" -ForegroundColor DarkGray
Write-Host ""
Write-Host "Starting FastAPI backend in background..." -ForegroundColor Cyan

# Start FastAPI backend process
$BackendProcess = Start-Process -FilePath $VENV_PYTHON -ArgumentList "-m uvicorn app.main:app --host 127.0.0.1 --port 8000" -WorkingDirectory $SERVER_DIR -PassThru

# Start Frontend Dev Server
Write-Host "Starting Vite frontend server..." -ForegroundColor Cyan
try {
    npm run dev -- --host 127.0.0.1 --port 5173
} finally {
    if ($BackendProcess -and -not $BackendProcess.HasExited) {
        Write-Host "Stopping backend service..." -ForegroundColor Gray
        Stop-Process -Id $BackendProcess.Id -Force -ErrorAction SilentlyContinue
    }
}
