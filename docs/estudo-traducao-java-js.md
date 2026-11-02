# Estudo: tradução de testes Java para JavaScript (casos de DF)

## O que o artigo fez

O artigo "Semantic conflict detection via dynamic analysis" (Moraes, Borba e Da Silva, SBLP 2024) traduziu 71 testes de Java para JavaScript com JSweet e os executou com Jest, em seis etapas:

1. Pegou os casos de teste em Java do repositório de análise estática (Barbosa et al.), onde cada classe é um cenário de merge com comentários marcando as linhas de `Left` e `Right`.
2. Passou cada classe Java pelo JSweet (na plataforma online) e obteve um `.js` por caso.
3. Garantiu que cada `.js` tinha um `main` sendo invocado. Quando a classe Java não tinha `main`, adicionaram à mão, porque a análise dinâmica só vê o que é executado.
4. Gerou à mão, para cada caso, um JSON de mapeamento linha → branch (L/R), a partir dos comentários.
5. Fez uma verificação conceitual do resultado esperado de cada caso.
6. Rodou tudo com Jest e classificou os casos em divergência de transpilação (2), conceitualmente adaptados (14) e sucesso (55).

## Como adaptar para DF

O estudo compara três abordagens de tradução sobre o mesmo conjunto de casos de DF (Data Flow), com o mesmo gabarito e as mesmas métricas: A (só JSweet), B (JSweet + agente de IA corrigindo) e C (só IA).

1. Obter os casos de DF. O artigo aponta o repositório `spgroup/conflict-static-analysis`, na pasta `src/test/java/.../analysis/samples/`. O caso de OA fica em `ioa`; os testes de DF ficam no pacote `df` e usam como alvo as classes de `samples` (veja a seção Primeira execução). Liste quantos casos há e congele essa lista como conjunto de estudo, anotando o commit usado. Exclua a ContainmentSample (caso de OA que usa a classe Point sem declará-la) e avalie ampliar o conjunto com as samples de pessimistic/ (até 6 a mais), porque só 6 samples têm saída comparável (veja a seção Reexecução de medicao/).
2. Fixar o gabarito antes de traduzir. Para cada caso, registre o resultado esperado (há interferência DF ou não, e entre quais linhas), a partir das asserções dos testes em Java. Ele precisa existir antes das três abordagens para não haver viés.
3. Definir as métricas e preparar as samples. Use as métricas da tabela abaixo e a mesma definição de "equivalente" nas três abordagens: mesma saída de execução entre o Java e o JavaScript. Declare duas limitações: as samples sem saída (2 de 9) só chegam ao nível "executa", e a `DoubleSourceSample` imprime um hash de array que muda a cada execução, então fica fora da comparação de saída (ou tem o `println(args)` removido antes). Antes de qualquer abordagem, adicione no Java o `main` que falta nas samples, do mesmo jeito para A, B e C, e registre cada edição. Assim a comparação mede a qualidade da tradução, não essa preparação.
4. Abordagem A, só JSweet. Rode o JSweet nas samples já preparadas (com `main` no Java); para escala, prefira o JSweet via linha de comando/Maven em vez do sandbox online. Guarde o `.js` bruto e o log de erros, sem corrigir nada à mão. Execute e registre: gerou? rodou? saída igual? Registre à parte as diferenças de semântica que o JSweet deixa passar, como `print` virando `console.info` e `println` de objeto sem `toString()`.
5. Abordagem B, JSweet + agente de IA. Parta do `.js` bruto da abordagem A, só das samples cuja saída divergiu. Dê ao agente o Java original, o JS gerado, a divergência observada e o resultado esperado. Peça a correção só do JavaScript, sem alterar a sample Java nem acrescentar o `main` (já feito no pré-passo), para que o esforço medido seja o da correção. Itere com limite fixo (por exemplo, no máximo 3 rodadas por caso) e pare quando a saída bater. Registre rodadas, tempo, tokens, o prompt usado e se foi uma única sessão.
6. Abordagem C, só IA. Dê ao agente apenas a sample Java já preparada (com `main`) e um prompt padronizado, o mesmo para todos os casos. Sem JSweet e sem correção iterativa: uma tentativa, para ser comparável. Se quiser, faça uma variante C2 com correção iterativa e reporte separada.
7. Rodar tudo sob o mesmo harness. Use o mesmo Jest e a mesma versão do Node nas três abordagens. Execute cada caso mais de uma vez para a IA, que é não determinística (3 a 5 repetições, reportando a variação), e fixe a versão do modelo e os parâmetros.
8. Analisar. Monte a tabela caso × abordagem × métrica e compare taxas de sucesso, esforço e custo. Olhe também onde cada abordagem falha (construções Java que o JSweet não trata, alucinações da IA etc.); isso rende a seção de discussão.

