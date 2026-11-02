# Harness das abordagens A e B

Avalia a tradução Java → JavaScript das 9 samples de DF, igual para A, B (e C): mesmo pré-passo, mesmo gabarito do Java e mesmo avaliador.

| Script | O que faz |
| --- | --- |
| `prepare-samples.js` | Acrescenta o `main` que falta no fim da classe da sample (linhas existentes não se deslocam) e registra cada edição em `EDICOES.csv` |
| `gabarito.js` | Compila e executa as samples no Java (lançador normal, 3 vezes) e marca as que não são comparáveis: sem saída, não determinísticas ou com identidade de objeto da JVM (`Classe@hash`) |
| `evaluate.js` | Nível L1 (gerou `.js`), L2 (executa sem exceção) e L3 (saída idêntica ao gabarito, comparação estrita), em JSONL |
| `run-A.sh` | Abordagem A no container: pré-passo, gabarito, JSweet (várias repetições, com tempo) e avaliação |
| `run-B.sh` | Abordagem B: pega as samples que a A não levou a L3 e chama a CLI do Claude (até 3 rodadas, N repetições), avaliando a cada rodada |
| `docker-run.ps1` | Sobe o container no Windows (`-Modo A` ou `-Modo B`) |

## Estado dos testes (02/11/2026)

- **A de ponta a ponta:** `run-A.sh` rodou no Docker (execução `A-20261102-162118`, 3 repetições): 9/9 em L1 e L2 e 5/6 em L3 nas samples comparáveis. O tempo da repetição 1 saiu negativo (relógio do Docker Desktop); o script foi corrigido para usar `/proc/uptime` e a A deve ser repetida.
- **Testados só no encadeamento, com substitutos para `mvn` e `claude`:** `run-B.sh`.
- **Não testados:** a chamada real à CLI do Claude (flags `-p`, `--output-format json`, `--allowedTools` e formato do JSON de saída a conferir) e a instalação da CLI no `Dockerfile`.

Resultados e planilha: `../docs/`.

## Uso

```powershell
cd C:\Users\italo\github\tjtjdf\_publicar\harness
.\docker-run.ps1 -Modo A -Reps 3
$env:ANTHROPIC_API_KEY = "..."   # só para a B; use sua chave
.\docker-run.ps1 -Modo B -PastaA estudo/resultados-harness/A-<data> -Reps 3
```

`estudo/samples-originais/` (cópia das samples do `conflict-static-analysis` no commit fixado no README da raiz) precisa existir antes.
