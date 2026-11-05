# Uso (PowerShell):  .\docker-run.ps1 -Modo A [-Reps 3]   |   .\docker-run.ps1 -Modo B -PastaA estudo/resultados-harness/A-... [-Reps 3]
# Monta a pasta do projeto em /work e o ~/.m2 do host (com os forks do JSweet) em /root/.m2. NÃO TESTADO (sem Docker no ambiente do teste).
param([ValidateSet('A','B')][string]$Modo = 'A', [int]$Reps = 3, [string]$PastaA = '')
$root = (Resolve-Path "$PSScriptRoot\..\..").Path
docker build -t tjtjdf-harness $PSScriptRoot
$m2 = Join-Path $env:USERPROFILE '.m2'
if ($Modo -eq 'A') {
  docker run --rm -v "${root}:/work" -v "${m2}:/root/.m2" -e REPS=$Reps tjtjdf-harness bash /work/_publicar/harness/run-A.sh
} else {
  if (-not $PastaA) { throw 'informe -PastaA (pasta de resultados da execução A, relativa a tjtjdf)' }
  docker run --rm -v "${root}:/work" -v "${m2}:/root/.m2" -e LLM_PROVIDER=$env:LLM_PROVIDER -e LLM_MODEL=$env:LLM_MODEL -e LLM_BASE=$env:LLM_BASE -e LLM_TEMP=$env:LLM_TEMP -e GEMINI_API_KEY=$env:GEMINI_API_KEY -e ANTHROPIC_API_KEY=$env:ANTHROPIC_API_KEY -e OPENAI_API_KEY=$env:OPENAI_API_KEY -e LLM_API_KEY=$env:LLM_API_KEY tjtjdf-harness bash /work/_publicar/harness/run-B.sh "/work/$PastaA" $Reps
}