### Métricas

| Métrica | Como medir |
|---|---|
| Traduz sem erro | O `.js` gerado faz parse e executa no Node |
| Preserva a semântica | A execução produz o resultado esperado do passo 2 |
| Esforço manual | Número de edições humanas (ou linhas alteradas) por caso |
| Iterações | Rodadas de correção por caso (abordagem B) |
| Tempo | Tempo de relógio por caso |
| Custo | Tokens/chamadas de IA (abordagens B e C) |

## Primeira execução (29/10/2026)

A primeira tentativa mostrou que os 13 arquivos de DF são testes do Soot que o JSweet não consegue traduzir, então a unidade de tradução do estudo deve ser a classe `sample`, e não o teste.

### Build do JSweet quebrado

O `mvn generate-sources` falhava porque `repository.jsweet.org`, único repositório que hospedava duas dependências do plugin, está fora do ar (o domínio responde com outro servidor, com certificado de outro site). O contorno aplicado, sem tocar em nenhum teste:

- Compilar localmente forks do GitHub de `sourcemap-builder:1.0.0` e `typescript.java-ts.core:2.0.3` e instalá-los no `.m2` local, com as coordenadas exatas que o `jsweet-maven-plugin` espera.
- Adicionar o mirror `mavenrepo.ktbyte.com` no `pom.xml` para resolver a dependência `jquery` (candy do JSweet), que também só existia no repositório morto.

Isso afeta a reprodutibilidade do estudo: registre as versões e a origem exata dos forks. O fork do plugin mantido pela Apitomy diz, no README, publicar no Maven Central (`io.apitomy`) sem repositórios customizados; não testei se ele evita esse contorno, mas vale tentar antes de repetir o processo em outra máquina.

### Ambiente registrado

Valores lidos da pasta `tjtjdf` em 29/10/2026. Falta a origem exata dos dois forks, que estão no `.m2` e não nessa pasta.

| Item | Valor |
|---|---|
| Projeto base | `cincheo/jsweet-quickstart`, commit `f241108` (17/03/2022), com alterações locais no `pom.xml` |
| Transpilador (`jsweet-maven-plugin`) | 3.1.0 |
| `jsweet-core` | 6.3.0 |
| Candy `jquery` | 1.10.0-20170726, via mirror `https://mavenrepo.ktbyte.com` |
| Java | release 11 |
| Saída | JavaScript ES6 em `target/js` (`module` = none); TypeScript em `target/ts` |
| Forks no `.m2` | `sourcemap-builder` 1.0.0 e `typescript.java-ts.core` 2.0.3; instalados localmente em 29/10/2026 (11:00 e 11:03, horário de Brasília), compilados com JDK 21; repositório de origem e commit não constam no .m2 (pendente) |
| Casos de teste | `spgroup/conflict-static-analysis`, commit `8ab71e3` (19/07/2025) |
| Referência do artigo | `amandascm/SCAz.js`, commit `6b738d2` (23/10/2024) |

Duas observações: o `pom.xml` ainda lista os repositórios mortos de `repository.jsweet.org` ao lado do mirror, e o artigo cita o commit `2f481eb58b` dos testes de OA, enquanto o clone atual é de 2025, então confirme se as samples de DF mudaram entre as duas versões.

Artefatos instalados no `.m2` (`org/jsweet/ext`), para conferir se outra máquina reproduz os mesmos binários:

