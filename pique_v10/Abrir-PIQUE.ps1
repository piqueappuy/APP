$ErrorActionPreference = 'Stop'
$bundledPython = 'C:\Users\Usuario\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe'
$pythonCommand = Get-Command python -ErrorAction SilentlyContinue
$pythonExecutable = if (Test-Path -LiteralPath $bundledPython) { $bundledPython } elseif ($pythonCommand) { $pythonCommand.Source } else { throw 'Se necesita Python para iniciar la vista local. También podés abrir preview/index.html.' }
$previewDirectory = Join-Path $PSScriptRoot 'preview'
$previewLog = Join-Path $env:TEMP 'pique-preview.log'
$previewErrorLog = Join-Path $env:TEMP 'pique-preview-errors.log'
try {
    $response = Invoke-WebRequest -Uri 'http://127.0.0.1:8765' -UseBasicParsing -TimeoutSec 2
    if ($response.Content -notmatch 'PIQUE') { throw 'El puerto 8765 está ocupado por otra aplicación.' }
} catch {
    if ($_.Exception.Message -match 'ocupado') { throw }
    Start-Process -FilePath $pythonExecutable -ArgumentList @('-m','http.server','8765','--bind','127.0.0.1','--directory', ('"' + $previewDirectory + '"')) -WindowStyle Hidden -RedirectStandardOutput $previewLog -RedirectStandardError $previewErrorLog
    Start-Sleep -Milliseconds 800
}
Start-Process 'http://127.0.0.1:8765'
