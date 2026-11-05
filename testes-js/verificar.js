#!/usr/bin/env node
// Roda cada teste JavaScript e compara a saída com a do programa Java original.
// Uso: node verificar.js [df|cf]      (padrão: df)      Requer apenas Node.js.
const fs = require('fs'), path = require('path'), cp = require('child_process');
const conj = process.argv[2] || 'df', base = path.join(__dirname, conj), ref = path.join(__dirname, 'saida-esperada', conj);
if (!fs.existsSync(base)) { console.error('conjunto inexistente: ' + conj); process.exit(2); }
const gab = JSON.parse(fs.readFileSync(path.join(ref, 'gabarito.json'), 'utf8'));
for (const abord of fs.readdirSync(base).filter(d => fs.statSync(path.join(base, d)).isDirectory()).sort()) {
  console.log('\n== ' + abord); let ok = 0, comp = 0;
  for (const f of fs.readdirSync(path.join(base, abord)).filter(f => f.endsWith('.js')).sort()) {
    const nome = f.replace(/\.js$/, ''), g = gab[nome];
    const r = cp.spawnSync('node', [path.join(base, abord, f)], { encoding: 'utf8', timeout: 10000 });
    const comparavel = g && g.status === 'ok' && g.deterministico && g.portavel && !g.vazio;
    let veredito;
    if (r.status !== 0) veredito = 'ERRO ao executar';
    else if (!comparavel) veredito = 'executa (saída não comparável com o Java)';
    else { comp++; if (r.stdout === g.saida) { ok++; veredito = 'saída idêntica ao Java'; } else veredito = 'SAÍDA DIFERENTE'; }
    console.log('  ' + nome.padEnd(48) + veredito);
  }
  console.log(`  -> ${ok}/${comp} idênticas ao Java nas samples comparáveis`);
}
