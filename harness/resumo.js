#!/usr/bin/env node
// Resumo em tabela das execuções A e B (para apresentar o resultado).
// Uso: node resumo.js <pasta-A> [pasta-B]
const fs = require('fs'), path = require('path');
const [, , pa, pb] = process.argv; if (!pa) { console.error('uso: node resumo.js <pasta-A> [pasta-B]'); process.exit(2); }
const jl = f => fs.existsSync(f) ? fs.readFileSync(f, 'utf8').trim().split('\n').filter(Boolean).map(JSON.parse) : [];
const A = jl(path.join(pa, 'avaliacao.jsonl')).filter(r => r.rep === 1);
const B = pb ? jl(path.join(pb, 'avaliacao.jsonl')) : [];
const ex = pb ? jl(path.join(pb, 'execucoes.jsonl')) : [];
const cdir = pb ? path.join(pb, 'chamadas') : '';
const calls = cdir && fs.existsSync(cdir) ? fs.readdirSync(cdir).filter(f => f.endsWith('.json')).map(f => JSON.parse(fs.readFileSync(path.join(cdir, f), 'utf8'))).filter(c => c.uso) : [];
const sim = b => b ? 'sim' : 'nao';
const pad = (s, n) => String(s).padEnd(n);
console.log('\n=== Abordagem A (só JSweet) por sample ===');
console.log(pad('sample', 48), pad('L1', 4), pad('L2', 4), pad('L3', 5), 'B (Gemini)');
for (const r of A) {
  const b = B.filter(x => x.sample === r.sample);
  const bTxt = !r.comparavel ? '-' : r.L3 ? 'sem alteração (A já acertou)' : b.length ? `${b.filter(x => x.L3).length}/${b.length} repetições válidas em L3` : 'não rodou';
  console.log(pad(r.sample, 48), pad(sim(r.L1), 4), pad(sim(r.L2), 4), pad(r.comparavel ? sim(r.L3) : 'n/a', 5), bTxt, r.comparavel ? '' : `(${r.motivo})`);
}
const cmp = A.filter(r => r.comparavel);
console.log(`\nA: ${A.filter(r => r.L1).length}/${A.length} L1, ${A.filter(r => r.L2).length}/${A.length} L2, ${cmp.filter(r => r.L3).length}/${cmp.length} L3 nas comparáveis`);
if (pb) {
  const falhas = [...new Set(cmp.filter(r => !r.L3).map(r => r.sample))];
  const corrigidas = falhas.filter(s => B.some(x => x.sample === s && x.L3));
  console.log(`B: corrigiu ${corrigidas.length}/${falhas.length} sample(s) que a A errou  =>  ${cmp.filter(r => r.L3).length + corrigidas.length}/${cmp.length} L3 nas comparáveis`);
  const inval = ex.filter(e => e.invalida_infra).length;
  console.log(`B: ${B.length} repetição(ões) válida(s), ${inval} invalidada(s) por falha da API`);
  if (calls.length) {
    console.log(`B: tokens por chamada (entrada+resposta+raciocínio): ${calls.map(c => c.uso.totalTokenCount).join(', ')}  | modelo: ${calls[0].modelo}`);
    console.log(`B: literal suspeito (saída escrita como texto fixo): ${calls.some(c => c.literal_suspeito) ? 'SIM, revisar' : 'nenhum'}`);
  }
  if (B.length > 1) console.log(`B: ${new Set(B.map(x => x.js_sha256)).size === 1 ? 'as repetições geraram o mesmo JS (temperatura 0): contam como 1 evidência' : 'as repetições geraram JS diferentes'}`);
}