| Artefato | Instalado em (Brasília) | SHA-256 do `.jar` |
|---|---|---|
| `sourcemap-builder` 1.0.0 | 29/10/2026, 11:00 | `080ca4ba974b6259f3a830a5916487eb235ddc52cd5d6962c752c55c7a4100eb` |
| `typescript.java-ts.core` 2.0.4 | 29/10/2026, 11:01 | `2c3866cebc9f3965bbf4bf0328abc884674f89d108aa66296d52f1b3351558c6` |
| `typescript.java-ts.core` 2.0.3 | 29/10/2026, 11:03 | `3c8ec7dd1a24742c52bda2233ee13c676080d741d7c4f4550e429867b824a266` |

O que dá para afirmar a partir desses arquivos:

- Os três foram instalados localmente (existe `maven-metadata-local.xml` e nenhum repositório remoto registrado), com Maven JAR Plugin 3.4.1 e JDK 21, apesar de os `pom.xml` pedirem release 11.
- Os `pom.xml` da 2.0.3 e da 2.0.4 são idênticos, exceto pela versão, e os jars têm 261567 e 261568 bytes. Isso sugere que a 2.0.4 foi construída primeiro e depois reinstalada com a versão 2.0.3 para casar com a coordenada que o plugin exige; é inferência, não está registrado.
- Os `pom.xml` não têm `scm` nem URL do projeto, e os fontes não trazem o endereço do fork. A URL do repositório e o commit de cada fork precisam vir de você (ou do `git log -1` dentro dos clones).

### O que os 13 arquivos são

Cada arquivo configura uma análise do Soot (linhas de source e sink, classe alvo) e a executa sobre o bytecode de uma classe `sample` compilada em `target/test-classes`. O resultado esperado existe só em asserções comentadas, exceto em `ContainmentConflictTest`. Os testes ficam no pacote `br.unb.cic.analysis.df`; as classes alvo, em `br.unb.cic.analysis.samples`.

| Teste (sem o sufixo Test) | Classe sample | Análise | Source | Sink | Esperado |
|---|---|---|---|---|---|
| ArrayTaintedAnalysisOneConflictIndirect | ArrayIndirectDataFlowSample | TaintedAnalysis | 8 | 10, 12 | 2 |
| ArrayTaintedAnalysisOneConflict | ArrayDataFlowSample | TaintedAnalysis | 14 | 16, 19 | 2 |
| ConfluenceWithTransitivity | ConfluenceWithTransitivitySample | ConfluentTaintedAnalysis | 9 | 13 | 1 |
| ContainmentConflict | ioa.ContainmentSample | DFPInterProcedural | 7 | 9 | ≥ 1 (único ativo) |
| ReachDefinitionAnalysisOneConflict | IntraproceduralDataFlow | ReachDefinitionAnalysis | 6 | 11 | 1 |
| ReachDefinitionAnalysisTransitiveSourceNoConflict | IntraproceduralIndirectSource | ReachDefinitionAnalysis | 7 | 12 | 0 |
| ReachDefinitionAnalysisZeroConflict | IntraproceduralDataFlow | ReachDefinitionAnalysis | 19 | 26 | 0 |
| SourceSinkConfluenceAnalysisMethodCall | SourceSinkMethodCallSample | ConfluentAnalysis | 8 | 10 | 1 |
| SourceSinkConfluenceAnalysisOneConflict | DoubleSourceSample | ConfluentAnalysis | 8 | 12 | 1 |
| SourceSinkConfluenceAnalysisVariableAttribution | SourceSinkVariableAttributionSample | ConfluentAnalysis | 18 | 20 | 1 |
| SourceSinkVariableAttributionWithAutoIncrementConfluent | SourceSinkVariableAttributionWithAutoIncrement | ConfluentAnalysis | 9 | 11 | 0 |
| SourceSinkVariableAttributionWithAutoIncrementTaintedConfluent | SourceSinkVariableAttributionWithAutoIncrement | ConfluentTaintedAnalysis | 9 | 11 | 1 |
| TaintedAnalysisOneConflict | IntraproceduralIndirectSource | TaintedAnalysis | 7 | 12 | 1 |

