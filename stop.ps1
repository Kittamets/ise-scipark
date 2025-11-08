# Stop SciPark Script
Write-Host "🛑 Stopping SciPark Application..." -ForegroundColor Red
Write-Host ""

# Kill backend (port 3000)
$backend = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if ($backend) {
    Stop-Process -Id $backend.OwningProcess -Force
    Write-Host "✓ Backend stopped (port 3000)" -ForegroundColor Green
} else {
    Write-Host "✗ Backend not running" -ForegroundColor Gray
}

# Kill frontend (port 5173)
$frontend1 = Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue
if ($frontend1) {
    Stop-Process -Id $frontend1.OwningProcess -Force
    Write-Host "✓ Frontend stopped (port 5173)" -ForegroundColor Green
}

# Kill frontend (port 5174)
$frontend2 = Get-NetTCPConnection -LocalPort 5174 -ErrorAction SilentlyContinue
if ($frontend2) {
    Stop-Process -Id $frontend2.OwningProcess -Force
    Write-Host "✓ Frontend stopped (port 5174)" -ForegroundColor Green
}

if (-not $frontend1 -and -not $frontend2) {
    Write-Host "✗ Frontend not running" -ForegroundColor Gray
}

Write-Host ""
Write-Host "✅ All processes stopped!" -ForegroundColor Green
Start-Sleep -Seconds 2
