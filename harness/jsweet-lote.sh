#!/usr/bin/env bash
# Roda o JSweet (abordagem A) em lote sobre os conjuntos DF e CF, dentro do container, e imprime um resumo por conjunto.
# Uso (no container):  jsweet-lote.sh            -> df e cf
#                      CONJUNTOS="cf" jsweet-lote.sh
# Variáveis: CONJUNTOS (padrão "df cf"), REPS (padrão 3), PUBLICAR=1 copia o JS da repetição 1 para testes-js/<conjunto>/A-jsweet,
#            DF_DIR / CF_DIR (pastas dos conjuntos; padrão $W/estudo e $W/_publicar/estudo-cf).
# Um conjunto que falha não interrompe o lote; o código de saída é 1 se algum falhou.
set -uo pipefail
W=${W:-/work}; H=$W/_publicar/harness; REPS=${REPS:-3}; CONJUNTOS=${CONJUNTOS:-df cf}
declare -A DIR=( [df]=${DF_DIR:-$W/estudo} [cf]=${CF_DIR:-$W/_publicar/estudo-cf} )
FALHOU=0; RES=()
for c in $CONJUNTOS; do
  d=${DIR[$c]:-}
  if [ -z "$d" ] || [ ! -d "$d/samples-originais" ]; then echo "== $c: pasta de samples nao encontrada ($d/samples-originais)"; FALHOU=1; continue; fi
  echo; echo "################ conjunto $c ($d) ################"
  LOG=$(mktemp); if ESTUDO=$d REPS=$REPS bash $H/run-A.sh 2>&1 | tee "$LOG"; then :; fi
  OUT=$(grep -o 'resultados em .*' "$LOG" | tail -1 | sed 's/resultados em //')
  if [ -z "$OUT" ] || [ ! -f "$OUT/avaliacao.jsonl" ]; then echo "== $c: a execucao nao produziu avaliacao (veja o log acima)"; FALHOU=1; continue; fi
  RES+=("$c|$d|$OUT")
  if [ "${PUBLICAR:-0}" = "1" ]; then node $H/publicar-js.js $c $d --A $OUT || FALHOU=1; fi
done
echo; echo "==================== RESUMO DO LOTE ===================="
for r in "${RES[@]}"; do IFS='|' read -r c d OUT <<< "$r"
  node -e '
const fs=require("fs"),p=require("path");const [,c,out]=process.argv;
const rows=fs.readFileSync(p.join(out,"avaliacao.jsonl"),"utf8").trim().split("\n").map(JSON.parse);
const reps=[...new Set(rows.map(r=>r.rep))].sort();
const t=fs.existsSync(p.join(out,"tempos.jsonl"))?fs.readFileSync(p.join(out,"tempos.jsonl"),"utf8").trim().split("\n").map(JSON.parse):[];
console.log("\nConjunto "+c.toUpperCase()+"  ("+p.basename(out)+")");
console.log("rep  samples  L1  L2  L3/comparaveis  JSweet(s)");
for(const r of reps){const x=rows.filter(q=>q.rep===r),cmp=x.filter(q=>q.comparavel),tt=t.find(q=>q.rep===r);
 console.log(String(r).padEnd(5)+String(x.length).padEnd(9)+String(x.filter(q=>q.L1).length).padEnd(4)+String(x.filter(q=>q.L2).length).padEnd(4)+(cmp.filter(q=>q.L3).length+"/"+cmp.length).padEnd(16)+(!tt?"n/d":!tt.jsweet_ok?"falhou":(tt.segundos_total??tt.segundos??"n/d")));}
const ruins=rows.filter(q=>q.rep===reps[0]&&(!q.L1||!q.L2||(q.comparavel&&!q.L3)));
if(ruins.length){console.log("Samples que nao passam (repeticao "+reps[0]+"):");for(const q of ruins)console.log("  - "+q.sample+": "+(!q.L1?"sem JS":!q.L2?"nao executa ("+(q.erro||"")+")":"saida diferente "+JSON.stringify(q.diff||{})));}
else console.log("Todas as samples comparaveis passam em L3.");' "$c" "$OUT"
done
echo; [ $FALHOU = 0 ] && echo "lote concluido" || echo "lote concluido com falhas"
exit $FALHOU