O que a tabela revela:

- São 13 testes para 10 classes sample distintas.
- A mesma sample muda de resultado conforme a análise: `IntraproceduralIndirectSource` dá 0 com ReachDefinition e 1 com Tainted; `SourceSinkVariableAttributionWithAutoIncrement` dá 0 com Confluent e 1 com ConfluentTainted. Portanto o gabarito é a tupla (sample, análise, source, sink), não só a sample.
- Os nomes enganam: os dois `ArrayTaintedAnalysisOneConflict*` esperam 2 conflitos, e `...AutoIncrementConfluent` espera 0.
- `ContainmentConflictTest` usa uma sample do pacote `ioa`, então filtre os casos de DF pela análise e não só pela pasta.

### Por que os testes não são traduzíveis

Os testes dependem de `PackManager`, `Body`, `Transform`, `SootWrapper` e `Main.main` do Soot, além de JUnit, e trabalham sobre o bytecode `.class` compilado. JavaScript não tem equivalente de bytecode da JVM, então a falha do JSweet (177 erros na primeira execução e 151 na reexecução de 01/11/2026, sem contar os testes de pessimistic/) é estrutural e não pontual.

No artigo de OA, o que foi traduzido foram as classes de exemplo, anotadas com `Left` e `Right`; a análise em si foi reescrita em JavaScript (Jalangi2). A analogia para DF é traduzir as classes `sample` e usar os testes apenas como fonte do gabarito: linhas de source e sink e contagem esperada. Isso é inferência a partir dos nomes das classes e do campo `targetClass`; confirme abrindo as 10 samples em `src/test/java/.../analysis/samples/`, que eu não vi.

### O que o agente fez e como classificar

O agente não converteu os testes: escreveu uma versão simplificada que reproduz o algoritmo sem o Soot e transpilou essa versão. `Unit` virou `Stmt` (linha mais listas de def/use como `String`), `AbstractMergeConflictDefinition` virou `MergeConflictDefinition`, o motor de ponto fixo do `ForwardFlowAnalysis` virou um laço simples em `doAnalysis()`, e o CFG da `ArrayDataFlowSample` foi escrito à mão em `buildArrayDataFlowSampleCfg()`. Resultado: `Conflicts found: 2 - PASS`.

Como registrar isso no estudo:

- Abordagem A (só JSweet): resultado "não traduzível" para os testes. A versão reescrita não conta como saída do JSweet, porque é reescrita manual do algoritmo.
- Validade do PASS: o 2 foi calculado à mão (source na linha 14, sinks nas linhas 16 e 19) e bate com a asserção comentada, mas o CFG é fixo no código. O PASS mostra que o algoritmo simplificado é consistente, não que a tradução preserva o comportamento da sample original.
- Laço colapsado: o corpo do `for` virou uma única statement. Se a sample original tem laço, isso remove a construção que o caso exercita.
- Escala: a versão só funciona para um cenário; cada novo caso exigiria escrever o CFG à mão.

### Decisões em aberto

- Unidade de tradução: classes `sample` (recomendado, pelo que o artigo fez) ou os testes. Com os testes, a abordagem A falha em 100% dos casos e a comparação perde sentido.
- Critério de equivalência: (a) mesma saída de execução em Java e em JavaScript, que exige `main` e saída observável em cada sample; (b) um verificador de DF em JavaScript que confirme que a definição na linha do source alcança o uso na linha do sink; ou (c) ambos. A opção (a) mede fidelidade da tradução independentemente de análise; a (b) é o análogo do artigo.
- Mapeamento de linhas: source e sink estão em linhas do Java, que mudam após a tradução. Se usar (b), é preciso um mapa linha Java → linha JavaScript, como o JSON manual do artigo.

## Abordagens A e B: primeiros resultados (01/11/2026)

A rodada de 01/11, feita por uma sessão do Claude Sonnet 5.5, confirmou que os testes de DF não são traduzíveis e que as 9 samples transpilam, mas parte dos números não serve como resultado da abordagem B e precisa ser refeita. Os valores vêm de um relatório gerado por essa sessão e ainda não foram reexecutados por você: rode os scripts de `medicao/` antes de citá-los.

