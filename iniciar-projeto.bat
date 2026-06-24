@echo off
cd /d "%~dp0"
set "NODE_EXE=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"

if exist "%NODE_EXE%" (
  "%NODE_EXE%" node_modules\vite\bin\vite.js --host 127.0.0.1
) else (
  npx vite --host 127.0.0.1
)
