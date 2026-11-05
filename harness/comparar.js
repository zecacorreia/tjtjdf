#!/usr/bin/env node
// Compara A, B e C no mesmo gabarito.
// Uso: node comparar.js <pasta-A> [--B pasta[,pasta...]] [--C pasta[,pasta...]]
//   A: execucao do run-A.sh. B: execucoes do run-B.sh (sobre essa A). C: execucoes do run-C.sh.
// B ponta a ponta = JSweet + IA: as samples que a A acerta ficam como estao; as que a A erra recebem a taxa de acerto da B.
const fs = require('fs'), path = require('path');
const args = process.argv.slice(2), A = args[0];
const opt = n => { const i = args.indexOf(n); return i < 0 ? [] : args[i + 1].split(','); };
if (!A) { console.error('uso: node comparar.js <pasta-A> [--B p1,p2] [--C p1,p2]'); process.exit(2); }
const jl = f => fs.existsSync(f) ? fs.readFileSync(f, 'utf8').trim().split('\n').filter(Boolean).map(JSON.parse) : [];
const cfg = d => Object.fromEntries((fs.existsSync(path.join(d, 'config.txt')) ? fs.readFileSync(path.join(d, 'config.txt'), 'utf8') : '').split('\n').filter(l => l.includes('=')).map(l => l.split(/=(.*)/s).slice(0, 2)));
const calls = d => fs.existsSync(path.join(d, 'chamadas')) ? fs.readdirSync(path.join(d, 'chamadas')).filter(f => f.endsWith('.json')).map(f => JSON.parse(fs.readFileSync(path.join(d, 'chamadas', f), 'utf8'))) : [];
const sum = (xs, f) => xs.reduce((a, x) => a + (f(x) || 0), 0), avg = xs => xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null;
const pct = x => x === null ? 'n/d' : (100 * x).toFixed(0) + '%', n1 = x => x === null ? 'n/d' : x.toLocaleString('pt-BR', { maximumFractionDigits: 1 });
const invalida = d => fs.existsSync(path.join(d, 'INVALIDA.txt'));
const rowsA = jl(path.join(A, 'avaliacao.jsonl')), repsA = [...new Set(rowsA.map(r => r.rep))];
const taxa = (rows, k, soComp) => { const r = rows.filter(x => !soComp || x.comparavel); return r.length ? r.filter(x => x[k]).length / r.length : null; };
const out = [];
const bySample = rows => { const m = {}; for (const r of rows) (m[r.sample] ||= []).push(r); return m; };
const rateSample = rows => { const m = bySample(rows), o = {}; for (const s in m) o[s] = m[s].filter(r => r.L3).length / m[s].length; return o; };

const linha = (nome, L1, L2, L3, tok, lat, obs) => out.push([nome, pct(L1), pct(L2), pct(L3), tok, lat, obs]);
// A
const a3 = rateSample(rowsA.filter(r => r.comparavel));
linha('A  JSweet', taxa(rowsA, 'L1'), taxa(rowsA, 'L2'), taxa(rowsA, 'L3', true), '0', 'n/d', `${repsA.length} reps; 0 tokens; 0 edições`);
// B
const Bs = opt('--B').filter(d => !invalida(d));
for (const d of Bs) {
  const rows = jl(path.join(d, 'avaliacao.jsonl')), c = calls(d), k = cfg(d), rb = rateSample(rows);
  const comp = Object.keys(a3), tot = comp.map(s => s in rb ? rb[s] : a3[s]);
  const reps = new Set(rows.map(r => r.rep)).size || 1;
  const L3 = avg(tot), tokRep = reps ? sum(c, x => x.uso?.totalTokenCount) / reps : 0;
  linha(`B  JSweet+IA (${k.modelo || '?'})`, taxa(rowsA, 'L1'), taxa(rowsA, 'L2'), L3, n1(tokRep), n1(avg(c.map(x => x.ms_resposta).filter(Boolean)) / 1000) + ' s', `corrige só ${Object.keys(rb).length} sample(s); ${c.filter(x => x.literal_suspeito).length} literal suspeito`);
}
// C
const Cs = opt('--C').filter(d => !invalida(d));
for (const d of Cs) {
  const rows = jl(path.join(d, 'avaliacao.jsonl')), c = calls(d), k = cfg(d), ex = jl(path.join(d, 'execucoes.jsonl'));
  const reps = new Set(rows.map(r => r.rep)).size || 1, infra = ex.filter(e => e.invalida_infra).length;
  const rate = rateSample(rows.filter(r => r.comparavel)), vals = Object.values(rate);
  linha(`C  só IA (${k.modelo || '?'})`, taxa(rows, 'L1'), taxa(rows, 'L2'), avg(vals), n1(sum(c, x => x.uso?.totalTokenCount) / reps), n1(avg(c.map(x => x.ms_resposta).filter(Boolean)) / 1000) + ' s', `${reps} reps; ${infra} invalidadas por API; ${c.filter(x => x.literal_suspeito).length} literal suspeito; rodadas=${k.rodadas || '?'}`);
  const ruins = Object.entries(rate).filter(([, v]) => v < 1).map(([s, v]) => `${s} (${pct(v)})`);
  if (ruins.length) out.push(['', '', '', '', '', '', 'C não acerta: ' + ruins.join('; ')]);
}
const cab = ['Abordagem', 'L1', 'L2', 'L3 (comparáveis)', 'Tokens/execução', 'Latência/chamada', 'Observações'];
const w = cab.map((h, i) => Math.max(h.length, ...out.map(r => String(r[i]).length)));
const fmt = r => r.map((c, i) => String(c).padEnd(w[i])).join('  ');
console.log(fmt(cab)); console.log(w.map(x => '-'.repeat(x)).join('  ')); out.forEach(r => console.log(fmt(r)));
const iv = [...opt('--B'), ...opt('--C')].filter(invalida); if (iv.length) console.log('\nIgnoradas (INVALIDA.txt): ' + iv.map(d => path.basename(d)).join(', '));
console.log('\nL1 = gerou .js | L2 = roda sem exceção | L3 = saída idêntica à do Java. Tokens/execução: B = por repetição (só as samples corrigidas); C = por repetição (todas as samples).');