### O que aproveitar

- Testes de DF: 0 de 15 arquivos geram JavaScript (265 erros); nos 13 testes do estudo são 151 erros (10 a 19 por arquivo, `ContainmentConflictTest` com 19). A causa é estrutural: dependência de Soot, JUnit e pacotes do projeto.
- Tabela dos 13 testes: confere 13 de 13 com os arquivos de teste. Os dois testes de `pessimistic/` ficaram fora: `PessimisticTaintedAnalysisTest` tem 13 casos comentados sobre 6 samples (candidatos a ampliar o conjunto) e `PessimisticTaintedAnalysisAbstractionTest` testa objetos Jimple, sem sample.
- Samples: as 9 transpilam sem erro (5,5 s). O JavaScript tem 317 linhas contra 152 do Java, e as linhas se deslocam (em `ArrayDataFlowSample`, 12, 14, 16 e 19 viram 15, 16, 17 e 20), então o mapa de linhas continua necessário e ainda não foi gerado.
- Reescrita do agente × original, por leitura do código (o Soot não foi executado): a reescrita difere em três pontos de semântica e cobre só 1 dos 13 casos. O principal: o original grava como origem a instrução que propaga o taint, não o source, então para `ArrayDataFlowSample` o esperado seria (14→16) e (18→19), e não (14→16) e (14→19).
- Comportamentos do JSweet para a discussão: `print` vira `console.info` (com quebra de linha); `println` de array ou objeto não chama `toString()`; `HashSet` vira array comparado por referência, ignorando `equals` e `hashCode`; com `module = none`, a ordem de carga dos arquivos importa.

### Samples: saída Java × JavaScript

| Sample | Tem `main` | Saída |
|---|---|---|
| ArrayDataFlowSample | sim | igual |
| ArrayIndirectDataFlowSample | sim | igual |
| ConfluenceWithTransitivitySample | não | igual |
| DoubleSourceSample | sim | diferente (`println` de array) |
| IntraproceduralDataFlow | não | igual |
| IntraproceduralIndirectSource | não | diferente em `m` (`print` sem quebra de linha) |
| SourceSinkMethodCallSample | não | igual |
| SourceSinkVariableAttributionSample | não | igual, sem saída |
| SourceSinkVariableAttributionWithAutoIncrement | não | igual, sem saída |

Nas seis samples sem `main`, a comparação foi feita depois de a IA acrescentar ao JavaScript a chamada do método de entrada.

### Por que não valem como resultado da B

- Mistura de artefatos: as correções C1 a C5 (divergências de 231 para 0 e de 137 para 0 em 1000 cenários) são sobre a reescrita `dataflow` do agente anterior, não sobre as samples. Nas 9 samples, a B se resume a duas intervenções: a troca de `print` na `IntraproceduralIndirectSource` e a chamada de entrada nas seis samples sem `main`. Trate a reescrita como estudo de caso à parte ou deixe-a de fora.
- "9 de 9" inflado: duas samples não imprimem nada, e `DoubleSourceSample` só bate com o Java porque a referência foi rodada com `args = null`. Sem essas três, são 6 de 9 comparações não triviais. O relatório também traz duas medidas diferentes (8 de 10 pontos de entrada via driver; 5 de 9 para 9 de 9 ao executar o arquivo): escolha uma como baseline.
- Onde contar o `main`: no plano, adicionar `main` era esforço manual da A, feito no Java; aqui a IA o fez no JavaScript. Defina a regra: A = edição humana mínima no Java, B = correção feita pela IA depois do JSweet. Sem isso, A e B não são comparáveis.
- Ambiente: os resultados vêm do ambiente da IA (Linux, Maven 3.9.11, Java 11, cópia do seu `.m2`), e os seus logs `A-bruto-*` falharam por `JAVA_HOME not found`. Refaça a A na sua máquina ou registre que os dados são do ambiente da IA.
- Métricas da B ausentes: faltam rodadas, tokens, tempo, o prompt usado e se foi uma única sessão.

