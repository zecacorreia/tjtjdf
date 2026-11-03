# tjtjdf: tradução de testes Java para JavaScript (DataFlow) com JSweet

Estudo que compara três formas de traduzir casos de teste de Java para JavaScript, com foco em casos de DF (Data Flow):

- **A:** só JSweet;
- **B:** JSweet e correção feita por um agente de IA;
- **C:** só IA.

O estudo replica a etapa de tradução do artigo *Semantic conflict detection via dynamic analysis* (Moraes, Borba e Da Silva, SBLP 2024), que trata de overriding assignment (OA). O PDF do artigo não está neste repositório.

## Estado (03/11/2026)

Em andamento. Até agora:

- Os testes de DF do Soot não geram JavaScript no JSweet (dependem de Soot e JUnit); a unidade de tradução do estudo passou a ser as classes `sample`, com o gabarito vindo da execução do Java.
- **A (só JSweet):** rodada no Docker (`estudo/resultados-harness/A-20261102-162118`). As 9 samples transpilam e executam; nas 6 samples com saída comparável, 5 saem idênticas ao Java (L3). Os tempos da repetição 1 são inválidos e a A precisa ser repetida.
- **B (JSweet + IA):** rodada com o Gemini (`gemini-3.8-flash`) em `estudo/resultados-harness/B-20261102-174713`. A IA corrigiu a única sample que a A errava (troca de `print`), nas 2 repetições válidas de 3, com 2.217 a 2.302 tokens por repetição. É uma amostra de uma sample, então prova o harness e as métricas, mas não compara A com B. A pasta `B-20261102-174210` é uma tentativa inválida (erros 503 e 429 da API).
- **C (só IA):** não iniciada.
- Uma B anterior, feita à mão por uma sessão do Claude Sonnet 5.5, não tem as métricas planejadas e não entra na comparação.
- Os scripts de `estudo/js-corrigido/medicao/` foram reexecutados e reproduziram os números do relatório (log em `estudo/resultados/reexecucao-medicao-2026-11-01.txt`).

Próximas decisões: ampliar o conjunto de samples (as de `pessimistic/`) ou usar a reescrita `dataflow` como segunda unidade de tradução; repetir a A para ter tempos válidos; rodar a C.

## Conteúdo

| Pasta | O que tem |
| --- | --- |
| `docs/` | Relatório do estudo (cópia em Markdown do Claude Doc) e a planilha de coleta das abordagens A e B |
| `estudo/js-corrigido/` | JavaScript da reescrita `dataflow` corrigido, `CORRECOES.md` e os scripts de medição (`medicao/`) |
| `estudo/resultados/` | Logs e resumos das execuções |
| `estudo/resultados-harness/` | Saídas do harness: execução A, execução B válida e uma tentativa B inválida (`INVALIDA.txt`) |
| `estudo/*.log` | Logs das execuções do JSweet nos testes de DF e nas samples |
| `jsweet-quickstart/` | `pom.xml` ajustado e a reescrita Java sem Soot (`quickstart/dataflow`), a partir do quickstart do JSweet (Apache-2.0, `LICENSE` incluída) |
| `harness/` | Pré-passo, gabarito do Java, avaliador (L1 a L3) e scripts das abordagens A e B para rodar em Docker (veja `harness/README.md`) |

## Dependências de terceiros (não incluídas)

| Repositório | Commit | Uso |
| --- | --- | --- |
| `spgroup/conflict-static-analysis` | `8ab71e320ec6efff00b2d1bad0f4c38ec56797ac` (19/07/2025) | testes e classes `sample` de DF |
| `amandascm/SCAz.js` | `6b738d2fec297fb9a9f56908fc418a7c838d4c66` (23/10/2024) | implementação do artigo |
| `cincheo/jsweet-quickstart` | `f24110827aaff81933bda5ba303851523d898bf8` (17/03/2022) | base de `jsweet-quickstart/` |

Os dois primeiros repositórios não têm arquivo de licença, por isso o código deles, e os arquivos derivados das samples, não foram copiados para cá.

## Como reproduzir

1. Clone o `conflict-static-analysis` no commit acima e copie as 9 samples de `src/test/java/br/unb/cic/analysis/samples/` para `estudo/samples-originais/`: `ArrayDataFlowSample`, `ArrayIndirectDataFlowSample`, `ConfluenceWithTransitivitySample`, `DoubleSourceSample`, `IntraproceduralDataFlow`, `IntraproceduralIndirectSource`, `SourceSinkMethodCallSample`, `SourceSinkVariableAttributionSample` e `SourceSinkVariableAttributionWithAutoIncrement`.
2. Build do JSweet (3.1.0, `jsweet-core` 6.3.0, Java 11). O `repository.jsweet.org` está fora do ar, então foi preciso:
   - compilar localmente forks de `sourcemap-builder` 1.0.0 e `typescript.java-ts.core` 2.0.3 e instalá-los no `.m2` com essas coordenadas;
   - usar o mirror `https://mavenrepo.ktbyte.com` para o candy `jquery` 1.10.0-20170726 (já configurado no `pom.xml`).
   
   SHA-256 dos jars instalados: `sourcemap-builder-1.0.0.jar` = `080ca4ba974b6259f3a830a5916487eb235ddc52cd5d6962c752c55c7a4100eb`; `typescript.java-ts.core-2.0.3.jar` = `3c8ec7dd1a24742c52bda2233ee13c676080d741d7c4f4550e429867b824a266`. A origem dos forks (URL e commit) ainda precisa ser documentada.
3. Os scripts de medição e o layout que eles esperam estão descritos em `estudo/js-corrigido/CORRECOES.md` (seção "Como reproduzir"). Foram executados com Node 22 e Java 11.

## Licença

Sem licença definida até o momento.
