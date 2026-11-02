#!/usr/bin/env node
// Avaliador único para A, B e C.  L1 = gerou .js | L2 = executa sem exceção | L3 = saída idêntica ao gabarito (comparação estrita).
// ONLY=<sample> restringe a avaliação a uma sample.
// Uso: node evaluate.js <dir-js> <gabarito.json> <abordagem> <repeticao> [saida.jsonl]
const fs = require('fs'), path = require('path'), cp = require('child_process'), crypto = require('crypto');
const [, , dir, gabPath, abordagem, rep, jsonl] = process.argv;
if (!dir || !gabPath || !abordagem) { console.error('uso: node evaluate.js <dir-js> <gabarito.json> <abordagem> <rep> [saida.jsonl]'); process.exit(2); }
const gab = JSON.parse(fs.readFileSync(gabPath, 'utf8'));
const found = {}; (function walk(d) { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) walk(p); else if (e.name.endsWith('.js')) found[e.name.replace(/\.js$/, '')] = p; } })(dir);
const rows = [];
for (const name of Object.keys(gab).filter(n => !process.env.ONLY || n === process.env.ONLY).sort()) {
  const g = gab[name]; const file = found[name];
  const r = { sample: name, abordagem, rep: Number(rep || 1), L1: !!file, L2: false, L3: false, comparavel: g.status === 'ok' && g.deterministico && g.portavel && !g.vazio };
  if (!r.comparavel) r.motivo = g.status !== 'ok' ? 'gabarito com erro' : g.vazio ? 'sem saida' : !g.portavel ? 'nao portavel (identidade de objeto)' : 'nao deterministico';
  if (file) {
    r.js_sha256 = crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
    const e = cp.spawnSync('node', [file], { encoding: 'utf8', timeout: 10000 });
    r.L2 = e.status === 0;
    if (!r.L2) r.erro = (e.stderr || '').split('\n').find(l => /Error/.test(l)) || 'falhou';
    if (r.L2 && r.comparavel) { r.L3 = e.stdout === g.saida; if (!r.L3) { const a = g.saida.split('\n'), b = e.stdout.split('\n'); const i = a.findIndex((x, k) => x !== b[k]); r.diff = { linha: i + 1, java: a[i], js: b[i] }; } }
  }
  rows.push(r);
}
if (jsonl) fs.appendFileSync(jsonl, rows.map(r => JSON.stringify(r)).join('\n') + '\n');
const cmp = rows.filter(r => r.comparavel);
const s = { abordagem, rep: Number(rep || 1), amostras: rows.length, comparaveis: cmp.length, L1: rows.filter(r => r.L1).length, L2: rows.filter(r => r.L2).length, L3_nas_comparaveis: cmp.filter(r => r.L3).length };
console.log(JSON.stringify(s));
for (const r of rows) console.log((r.sample).padEnd(48), r.L1 ? 'L1' : '--', r.L2 ? 'L2' : '--', r.comparavel ? (r.L3 ? 'L3' : 'L3 NAO') : '(' + r.motivo + ')', r.diff ? JSON.stringify(r.diff) : '');
