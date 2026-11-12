// Verifica se um arquivo .js usa só sintaxe ECMAScript 5, com o parser acorn embutido no Node (precisa de --expose-internals).
// Uso como módulo: require('./es5')(arquivo) -> {ok:true|false|null, erro?}.  Uso como CLI: node es5.js a.js b.js
const cp = require('child_process');
const SCRIPT = "const a=require('internal/deps/acorn/acorn/dist/acorn');const s=require('fs').readFileSync(process.argv[1],'utf8');try{a.parse(s,{ecmaVersion:5});console.log('OK')}catch(e){console.log('ERRO '+e.message)}";
function es5(file) {
  const r = cp.spawnSync(process.execPath, ['--expose-internals', '-e', SCRIPT, file], { encoding: 'utf8', timeout: 15000 });
  const o = (r.stdout || '').trim();
  if (r.status !== 0 || !o) return { ok: null, erro: 'verificador ES5 indisponivel neste Node' };
  return o === 'OK' ? { ok: true } : { ok: false, erro: o.replace(/^ERRO /, '') };
}
module.exports = es5;
if (require.main === module) { let bad = 0; for (const f of process.argv.slice(2)) { const r = es5(f); if (r.ok !== true) bad++; console.log((r.ok === true ? 'ES5 ok   ' : r.ok === false ? 'NAO ES5  ' : 'n/d      ') + f + (r.erro ? '  ' + r.erro : '')); } process.exit(bad ? 1 : 0); }
