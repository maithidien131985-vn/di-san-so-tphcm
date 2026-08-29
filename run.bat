@echo off
chcp 65001 > nul
title DI SAN SO TP.HCM - DI TICH DINH DOC LAP
color 0A

echo ======================================================================
echo           DI SAN SO TP.HCM - DI TICH DINH DOC LAP
echo                     Dang khoi dong website...
echo ======================================================================
echo.

:: Di chuyen den thu muc du an
d:
cd "D:\KHKT"

:: Kiem tra neu chua co node_modules thi cai dat
if not exist "node_modules" (
    echo [INFO] Dang cai dat cac goi thu vien can thiet...
    call npm install
    echo [OK] Cai dat hoan tat!
    echo.
)

:: Tu dong mo trinh duyet sau 2 giay
echo [INFO] Dang mo website tren trinh duyet tai: http://localhost:5173/
start "" cmd /c "timeout /t 2 /nobreak > nul && start http://localhost:5173/"

:: Khoi chay may chu Vite
echo.
echo ======================================================================
echo   May chu dang hoat dong! (Nhan Ctrl + C trong cua so nay de dung)
echo ======================================================================
echo.

npm run dev -- --host --port 5173
