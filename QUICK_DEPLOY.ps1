# SciPark Quick Deployment Script
# This script helps automate the deployment process

Write-Host "🚀 SciPark Deployment Helper" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Function to generate JWT secret
function Generate-JWTSecret {
    Write-Host "🔐 Generating JWT Secret..." -ForegroundColor Yellow
    $bytes = New-Object byte[] 64
    $rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
    $rng.GetBytes($bytes)
    $secret = [System.Convert]::ToBase64String($bytes)
    Write-Host "✅ JWT Secret generated!" -ForegroundColor Green
    Write-Host "Secret: $secret" -ForegroundColor White
    Write-Host ""
    return $secret
}

# Function to check if backend is running
function Test-BackendHealth {
    param([string]$url)
    try {
        $response = Invoke-RestMethod -Uri "$url/health" -ErrorAction Stop
        Write-Host "✅ Backend is healthy!" -ForegroundColor Green
        Write-Host "Database: $($response.database)" -ForegroundColor White
        return $true
    }
    catch {
        Write-Host "❌ Backend is not responding" -ForegroundColor Red
        return $false
    }
}

# Main menu
function Show-Menu {
    Write-Host "Please select an option:" -ForegroundColor Cyan
    Write-Host "1. Generate JWT Secret" -ForegroundColor White
    Write-Host "2. Test Local Backend" -ForegroundColor White
    Write-Host "3. Test Production Backend" -ForegroundColor White
    Write-Host "4. Build Frontend" -ForegroundColor White
    Write-Host "5. Create Production Environment File" -ForegroundColor White
    Write-Host "6. Run Database Seed" -ForegroundColor White
    Write-Host "7. Test All APIs" -ForegroundColor White
    Write-Host "8. Open Deployment Guide" -ForegroundColor White
    Write-Host "9. Exit" -ForegroundColor White
    Write-Host ""
}

# Main loop
do {
    Show-Menu
    $choice = Read-Host "Enter your choice (1-9)"
    Write-Host ""

    switch ($choice) {
        "1" {
            $secret = Generate-JWTSecret
            Write-Host "💾 Save this secret for your backend environment variables!" -ForegroundColor Yellow
            Write-Host "Press any key to continue..." -ForegroundColor Gray
            $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
        }
        "2" {
            Write-Host "🔍 Testing local backend..." -ForegroundColor Yellow
            $result = Test-BackendHealth -url "http://localhost:3000"
            if (-not $result) {
                Write-Host "💡 Start backend with: cd backend; node index.js" -ForegroundColor Cyan
            }
            Write-Host "Press any key to continue..." -ForegroundColor Gray
            $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
        }
        "3" {
            $prodUrl = Read-Host "Enter your production backend URL (e.g., https://scipark-backend.railway.app)"
            Write-Host "🔍 Testing production backend..." -ForegroundColor Yellow
            $result = Test-BackendHealth -url $prodUrl
            Write-Host "Press any key to continue..." -ForegroundColor Gray
            $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
        }
        "4" {
            Write-Host "🏗️ Building frontend..." -ForegroundColor Yellow
            Set-Location frontend
            npm run build
            if ($LASTEXITCODE -eq 0) {
                Write-Host "✅ Frontend build successful!" -ForegroundColor Green
                Write-Host "📦 Build output in frontend/dist" -ForegroundColor White
            } else {
                Write-Host "❌ Frontend build failed!" -ForegroundColor Red
            }
            Set-Location ..
            Write-Host "Press any key to continue..." -ForegroundColor Gray
            $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
        }
        "5" {
            Write-Host "📝 Creating production environment template..." -ForegroundColor Yellow
            $jwtSecret = Generate-JWTSecret
            
            $prodEnv = @"
# Backend Environment Variables (Railway)
MONGO_URI=mongodb+srv://scipark_admin:YOUR_PASSWORD@scipark-production.xxxxx.mongodb.net/scipark_production?retryWrites=true&w=majority
JWT_SECRET=$jwtSecret
EMAIL_HOST=smtp-relay.brevo.com
EMAIL_PORT=587
EMAIL_USER=YOUR_BREVO_USER
EMAIL_PASS=YOUR_BREVO_API_KEY
EMAIL_FROM=noreply@scipark.com
PORT=3000
NODE_ENV=production
CLIENT_URL=https://scipark-app.vercel.app

# Frontend Environment Variables (Vercel)
VITE_API_URL=https://scipark-backend.railway.app/api
"@
            $prodEnv | Out-File -FilePath "PRODUCTION_ENV_TEMPLATE.txt" -Encoding UTF8
            Write-Host "✅ Template created: PRODUCTION_ENV_TEMPLATE.txt" -ForegroundColor Green
            Write-Host "📝 Edit this file with your actual values" -ForegroundColor Yellow
            Write-Host "Press any key to continue..." -ForegroundColor Gray
            $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
        }
        "6" {
            Write-Host "🌱 Running database seed..." -ForegroundColor Yellow
            Write-Host "⚠️ This will clear existing data! Continue? (y/n)" -ForegroundColor Yellow
            $confirm = Read-Host
            if ($confirm -eq "y") {
                Set-Location backend
                node scripts/seed.js
                Set-Location ..
                Write-Host "✅ Seed completed!" -ForegroundColor Green
            } else {
                Write-Host "❌ Seed cancelled" -ForegroundColor Red
            }
            Write-Host "Press any key to continue..." -ForegroundColor Gray
            $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
        }
        "7" {
            Write-Host "🧪 Testing APIs..." -ForegroundColor Yellow
            $apiUrl = Read-Host "Enter API URL (e.g., http://localhost:3000 or https://scipark-backend.railway.app)"
            
            Write-Host "`n1. Testing health endpoint..." -ForegroundColor Cyan
            try {
                $health = Invoke-RestMethod -Uri "$apiUrl/health"
                Write-Host "✅ Health: $($health.status)" -ForegroundColor Green
            } catch {
                Write-Host "❌ Health check failed: $_" -ForegroundColor Red
            }

            Write-Host "`n2. Testing parking zones..." -ForegroundColor Cyan
            try {
                $zones = Invoke-RestMethod -Uri "$apiUrl/api/parking/zones"
                Write-Host "✅ Zones: $($zones.data.Count) zones found" -ForegroundColor Green
            } catch {
                Write-Host "❌ Zones fetch failed: $_" -ForegroundColor Red
            }

            Write-Host "`n3. Testing parking spots..." -ForegroundColor Cyan
            try {
                $spots = Invoke-RestMethod -Uri "$apiUrl/api/parking/spots"
                Write-Host "✅ Spots: $($spots.data.Count) spots found" -ForegroundColor Green
            } catch {
                Write-Host "❌ Spots fetch failed: $_" -ForegroundColor Red
            }

            Write-Host "Press any key to continue..." -ForegroundColor Gray
            $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
        }
        "8" {
            Write-Host "📖 Opening deployment guide..." -ForegroundColor Yellow
            if (Test-Path "PRODUCTION_SETUP.md") {
                Start-Process "PRODUCTION_SETUP.md"
            } else {
                Write-Host "❌ PRODUCTION_SETUP.md not found!" -ForegroundColor Red
            }
            Write-Host "Press any key to continue..." -ForegroundColor Gray
            $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
        }
        "9" {
            Write-Host "👋 Goodbye!" -ForegroundColor Cyan
            break
        }
        default {
            Write-Host "❌ Invalid choice! Please select 1-9" -ForegroundColor Red
            Write-Host "Press any key to continue..." -ForegroundColor Gray
            $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
        }
    }
    Write-Host ""
} while ($choice -ne "9")
