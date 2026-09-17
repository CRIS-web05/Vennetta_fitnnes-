@echo off
title Vendetta Fitness - Iniciar Backend y MySQL
echo ============================================
echo   VENDETTA FITNESS - Servicios Backend
echo ============================================
echo.

REM Verificar si MySQL (XAMPP) ya esta corriendo en puerto 3310
netstat -an | findstr ":3310.*LISTENING" >nul 2>&1
if %errorlevel% neq 0 (
    echo [1/2] Iniciando MySQL de XAMPP en puerto 3310...
    start "" /B "C:\xampp\mysql\bin\mysqld.exe" --defaults-file="C:\xampp\mysql\bin\my.ini" --standalone
    timeout /t 4 /nobreak >nul
) else (
    echo [1/2] MySQL ya esta corriendo en puerto 3310.
)

echo [2/2] Iniciando servidor backend en http://localhost:5000 ...
echo.
echo Presiona Ctrl+C para detener el servidor.
echo El panel de administrador se conectara automaticamente.
echo.
cd /d "%~dp0servidor"
node index.js
pause
