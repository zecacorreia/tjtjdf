#!/usr/bin/env node
// Copia o JavaScript final de cada abordagem para testes-js/<conjunto>/ (para quem só quer pegar os testes em JS).
// Uso: node publicar-js.js <df|cf> <pasta-estudo> --A <pastaA> [--B <pastaB>] [--C <pastaC>] [--rep 1]
//   <pasta-estudo> = pasta com o gabarito (ex.: estudo ou _publicar/estudo-cf). B = JS da A + correção guardada em chamadas/*.diff; C = js-<rep>/ da execução C.
const fs = require('fs'), path = require('path');
const a = process.argv.slice(2), conj = a[0], estudo = a[1];
const opt = n => { const i = a.indexOf(n); return i < 0 ? null : a[i + 1]; };
const A = opt('--A'), B = opt('--B'), C = opt('--C'), rep = opt('--rep') || '1';
if (!conj || !estudo || !A) { console.error('uso: node publicar-js.js <df|cf> <pasta-estudo> --A <pastaA> [--B <pastaB>] [--C <pastaC>] [--rep 1]'); process.exit(2); }
const raiz = path.join(__dirname, '..', 'testes-js');
const achar = (dir, nome) => { let r = null; (function w(d) { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) w(p); else if (e.name === nome) r = p; } })(dir); return r; };
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
const copiar = (dir, dest) => { fs.mkdirSync(dest, { recursive: true }); const n = []; (function w(d) { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) w(p); else if (e.name.endsWith('.js')) { fs.copyFileSync(p, path.join(dest, e.name)); n.push(e.name); } } })(dir); return n; };
const dA = path.join(raiz, conj, 'A-jsweet'); const nA = copiar(path.join(A, 'js-' + rep), dA);
console.log('A-jsweet:', nA.length, 'arquivos');
if (B) {
  const dB = path.join(raiz, conj, 'B-jsweet-ia'); copiar(path.join(A, 'js-' + rep), dB);
  const dir = path.join(B, 'chamadas'); let n = 0;
  for (const f of fs.existsSync(dir) ? fs.readdirSync(dir).filter(f => /^(.+)-(\d+)\.diff$/.test(f)) : []) {
    const [, s, r] = /^(.+)-(\d+)\.diff$/.exec(f); if (r !== rep) continue; const alvo = path.join(dB, s + '.js'); if (!fs.existsSync(alvo)) continue;
    fs.writeFileSync(alvo, aplicar(fs.readFileSync(alvo, 'utf8'), fs.readFileSync(path.join(dir, f), 'utf8'))); n++;
  }
  console.log('B-jsweet-ia: A +', n, 'sample(s) corrigida(s) pela IA');
}
if (C) console.log('C-ia:', copiar(path.join(C, 'js-' + rep), path.join(raiz, conj, 'C-ia')).length, 'arquivos');
const ref = path.join(raiz, 'saida-esperada', conj); fs.mkdirSync(ref, { recursive: true });
for (const f of fs.readdirSync(path.join(estudo, 'gabarito')).filter(f => f.endsWith('.txt') || f === 'gabarito.json')) fs.copyFileSync(path.join(estudo, 'gabarito', f), path.join(ref, f));
console.log('Confira com: node testes-js/verificar.js ' + conj);
