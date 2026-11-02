#!/usr/bin/env bash
# Abordagem B (JSweet + IA) no container, a partir de uma execução da A. A IA é o Gemini, chamado pela API em agent-gemini.js
# (GEMINI_API_KEY e GEMINI_MODEL no ambiente); tokens por chamada ficam em chamadas/*.json (campo "uso").
# Uso: run-B.sh <pasta-da-execucao-A> [repeticoes=3] [rodadas=3]
set -euo pipefail
A=${1:?pasta da execucao A}; REPS=${2:-3}; ROUNDS=${3:-3}
W=${W:-/work}; H=$W/_publicar/harness; E=$W/estudo; GAB=$E/gabarito/gabarito.json; PREP=$E/samples-preparadas
OUT=$E/resultados-harness/B-$(date +%Y%m%d-%H%M%S); mkdir -p "$OUT/chamadas"
PROMPT_SHA=$(sha256sum $H/prompt-B.txt | cut -d' ' -f1); echo "prompt_sha256=$PROMPT_SHA" | tee "$OUT/config.txt"
echo "modelo=${GEMINI_MODEL:?defina GEMINI_MODEL}" | tee -a "$OUT/config.txt"
FALHAS=$(node -e '
const fs=require("fs");const rows=fs.readFileSync(process.argv[1],"utf8").trim().split("\n").map(JSON.parse);
console.log([...new Set(rows.filter(r=>r.rep===1&&r.comparavel&&!r.L3).map(r=>r.sample))].join(" "))' "$A/avaliacao.jsonl")
echo "samples a corrigir: ${FALHAS:-nenhuma}"
for s in $FALHAS; do for rep in $(seq 1 $REPS); do
  D=/tmp/b/$s-$rep; rm -rf $D; mkdir -p $D/js
  cp $PREP/$s.java $D/Sample.java; cp $(find "$A/js-1" -name "$s.js") $D/Sample.js
  node -e 'const g=require(process.argv[1]);require("fs").writeFileSync(process.argv[2],g[process.argv[3]].saida)' $GAB $D/gabarito.txt $s
  cp $D/Sample.js $D/js/$s.js; t0=$(date +%s)
  INFRA=0
  for round in $(seq 1 $ROUNDS); do
    ONLY=$s node $H/evaluate.js $D/js $GAB B $rep $D/av.jsonl >/dev/null; tail -1 $D/av.jsonl > $D/FALHA.json
    if grep -q '"L3":true' $D/FALHA.json; then break; fi
    rc=0; node $H/agent-gemini.js $D $OUT/chamadas/$s-$rep-r$round.json || rc=$?
    if [ "$rc" = "3" ]; then INFRA=1; break; fi   # API indisponivel: a repeticao nao mede o modelo
    sleep ${INTERVALO_S:-13}                        # respeita o limite de 5 requisicoes/min do plano gratuito
    cp $D/Sample.js $D/js/$s.js
  done
  if [ "$INFRA" = "1" ]; then
    echo "{\"sample\":\"$s\",\"rep\":$rep,\"invalida_infra\":true}" >> "$OUT/execucoes.jsonl"; echo "rep $rep INVALIDA (API indisponivel); nao entra na avaliacao"; continue
  fi
  ONLY=$s node $H/evaluate.js $D/js $GAB B $rep $OUT/avaliacao.jsonl | head -1
  echo "{\"sample\":\"$s\",\"rep\":$rep,\"segundos\":$(( $(date +%s) - t0 )),\"js_antes\":\"$(sha256sum $(find "$A/js-1" -name "$s.js") | cut -d' ' -f1)\",\"js_depois\":\"$(sha256sum $D/Sample.js | cut -d' ' -f1)\"}" >> "$OUT/execucoes.jsonl"
  diff <(find "$A/js-1" -name "$s.js" -exec cat {} \;) $D/Sample.js > "$OUT/chamadas/$s-$rep.diff" || true
done; done
echo "resultados em $OUT (tokens por chamada em chamadas/*.json)"
