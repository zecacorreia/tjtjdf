#!/usr/bin/env bash
# Abordagem A (só JSweet) no container. Monte a pasta do projeto em /work e o ~/.m2 do host (com os forks) em /root/.m2.
set -euo pipefail
W=${W:-/work}; H=$W/_publicar/harness; E=${ESTUDO:-$W/estudo}
PREP=$E/samples-preparadas; GAB=$E/gabarito; REPS=${REPS:-3}; MVN_FLAGS=${MVN_FLAGS:--o -q}
OUT=$E/resultados-harness/A-$(date +%Y%m%d-%H%M%S); mkdir -p "$OUT"
echo "== ambiente"  | tee "$OUT/ambiente.txt"; { java -version 2>&1 | head -1; mvn -v | head -1; node -v; } | tee -a "$OUT/ambiente.txt"
echo "== pré-passo e gabarito"
node $H/prepare-samples.js $E/samples-originais $PREP > "$OUT/prepasso.csv"
node $H/gabarito.js $PREP $GAB | tee "$OUT/gabarito.txt"
# cópia de trabalho do quickstart só com as samples (sem a reescrita dataflow, sem cache .jsweet de outro SO)
rm -rf /tmp/qs; cp -r $W/jsweet-quickstart /tmp/qs
rm -rf /tmp/qs/target /tmp/qs/.jsweet /tmp/qs/src/main/java/quickstart
mkdir -p /tmp/qs/src/main/java/br/unb/cic/analysis/samples; cp $PREP/*.java /tmp/qs/src/main/java/br/unb/cic/analysis/samples/
for r in $(seq 1 $REPS); do
  rm -rf /tmp/qs/target; s=$(awk '{print $1}' /proc/uptime)
  if (cd /tmp/qs && mvn $MVN_FLAGS generate-sources) > "$OUT/jsweet-$r.log" 2>&1; then ok=true; else ok=false; fi
  e=$(awk '{print $1}' /proc/uptime); ms=$(grep -o 'finished in [0-9]* ms' "$OUT/jsweet-$r.log" | grep -o '[0-9]*' | tail -1)
  echo "{\"rep\":$r,\"jsweet_ok\":$ok,\"segundos_total\":$(awk "BEGIN{printf \"%.2f\", $e - $s}"),\"jsweet_ms\":${ms:-null}}" >> "$OUT/tempos.jsonl"
  if [ "$ok" = true ]; then cp -r /tmp/qs/target/js "$OUT/js-$r"; node $H/evaluate.js "$OUT/js-$r" $GAB/gabarito.json A $r "$OUT/avaliacao.jsonl" | head -1
  else echo "rep $r: JSweet falhou (veja $OUT/jsweet-$r.log)"; fi
done
# o JSweet é determinístico? compara as repetições
if [ "$REPS" -gt 1 ] && [ -d "$OUT/js-1" ] && [ -d "$OUT/js-2" ]; then diff -r "$OUT/js-1" "$OUT/js-2" > /dev/null && echo "JS gerado identico entre repeticoes" || echo "ATENCAO: JS gerado difere entre repeticoes"; fi
echo "resultados em $OUT"
