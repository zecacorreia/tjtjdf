# Harness das abordagens A e B

Avalia a tradução Java → JavaScript das 9 samples de DF, igual para A, B (e C): mesmo pré-passo, mesmo gabarito do Java e mesmo avaliador.

| Script | O que faz |
| --- | --- |
| `prepare-samples.js` | Acrescenta o `main` que falta no fim da classe da sample (linhas existentes não se deslocam) e registra cada edição em `EDICOES.csv` |
| `gabarito.js` | Compila e executa as samples no Java (lançador normal, 3 vezes) e marca as que não são comparáveis: sem saída, não determinísticas ou com identidade de objeto da JVM (`Classe@hash`) |
| `evaluate.js` | Nível L1 (gerou `.js`), L2 (executa sem exceção) e L3 (saída idêntica ao gabarito, comparação estrita), em JSONL |
| `run-A.sh` | Abordagem A no container: pré-passo, gabarito, JSweet (várias repetições, com tempo) e avaliação |
| `run-B.sh` | Abordagem B: pega as samples que a A não levou a L3 e chama um LLM pela API, via `agent-llm.js` (até 3 rodadas, N repetições), avaliando a cada rodada |
| `resumo.js` | Quadro-resumo de A e B em tabela (para apresentar) |
| `reavaliar.js` | Reexecuta no Node os JS guardados da A e reconstrói o JS da B a partir do `.diff`, comparando com o gabarito do Java (sem Docker nem JSweet) |
| `metricas-B.js` | Relatório de métricas de uma execução B: sucesso, rodadas, tokens, latência, erros da API, literal suspeito |
| `run-C.sh` | Abordagem C: a IA traduz o `Sample.java` direto para JS (`AGENT_MODE=traduzir`, prompts `prompt-C*.txt`); `run-C.sh [reps=3] [rodadas=1]` |
| `comparar.js` | Tabela A × B × C: `node comparar.js <pasta-A> --B pastaB1,pastaB2 --C pastaC1` |
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

## Escolher o modelo (abordagem B e C)

`agent-llm.js` fala com três tipos de API; o provedor e o modelo vêm de variáveis de ambiente, sem mexer em código:

| `LLM_PROVIDER` | Serve para | Chave | Observação |
| --- | --- | --- | --- |
| `gemini` (padrão) | Google Gemini | `GEMINI_API_KEY` | `node agent-llm.js --list` mostra os modelos da chave |
| `anthropic` | Claude | `ANTHROPIC_API_KEY` | Sem plano gratuito; o custo desta B é de centavos |
| `openai` | OpenAI e qualquer API compatível (Groq, OpenRouter, DeepSeek, Mistral, Ollama local) | `OPENAI_API_KEY` ou `LLM_API_KEY` | Nas compatíveis, defina `LLM_BASE`; no Ollama local a chave pode ficar vazia |

Outras variáveis: `LLM_TEMP` (padrão 0; `none` não envia o parâmetro, necessário em alguns modelos de raciocínio), `LLM_MAX_TOKENS` e `LLM_TENTATIVAS`. O campo `uso` das chamadas usa sempre os nomes do Gemini (`promptTokenCount`, `candidatesTokenCount`, `thoughtsTokenCount`, `totalTokenCount`), com a conversão feita para os outros provedores; só o Gemini e os modelos de raciocínio da OpenAI informam tokens de raciocínio separados.

Para comparar B e C, use o mesmo modelo nas duas. Cada troca de modelo é uma execução nova, com provedor, modelo e temperatura gravados em `config.txt`.

Códigos de saída do agente: 3 = API fora do ar (a repetição é invalidada), 4 = erro de configuração (chave ou modelo; a execução é abortada), 5 = cota diária esgotada (a execução é abortada).
