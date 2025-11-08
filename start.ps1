# SciPark Startup Script
Write-Host "🚀 Starting SciPark Application..." -ForegroundColor Cyan
Write-Host ""

# Kill existing processes on ports
Write-Host "🧹 Cleaning up existing processes..." -ForegroundColor Yellow
$port3000 = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if ($port3000) {
    Stop-Process -Id $port3000.OwningProcess -Force -ErrorAction SilentlyContinue
    Write-Host "   ✓ Killed process on port 3000" -ForegroundColor Green
}

$port5173 = Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue
if ($port5173) {
    Stop-Process -Id $port5173.OwningProcess -Force -ErrorAction SilentlyContinue
    Write-Host "   ✓ Killed process on port 5173" -ForegroundColor Green
}

$port5174 = Get-NetTCPConnection -LocalPort 5174 -ErrorAction SilentlyContinue
if ($port5174) {
    Stop-Process -Id $port5174.OwningProcess -Force -ErrorAction SilentlyContinue
    Write-Host "   ✓ Killed process on port 5174" -ForegroundColor Green
}

Write-Host ""

# Start Backend
Write-Host "🔧 Starting Backend Server..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    "cd C:\ise-scipark\backend; npm start"
) -WindowStyle Normal

# Wait for backend to start
Write-Host "   ⏳ Waiting for backend to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

# Start Frontend
Write-Host ""
Write-Host "🎨 Starting Frontend Server..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList @(
    "-NoExit", 
    "-Command",
    "cd C:\ise-scipark\frontend; npm run dev"
) -WindowStyle Normal

# Wait for frontend to start
Start-Sleep -Seconds 3

Write-Host ""
Write-Host "✅ SciPark Started Successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📱 Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host "🔧 Backend:  http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to exit this window..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
