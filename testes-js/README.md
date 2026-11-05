# Testes em JavaScript

JavaScript final de cada abordagem do estudo, para quem só quer pegar os testes em JS. Cada arquivo é uma classe `sample` do conjunto, traduzida de Java e executável com `node <arquivo>.js`.

| Pasta | Conteúdo |
| --- | --- |
| `df/A-jsweet/` | Saída do JSweet, sem correção (abordagem A) |
| `df/B-jsweet-ia/` | Saída do JSweet com a correção da IA (abordagem B, `openai/gpt-oss-120b`, repetição 1) |
| `df/C-ia/` | Tradução feita direto pela IA, sem JSweet (abordagem C, `openai/gpt-oss-120b`, repetição 1) |
| `cf/` | Mesmo conjunto para os casos de confluência (CF), 6 samples. `cf/B-jsweet-ia/` é igual a `cf/A-jsweet/`: a A acertou tudo no CF e não havia o que corrigir |
| `saida-esperada/` | Saída do programa Java original (o gabarito) e o `gabarito.json` com o status de cada sample |

Conferir tudo de uma vez (só precisa do Node.js):

```bash
node testes-js/verificar.js df
```

Resultado esperado em `cf` (3 samples comparáveis): A 3/3, B 3/3, C 3/3.

Resultado esperado em `df` (6 samples têm saída comparável com o Java): A 5/6, B 6/6, C 6/6. As outras 3 samples executam, mas a saída não se compara: `DoubleSourceSample` imprime um hash de objeto, e `SourceSinkVariableAttribution*` não imprimem nada.

Observações:
- A única diferença da A para a B é `IntraproceduralIndirectSource`, onde o JSweet traduz `System.out.print` para `console.info`, que acrescenta uma quebra de linha.
- O JS da B e da C vem de uma única repetição; as outras repetições geram arquivos diferentes (a C quase sempre) e estão em `estudo/resultados-harness/`.
- Como as samples têm um `main` acrescentado no pré-passo, cada arquivo chama o `main` no fim e imprime a saída ao executar.
- Para atualizar esta pasta depois de uma nova execução: `node harness/publicar-js.js <df|cf> <pasta-estudo> --A <pastaA> --B <pastaB> --C <pastaC>`.
