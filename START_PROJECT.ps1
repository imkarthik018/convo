# ChatGPT Conversation Manager - Quick Start Script
# This script helps beginners start the project easily

Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "  ChatGPT Conversation Manager" -ForegroundColor Cyan
Write-Host "     Quick Start Script" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Check if Java is installed
Write-Host "1. Checking Java..." -ForegroundColor Yellow
try {
    $javaVersion = java -version 2>&1 | Select-Object -First 1
    Write-Host "   ✅ Java found: $javaVersion" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Java not found! Please install Java 17+" -ForegroundColor Red
    Write-Host "   Download from: https://www.oracle.com/java/technologies/downloads/" -ForegroundColor Yellow
    exit
}

# Check if Node.js is installed
Write-Host ""
Write-Host "2. Checking Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node -version
    Write-Host "   ✅ Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Node.js not found! Please install Node.js" -ForegroundColor Red
    Write-Host "   Download from: https://nodejs.org/" -ForegroundColor Yellow
    exit
}

# Check if Maven is installed
Write-Host ""
Write-Host "3. Checking Maven..." -ForegroundColor Yellow
try {
    $mvnVersion = mvn -version | Select-Object -First 1
    Write-Host "   ✅ Maven found: $mvnVersion" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Maven not found! Please install Maven" -ForegroundColor Red
    Write-Host "   Download from: https://maven.apache.org/download.cgi" -ForegroundColor Yellow
    exit
}

# Check if MySQL is running
Write-Host ""
Write-Host "4. Checking MySQL..." -ForegroundColor Yellow
$mysqlRunning = Get-Service -Name MySQL* -ErrorAction SilentlyContinue | Where-Object { $_.Status -eq 'Running' }
if ($mysqlRunning) {
    Write-Host "   ✅ MySQL service is running" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  MySQL service not detected. Make sure MySQL is installed and running." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Ask user if they want to start the services
$response = Read-Host "Do you want to start the Backend and Frontend? (Y/N)"

if ($response -eq 'Y' -or $response -eq 'y') {
    
    # Check if ports are available
    Write-Host ""
    Write-Host "Checking if ports are available..." -ForegroundColor Yellow
    
    $port8083 = netstat -ano | findstr :8083
    $port3001 = netstat -ano | findstr :3001
    
    if ($port8083) {
        Write-Host "⚠️  Port 8083 is already in use. Killing process..." -ForegroundColor Yellow
        $pid = (netstat -ano | findstr :8083 | Select-Object -First 1) -split '\s+' | Select-Object -Last 1
        if ($pid) {
            taskkill /F /PID $pid 2>$null
            Start-Sleep -Seconds 2
        }
    }
    
    if ($port3001) {
        Write-Host "⚠️  Port 3001 is already in use. Killing process..." -ForegroundColor Yellow
        $pid = (netstat -ano | findstr :3001 | Select-Object -First 1) -split '\s+' | Select-Object -Last 1
        if ($pid) {
            taskkill /F /PID $pid 2>$null
            Start-Sleep -Seconds 2
        }
    }
    
    # Start Backend
    Write-Host ""
    Write-Host "==================================" -ForegroundColor Green
    Write-Host "Starting Backend (Spring Boot)..." -ForegroundColor Green
    Write-Host "This will run in background" -ForegroundColor Green
    Write-Host "==================================" -ForegroundColor Green
    Write-Host ""
    
    $backendJob = Start-Job -ScriptBlock {
        Set-Location C:\Users\vjkar\OneDrive\Desktop\convo\springapp
        mvn spring-boot:run
    }
    
    Write-Host "Backend is starting in background (PID: $($backendJob.Id))..." -ForegroundColor Cyan
    Write-Host "Please wait 30 seconds for backend to fully start..." -ForegroundColor Yellow
    
    # Wait for backend
    Start-Sleep -Seconds 30
    
    # Test if backend is up
    try {
        $response = Invoke-RestMethod -Uri http://localhost:8083/api/chats/allConversations -Method GET -ErrorAction SilentlyContinue
        Write-Host "✅ Backend is running successfully!" -ForegroundColor Green
    } catch {
        Write-Host "⚠️  Backend is starting, may need more time..." -ForegroundColor Yellow
    }
    
    Write-Host ""
    Write-Host "==================================" -ForegroundColor Green
    Write-Host "Starting Frontend (React)..." -ForegroundColor Green
    Write-Host "This will open in your browser" -ForegroundColor Green
    Write-Host "==================================" -ForegroundColor Green
    Write-Host ""
    
    # Start Frontend
    Set-Location reactapp
    npm start
    
    Write-Host ""
    Write-Host "==================================" -ForegroundColor Cyan
    Write-Host "Project Started Successfully!" -ForegroundColor Green
    Write-Host "==================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Backend:  http://localhost:8083" -ForegroundColor Yellow
    Write-Host "Frontend: http://localhost:3001" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Your browser should open automatically." -ForegroundColor Cyan
    Write-Host "Press Ctrl+C to stop the frontend." -ForegroundColor Yellow
    Write-Host ""
    
} else {
    Write-Host ""
    Write-Host "Exiting..." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "To start the project manually:" -ForegroundColor Cyan
    Write-Host "1. Open Terminal 1: cd springapp && mvn spring-boot:run" -ForegroundColor White
    Write-Host "2. Open Terminal 2: cd reactapp && npm start" -ForegroundColor White
    Write-Host ""
}

