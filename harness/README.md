# Harness das abordagens A e B

Avalia a tradução Java → JavaScript das 9 samples de DF, igual para A, B (e C): mesmo pré-passo, mesmo gabarito do Java e mesmo avaliador.

| Script | O que faz |
| --- | --- |
| `prepare-samples.js` | Acrescenta o `main` que falta no fim da classe da sample (linhas existentes não se deslocam) e registra cada edição em `EDICOES.csv` |
| `gabarito.js` | Compila e executa as samples no Java (lançador normal, 3 vezes) e marca as que não são comparáveis: sem saída, não determinísticas ou com identidade de objeto da JVM (`Classe@hash`) |
| `evaluate.js` | Nível L1 (gerou `.js`), L2 (executa sem exceção) e L3 (saída idêntica ao gabarito, comparação estrita), em JSONL |
| `run-A.sh` | Abordagem A no container: pré-passo, gabarito, JSweet (várias repetições, com tempo) e avaliação |
| `run-B.sh` | Abordagem B: pega as samples que a A não levou a L3 e chama o Gemini pela API, via `agent-gemini.js` (até 3 rodadas, N repetições), avaliando a cada rodada |
| `docker-run.ps1` | Sobe o container no Windows/PowerShell (`-Modo A` ou `-Modo B`); no Git Bash use o `docker run` abaixo |

## Estado dos testes (03/11/2026)

- **A de ponta a ponta:** `run-A.sh` rodou no Docker (`A-20261102-162118`, 3 repetições): 9/9 em L1 e L2 e 5/6 em L3 nas samples comparáveis. O tempo da repetição 1 saiu negativo (relógio do Docker Desktop); o script foi corrigido para usar `/proc/uptime` e a A deve ser repetida.
- **B de ponta a ponta:** `run-B.sh` rodou com a API do Gemini (`B-20261102-174713`, modelo `gemini-3.8-flash`, temperatura 0). Das 3 repetições, 2 chegaram a L3 e 1 foi invalidada porque a API respondeu 503 em todas as tentativas.
- **Erros da API:** `agent-gemini.js` tenta de novo em 429 e 5xx (até 8 vezes, respeitando o "retry in Xs"). Se não houver resposta, sai com código 3 e a repetição vira `invalida_infra`, fora do `avaliacao.jsonl`. Entre chamadas o `run-B.sh` espera `INTERVALO_S` (13 s) por causa do limite do plano gratuito.
- **Métricas por chamada** (em `chamadas/*.json`): tokens de entrada, de resposta e de raciocínio (o custo é o `totalTokenCount`), `ms` (inclui esperas de retry), `ms_resposta` (latência da última tentativa; só nas execuções feitas depois de 02/11/2026 17:20), hash do prompt, `literal_suspeito` e as tentativas transitórias.
- **Ainda não testado:** `ms_resposta` numa execução real.

Resultados e planilha: `../docs/` e `../estudo/resultados-harness/`.

## Uso

```powershell
cd C:\Users\italo\github\tjtjdf\_publicar\harness
.\docker-run.ps1 -Modo A -Reps 3
$env:GEMINI_API_KEY = "..."   # só para a B; use sua chave
$env:GEMINI_MODEL = "..."     # nome do modelo (veja agent-gemini.js --list)
.\docker-run.ps1 -Modo B -PastaA estudo/resultados-harness/A-<data> -Reps 3
```

`estudo/samples-originais/` (cópia das samples do `conflict-static-analysis` no commit fixado no README da raiz) precisa existir antes.

No Git Bash (a partir de `tjtjdf/`):

```bash
docker build -t tjtjdf-harness _publicar/harness
MSYS_NO_PATHCONV=1 docker run --rm -v "$(pwd -W):/work" -v "$HOME/.m2:/root/.m2" -e REPS=3 tjtjdf-harness bash /work/_publicar/harness/run-A.sh
export GEMINI_API_KEY="..." GEMINI_MODEL="..."
MSYS_NO_PATHCONV=1 docker run --rm -v "$(pwd -W):/work" -v "$HOME/.m2:/root/.m2" -e GEMINI_API_KEY -e GEMINI_MODEL tjtjdf-harness bash /work/_publicar/harness/run-B.sh /work/estudo/resultados-harness/A-<data> 3
```
