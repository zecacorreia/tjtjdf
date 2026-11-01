# Correções nos JS gerados pelo JSweet 3.1.0

Data: 01/11/2026. Os arquivos desta pasta são cópias corrigidas; os originais do JSweet não foram alterados.

- `dataflow/`: 8 classes geradas de `quickstart.dataflow` (origem: `jsweet-quickstart/target/js`), mais `dataflow.bundle.js` e `run.js`.
- `samples/`: 9 samples geradas de `estudo/jsweet-samples-js-2026-11-01`.
- `medicao/`: scripts, cenários e saídas usados para medir antes e depois.

## Aviso importante

São remendos no JS gerado. Se você rodar o JSweet de novo, eles são sobrescritos. Para a correção durar, aplique o equivalente no Java (coluna "Correção equivalente no Java").

## O que foi corrigido

| ID | Arquivo | O que mudou | Por que | Correção equivalente no Java |
| --- | --- | --- | --- | --- |
| C1 | `Collector.js`, `ReachDefinitionAnalysis.js` (2 pontos), `TaintedAnalysis.js` (2 pontos) | `s.indexOf(e) == -1` virou `s.findIndex(x => x.equals(e)) == -1` | O JSweet traduziu `HashSet` para array e deduplica por referência, então `equals` nunca era usado. Conflitos e abstrações repetidos ficavam duplicados, e o Java conta 1 onde o JS contava 2 ou mais | Deduplicar por chave de texto (`Set<String>` com `"14-19"`) |
| C2 | `ReachDefinitionAnalysis.js` | `addAll` com `push.apply` virou laço que só insere o que ainda não existe (por `equals`) | `push.apply` junta tudo sem deduplicar, ao contrário de `Set.addAll` | Mesma chave de texto |
| C3 | `ArrayTaintedAnalysisOneConflictDemo.js` | `console.info(c)` virou `console.info(c.toString())` | `System.out.println(objeto)` chama `toString()` no Java; `console.info(objeto)` imprime a estrutura | `System.out.println(c.toString())` |
| C4 | `Conflict.js`, `DataFlowAbstraction.js` | `hashCode` com `Math.imul(...) \| 0` | O `int` do Java envolve em 32 bits; o JS não | Sem mudança necessária no Java |
| C5 | `ArrayTaintedAnalysisOneConflictDemo.js`, novos `dataflow.bundle.js` e `run.js` | Removida a chamada de `main(null)` que rodava ao carregar o arquivo; criados o bundle (ordem de dependência, com `main`) e o `run.js` | Com `module = none`, carregar em ordem alfabética executava o `main` antes de `Collector` existir (`TypeError`) | Gerar com `module = commonjs`, ou usar bundle |
| S1 | `IntraproceduralIndirectSource.js` | `console.info(y)` da linha 12 virou `process.stdout.write(String(y))` (com `console.info` como alternativa fora do Node) | `System.out.print` não quebra linha; `console.info` sempre quebra | Trocar `print` por `println` na sample, ou comparar a saída ignorando quebras |
| S2 | 6 samples (`Confluence...`, `SourceSinkMethodCall`, `IntraproceduralDataFlow`, `IntraproceduralIndirectSource`, `SourceSinkVariableAttributionSample`, `...WithAutoIncrement`) | Acrescentada ao fim do arquivo a chamada do método de entrada (`foo()`; `m()` e `a()` em `IntraproceduralIndirectSource`) | Sem `main`, o JS só declarava a classe e nada executava. É o passo 3 do estudo, feito à mão | Adicionar `main` nas samples |

Volume: `dataflow/` teve 12 linhas trocadas por 12, mais 2 arquivos novos; `samples/` teve 1 linha trocada e 6 acrescentadas.

## O que melhorou (mesmo teste, antes e depois)

| Medição | Antes | Depois |
| --- | --- | --- |
| Saída do demo igual à do Java (4 linhas) | 2 de 4 linhas iguais | 4 de 4 |
| Carga dos arquivos em ordem alfabética | `TypeError: Cannot read properties of undefined (reading 'instance')` | Carrega e o demo imprime `PASS` |
| `Conflict(100000000, 1).hashCode()` (Java: -1194967295) | 3100000001 | -1194967295 |
| 1000 CFGs aleatórios, `TaintedAnalysis`, conflitos iguais ao Java | 769 de 1000 (231 divergentes) | 1000 de 1000 |
| 1000 CFGs aleatórios, `ReachDefinitionAnalysis`, conflitos iguais ao Java | 863 de 1000 (137 divergentes) | 1000 de 1000 |
| 9 samples com saída igual à do Java ao executar o arquivo | 5 de 9 (2 delas vazias) | 9 de 9 (2 delas vazias) |

Os 1000 cenários (`medicao/scen.txt`, semente fixa) têm 4 a 8 instruções, variáveis repetidas em `defs` e `uses`, 1 ou 2 sources e 1 ou 2 sinks. Em 382 deles o Java encontra algum conflito no Tainted e em 286 no Reach.

## O que não foi corrigido

- **`DoubleSourceSample`**: a referência do Java foi rodada com `args = null` para ficar determinística. Com o lançador normal do Java, `println(args)` imprime `[Ljava.lang.String;@<hash>`, que muda a cada execução e não existe em JS. A saída só é comparável se a sample deixar de imprimir o array.
- **Semântica da reescrita Java**: a diferença para o original (a origem de um conflito propagado é a instrução propagadora, a linha 19 usa `arr` em vez de `a`, o laço colapsado) está no código Java, não na tradução. Corrigir o JS não a resolve.
- **Ordem de iteração do conjunto**: o JS mantém a ordem de inserção e o `HashSet` do Java segue o hash. A medição compara os conflitos ordenados.
- **Mapa de linhas Java para JS** (por exemplo, `ArrayDataFlowSample`: 12, 14, 16, 19 viram 15, 16, 17, 20): não foi gerado.
- **Os 13 testes Soot de DF**: continuam sem JS (265 erros por dependência de Soot e JUnit).

## Como reproduzir

Os scripts em `medicao/` esperam o layout `W/orig/{dataflow,samples}`, `W/fixed/...` e `W/harness/`. O Java de referência é compilado a partir de `quickstart.dataflow` (`RandDrv.java`) e de `br.unb.cic.analysis.samples` (`Drv2.java`). `patch.js` reaplica as correções C1 a C5, S1 e S2 sobre uma cópia dos JS originais.
