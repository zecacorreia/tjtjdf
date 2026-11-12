#!/usr/bin/env node
// Roda cada teste JavaScript e compara a saída com a do programa Java original.
// Uso: node verificar.js [df|cf]      (padrão: df)      Requer apenas Node.js.
const fs = require('fs'), path = require('path'), cp = require('child_process');
// ES5: verifica a sintaxe com o parser acorn embutido no Node (n/d se este Node não o expõe)
const ES5S = "const a=require('internal/deps/acorn/acorn/dist/acorn');try{a.parse(require('fs').readFileSync(process.argv[1],'utf8'),{ecmaVersion:5});console.log('OK')}catch(e){console.log('ERRO')}";
const es5 = f => { const r = cp.spawnSync(process.execPath, ['--expose-internals', '-e', ES5S, f], { encoding: 'utf8' }); const o = (r.stdout || '').trim(); return o === 'OK' ? 'ES5' : o === 'ERRO' ? 'ES6+' : 'ES5?'; };
const conj = process.argv[2] || 'df', base = path.join(__dirname, conj), ref = path.join(__dirname, 'saida-esperada', conj);
if (!fs.existsSync(base)) { console.error('conjunto inexistente: ' + conj); process.exit(2); }
const gab = JSON.parse(fs.readFileSync(path.join(ref, 'gabarito.json'), 'utf8'));
for (const abord of fs.readdirSync(base).filter(d => fs.statSync(path.join(base, d)).isDirectory()).sort()) {
  console.log('\n== ' + abord); let ok = 0, comp = 0, es5ok = 0, total = 0;
  for (const f of fs.readdirSync(path.join(base, abord)).filter(f => f.endsWith('.js')).sort()) {
    total++; const nome = f.replace(/\.js$/, ''), g = gab[nome];
    const r = cp.spawnSync('node', [path.join(base, abord, f)], { encoding: 'utf8', timeout: 10000 });
    const comparavel = g && g.status === 'ok' && g.deterministico && g.portavel && !g.vazio;
    let veredito;
    if (r.status !== 0) veredito = 'ERRO ao executar';
    else if (!comparavel) veredito = 'executa (saída não comparável com o Java)';
    else { comp++; if (r.stdout === g.saida) { ok++; veredito = 'saída idêntica ao Java'; } else veredito = 'SAÍDA DIFERENTE'; }
    const e5 = es5(path.join(base, abord, f)); if (e5 === 'ES5') es5ok++; console.log('  ' + nome.padEnd(48) + e5.padEnd(6) + veredito);
  }
  console.log(`  -> ${ok}/${comp} idênticas ao Java nas samples comparáveis; ${es5ok}/${total} arquivos em ECMAScript 5`);
}