### Reexecução de `medicao/` (01/11/2026)

Reexecutei os scripts de `medicao/` do zero e os números do relatório foram reproduzidos; o que muda é como lê-los. O ambiente foi a VM Linux do app Claude desktop (Node 22.23.4, Java 11.0.32.1), não o seu Windows. Partiu dos JS originais do JSweet (`target/js` e `jsweet-samples-js-2026-11-01`), recompilou o Java de referência e reaplicou o `patch.js`. O log está em `estudo/resultados/reexecucao-medicao-2026-11-01.txt`.

| Medição | Relatório | Reexecução |
|---|---|---|
| Cenários divergentes do Java, `TaintedAnalysis` (de 1000) | 231 → 0 | 231 → 0 |
| Cenários divergentes do Java, `ReachDefinitionAnalysis` (de 1000) | 137 → 0 | 137 → 0 |
| Cenários com conflito no Java | 382 (Tainted), 286 (Reach) | 382, 286 |
| Demo igual ao Java | não → sim | não → sim |
| Carga em ordem alfabética | TypeError → OK | TypeError → OK |
| `hashCode` de `Conflict(100000000, 1)` | 3100000001 → -1194967295 | 3100000001 → -1194967295 |
| Samples com saída igual ao Java | 5 → 9 de 9 (2 vazias) | 5 → 9 de 9 (2 vazias) |
| Saídas guardadas em `medicao/*.out` | — | idênticas (6 arquivos) |
| Linhas não vazias, JS × Java | 317 × 152 | 317 × 151 |

Não reexecutei o JSweet, então os 265 erros nos testes e a medida de "8 de 10 pontos de entrada" continuam sem reprodução própria.

O que a reexecução muda na leitura dos resultados:

- Os 1000 cenários medem a reescrita, não as samples: o Java de referência é a reescrita `dataflow` (sem Soot). O resultado vale como fidelidade do JSweet sobre esse código, não como resultado da abordagem B nas samples.
- Só 6 samples são comparáveis: duas não imprimem nada, e `DoubleSourceSample` só bate com o Java porque o driver passa `args = null`. Com o lançador normal do Java, ela imprime `[Ljava.lang.String;@<hash>`, que muda a cada execução. Nas 6 comparáveis, 2 já eram iguais antes das edições (`ArrayDataFlowSample` e `ArrayIndirectDataFlowSample`) e as 6 ficam iguais depois.
- As edições da B são quase todas passo de preparação: 4 samples só precisaram da chamada do método de entrada (o `main` que o estudo manda adicionar), e `IntraproceduralIndirectSource` precisou também da troca de `print`. A única diferença real de semântica do JSweet nas samples é `print` virar `console.info`.
- Mapa de linhas confirmado: em `ArrayDataFlowSample`, as linhas 12, 14, 16 e 19 do Java viram 15, 16, 17 e 20 no JavaScript.

Ajustes sugeridos ao estudo:

- Tratar o `main` como pré-passo igual para A, B e C, feito no Java antes de qualquer abordagem. Assim a comparação mede a qualidade da tradução.
- Ampliar o conjunto com as samples de `pessimistic/` (até 6 a mais), porque 6 comparáveis dão pouca resolução entre A, B e C.
- Para as samples sem saída, usar o verificador de DF em JavaScript ou excluí-las do critério "saída igual", declarando isso.

### Próximos passos desta rodada

1. Corrigir o `JAVA_HOME` e refazer a A na sua máquina, com a regra do `main` definida acima, registrando as edições manuais na planilha.
2. Refazer a B só sobre as 9 samples, com as métricas do item anterior.
3. Reexecutar `medicao/` antes de citar qualquer número do relatório.
4. Só então rodar a C, com o mesmo critério de equivalência.

## Baseline da abordagem A no Docker (02/11/2026)

A A foi rodada de ponta a ponta num container (`maven:3.9-eclipse-temurin-11` + Node 22), com o harness em `_publicar/harness/`. Ambiente: openjdk 11.0.32.1, Maven 3.9.16, Node v22.23.4. Execução `A-20261102-162118`, 3 repetições; o JS gerado foi idêntico nas 3.

