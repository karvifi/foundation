@echo off
setlocal

if "%~1"=="" (
  echo Usage: run-hook.cmd ^<hook-script.js^>
  exit /b 1
)

set SCRIPT=%~1
set SCRIPT_PATH=%~dp0%SCRIPT%

if not exist "%SCRIPT_PATH%" (
  echo Hook script not found: %SCRIPT_PATH%
  exit /b 1
)

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is required to run hooks.
  exit /b 1
)

node "%SCRIPT_PATH%"
exit /b %errorlevel%
