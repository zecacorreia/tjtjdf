#!/usr/bin/env bash
# Abordagem C (so IA): o LLM recebe o Sample.java (o mesmo arquivo que a A entrega ao JSweet) e escreve o .js do zero.
# Por padrao e 1 rodada (traducao direta, sem ver o gabarito). Com RODADAS>1 a IA recebe o resultado do avaliador e o gabarito, como na B.
# Uso: run-C.sh [repeticoes=3] [rodadas=1]      (mesmo LLM_PROVIDER/LLM_MODEL/chave da B; use o mesmo modelo para comparar)
set -euo pipefail
REPS=${1:-3}; ROUNDS=${2:-1}
W=${W:-/work}; H=$W/_publicar/harness; E=${ESTUDO:-$W/estudo}; GAB=$E/gabarito/gabarito.json; PREP=$E/samples-preparadas
OUT=$E/resultados-harness/C-$(date +%Y%m%d-%H%M%S); mkdir -p "$OUT/chamadas" "$OUT/js"
export AGENT_MODE=traduzir
echo "prompt_sha256=$(cat $H/prompt-C.txt $H/prompt-C-correcao.txt | sha256sum | cut -d' ' -f1)" | tee "$OUT/config.txt"
printf "provedor=%s\nmodelo=%s\ntemperatura=%s\nrodadas=%s\n" "${LLM_PROVIDER:-gemini}" "${LLM_MODEL:-${GEMINI_MODEL:?defina LLM_MODEL (ou GEMINI_MODEL)}}" "${LLM_TEMP:-${GEMINI_TEMP:-0}}" "$ROUNDS" | tee -a "$OUT/config.txt"
SAMPLES=$(node -e 'console.log(Object.keys(require(process.argv[1])).sort().join(" "))' $GAB)
for rep in $(seq 1 $REPS); do
  mkdir -p $OUT/js-$rep
  for s in $SAMPLES; do
    D=/tmp/c/$s-$rep; rm -rf $D; mkdir -p $D/js
    cp $PREP/$s.java $D/Sample.java
    node -e 'const g=require(process.argv[1]);require("fs").writeFileSync(process.argv[2],g[process.argv[3]].saida)' $GAB $D/gabarito.txt $s
    t0=$(date +%s); INFRA=0; USED=0
    for round in $(seq 1 $ROUNDS); do
      if [ $round -gt 1 ]; then
        [ -f $D/Sample.js ] || break
        cp $D/Sample.js $D/js/$s.js; ONLY=$s node $H/evaluate.js $D/js $GAB C $rep $D/av.jsonl >/dev/null; tail -1 $D/av.jsonl > $D/FALHA.json
        if grep -q '"L3":true' $D/FALHA.json; then break; fi
      fi
      rc=0; node $H/agent-llm.js $D $OUT/chamadas/$s-$rep-r$round.json || rc=$?
      if [ "$rc" = "4" ]; then echo "Execucao invalida: erro de configuracao da API (chave, saldo ou modelo). Nao usar." > "$OUT/INVALIDA.txt"; echo "ABORTADO: erro de configuracao (veja a mensagem CONFIG acima)"; exit 4; fi
      if [ "$rc" = "5" ]; then echo "Execucao incompleta: cota diaria da API esgotada. Nao usar." > "$OUT/INVALIDA.txt"; echo "ABORTADO: cota diaria esgotada"; exit 5; fi
      if [ "$rc" = "3" ]; then INFRA=1; break; fi
      USED=$round
      sleep ${INTERVALO_S:-13}
    done
    if [ "$INFRA" = "1" ]; then echo "{\"sample\":\"$s\",\"rep\":$rep,\"invalida_infra\":true}" >> "$OUT/execucoes.jsonl"; echo "$s rep $rep INVALIDA (API indisponivel)"; continue; fi
    [ -f $D/Sample.js ] && cp $D/Sample.js $D/js/$s.js && cp $D/Sample.js $OUT/js-$rep/$s.js
    ONLY=$s node $H/evaluate.js $D/js $GAB C $rep $OUT/avaliacao.jsonl | head -1
    echo "{\"sample\":\"$s\",\"rep\":$rep,\"segundos\":$(( $(date +%s) - t0 )),\"rodadas\":$USED,\"js_sha256\":\"$( [ -f $D/Sample.js ] && sha256sum $D/Sample.js | cut -d' ' -f1 )\"}" >> "$OUT/execucoes.jsonl"
  done
done
echo "resultados em $OUT (tokens por chamada em chamadas/*.json)"