### Como a medição é feita

- Unidade de tradução: as 9 classes `sample` de DF (a `ioa.ContainmentSample` fica fora, por ser de OA). Os testes em si não transpilam (dependem de Soot e JUnit) e só fornecem o gabarito.
- Pré-passo igual para A, B e C: acrescenta um `main` no fim da classe da sample quando ela não tem um; cada edição é registrada em `EDICOES.csv`. A B corrige só o JavaScript.
- Gabarito: cada sample roda 3 vezes no Java. Fica marcada como não comparável se não tiver saída, se a saída variar entre execuções ou se tiver identidade de objeto da JVM (`Classe@hash`).
- Níveis: L1 gerou o `.js`; L2 executa sem exceção; L3 saída idêntica à do Java, comparação estrita.

### Resultado da A

- L1 e L2: 9 de 9.
- Comparáveis: 6 de 9. Ficam de fora a `DoubleSourceSample` (imprime hash de objeto, que muda entre máquinas) e as duas `SourceSinkVariableAttribution*` (sem saída, só chegam a L2).
- L3 nas comparáveis: 5 de 6 (83,3%).
- Única falha: `IntraproceduralIndirectSource`. A linha 2 sai `12` no Java e `1` no JS, porque o `print` do Java vira `console.info`, que quebra a linha.
- Tempo: repetições 2 e 3 levaram cerca de 6,3 s com Maven. A repetição 1 saiu negativa (ajuste de relógio do Docker Desktop) e foi descartada; o `run-A.sh` já usa `/proc/uptime`, mas a A precisa ser repetida para ter os três tempos válidos.

### Limite desta baseline

Com o `main` no pré-passo, a B tem uma única sample para corrigir. Isso testa a CLI e as métricas, mas não dá poder estatístico para comparar A × B. As saídas possíveis são ampliar o conjunto (samples de `pessimistic/`) ou usar a reescrita `dataflow` como segunda unidade de tradução.

### O que falta para executar a B

- Definir `ANTHROPIC_API_KEY` no terminal onde o container sobe.
- Instalar a CLI do Claude no container e conferir as flags com `claude --help`: o `run-B.sh` assume `-p`, `--output-format json` e `--allowedTools`.
- Conferir o formato do JSON de saída para extrair tokens e custo.
- Fixar o modelo (`CLAUDE_MODEL`) e registrar o hash do prompt, que o script já grava.
- Decidir o conjunto antes de rodar para valer, porque com 1 sample o resultado não conclui nada.

### O que falta para fechar a A

- Repetir a A com o `run-A.sh` corrigido, para ter os tempos válidos.
- Registrar as versões e a origem (URL e commit) dos forks `sourcemap-builder` e `typescript.java-ts.core`, que ainda não foram achadas.
- Decidir o conjunto final (opção 1 ou 2) e a licença do repositório.

## Ameaças à validade

Quatro pontos merecem ser reconhecidos no texto do estudo:

- Contaminação: os casos são públicos e a IA pode tê-los visto no treino.
- Mapeamento de linhas: no artigo ele foi manual. Decida se você também o fará à mão ou se o automatiza, e trate-o igual nas três abordagens.
- Definição de "equivalente": é subjetiva, por isso deve ser fixada no passo 3.
- Tamanho da amostra: se houver poucos casos de DF, use estatística descritiva e evite generalizar.

## Próximos passos

O próximo passo é montar o esqueleto do estudo:

- [ ] Script que roda o JSweet em lote sobre os casos de DF
- [ ] Planilha de coleta com as métricas por caso e abordagem
- [ ] Template de prompt padronizado para as abordagens B e C

- [ ] Abrir as 10 classes `sample` e confirmar o que cada uma exercita (laços, arrays, chamadas, auto-incremento)
- [ ] Definir o critério de equivalência (saída igual, verificador de DF em JavaScript, ou ambos)
- [ ] Testar o fork do plugin da Apitomy para evitar o build manual das dependências
