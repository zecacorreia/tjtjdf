#!/usr/bin/env node
// Reavaliação ao vivo, só com Node (sem JSweet, sem Docker, sem as samples):
//  1) executa os .js que o JSweet gerou (execução A) e compara com o gabarito do Java -> L1/L2/L3 da abordagem A;
//  2) reconstrói o JS da abordagem B aplicando o .diff que o Gemini produziu (chamadas/*.diff) ao JS da A, confere o SHA-256
//     com o registrado na execução B e avalia de novo.
// Uso: node reavaliar.js <pasta-A> <pasta-B> <gabarito.json>
const fs = require('fs'), path = require('path'), os = require('os'), cp = require('child_process'), crypto = require('crypto');
const [, , pa, pb, gab] = process.argv;
if (!pa || !pb || !gab) { console.error('uso: node reavaliar.js <pasta-A> <pasta-B> <gabarito.json>'); process.exit(2); }
if (!fs.existsSync(gab)) { console.error(`\nFALTA O GABARITO: não achei "${gab}".\nCopie o arquivo estudo/gabarito/gabarito.json do computador onde a A foi rodada (ele tem a saída esperada do Java) e rode de novo.`); process.exit(1); }
for (const d of [path.join(pa, 'js-1'), path.join(pb, 'avaliacao.jsonl')]) if (!fs.existsSync(d)) { console.error(`\nnão achei "${d}": confira os nomes das pastas das execuções A e B.`); process.exit(1); }
const ev = path.join(__dirname, 'evaluate.js');
const run = (dir, ab, rep, only) => {
  const r = cp.spawnSync(process.execPath, [ev, dir, gab, ab, String(rep), path.join(os.tmpdir(), 'reav.jsonl')], { encoding: 'utf8', env: { ...process.env, ONLY: only || '' } });
  if (r.status !== 0 || !r.stdout.trim()) { console.error('\nO avaliador falhou (status ' + r.status + '):\n' + (r.stderr || r.error || 'sem mensagem')); process.exit(1); }
  return r.stdout;
};
const find = (d, name) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) { const r = find(p, name); if (r) return r; } else if (e.name === name + '.js') return p; } };
// aplica um diff "normal" do diff(1): hunks NaM, NcM e NdM
function aplicar(texto, diff) {
  const L = texto.replace(/\r\n/g, '\n').split('\n'); const D = diff.replace(/\r\n/g, '\n').split('\n'); const out = []; let pos = 0;
  for (let i = 0; i < D.length; i++) {
    const m = /^(\d+)(?:,(\d+))?([acd])(\d+)(?:,(\d+))?$/.exec(D[i]); if (!m) continue;
    const a1 = Number(m[1]), a2 = Number(m[2] || m[1]), op = m[3], novas = [];
    i++; while (i < D.length && /^[<>-]/.test(D[i])) { if (D[i].startsWith('> ')) novas.push(D[i].slice(2)); else if (D[i].startsWith('>')) novas.push(D[i].slice(1)); i++; } i--;
    const ate = op === 'a' ? a1 : a1 - 1; out.push(...L.slice(pos, ate));
    if (op !== 'd') out.push(...novas); pos = op === 'a' ? a1 : a2;
  }
  out.push(...L.slice(pos)); return out.join('\n');
}
console.log('\n=== Abordagem A: JS gerado pelo JSweet, executado agora e comparado com o Java ===');
console.log(run(path.join(pa, 'js-1'), 'A', 1));
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'reav-')); fs.cpSync(path.join(pa, 'js-1'), tmp, { recursive: true });
const diffs = fs.existsSync(path.join(pb, 'chamadas')) ? fs.readdirSync(path.join(pb, 'chamadas')).filter(f => /^(.+)-(\d+)\.diff$/.test(f)) : [];
const reg = fs.readFileSync(path.join(pb, 'avaliacao.jsonl'), 'utf8').trim().split('\n').filter(Boolean).map(JSON.parse);
console.log('=== Abordagem B: JS da A + correção do Gemini (diff guardado), executado agora ===');
for (const f of diffs) {
  const [, sample, rep] = /^(.+)-(\d+)\.diff$/.exec(f); const alvo = find(tmp, sample); if (!alvo) continue;
  const base = fs.readFileSync(find(path.join(pa, 'js-1'), sample), 'utf8'); const novo = aplicar(base, fs.readFileSync(path.join(pb, 'chamadas', f), 'utf8'));
  fs.writeFileSync(alvo, novo);
  const sha = crypto.createHash('sha256').update(novo).digest('hex'); const r = reg.find(x => x.sample === sample && x.rep === Number(rep));
  console.log(`repetição ${rep}: SHA-256 do JS reconstruído ${sha.slice(0, 12)}... ${r ? (r.js_sha256 === sha ? '= igual ao registrado na execução B (reprodutível)' : '!= DIFERENTE do registrado') : '(sem registro)'}`);
  console.log(run(tmp, 'B', Number(rep), sample).split('\n').slice(1).join('\n'));
}
