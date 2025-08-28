@echo off
echo Starting Sentinel-3 System...
echo.

echo Starting Backend Server...
cd backend
start "Sentinel-3 Backend" cmd /k "npm run dev"

echo.
echo Starting Frontend Server...
cd ../frontend
start "Sentinel-3 Frontend" cmd /k "npm run dev"

echo.
echo System starting up...
echo Backend will be available at: http://localhost:3070
echo Frontend will be available at: http://localhost:5173
echo.
echo Make sure MongoDB is running before starting the backend!
echo.
pause
