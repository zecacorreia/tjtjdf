#!/usr/bin/env node
// Gera a saída de referência do Java (lançador normal, sem args=null), com status de execução.
// Uso: node gabarito.js <dir-samples-preparadas> <dir-saida>
const fs = require('fs'), path = require('path'), cp = require('child_process');
const [, , src, out] = process.argv;
if (!src || !out) { console.error('uso: node gabarito.js <samples-preparadas> <saida>'); process.exit(2); }
const classes = path.join(out, 'classes'); fs.mkdirSync(classes, { recursive: true });
const files = fs.readdirSync(src).filter(f => f.endsWith('.java')).map(f => path.join(src, f));
const hasJavac = cp.spawnSync('javac', ['-version']).status === 0;
const cmd = hasJavac ? ['javac'] : ['java', '-m', 'jdk.compiler/com.sun.tools.javac.Main'];
const c = cp.spawnSync(cmd[0], [...cmd.slice(1), '-nowarn', '-d', classes, ...files], { encoding: 'utf8' });
if (c.status !== 0) { console.error(c.stderr); process.exit(1); }
const ID_HASH = /(\[L[\w.$;]+|[\w.$]+)@[0-9a-f]{5,8}\b/;   // identidade de objeto da JVM (varia entre máquinas e não existe em JS)
const res = {}; const RUNS = 3; let erros = 0;
for (const f of fs.readdirSync(src).filter(f => f.endsWith('.java')).sort()) {
  const name = f.replace(/\.java$/, ''); const runs = [];
  for (let i = 0; i < RUNS; i++) { const r = cp.spawnSync('java', ['-cp', classes, 'br.unb.cic.analysis.samples.' + name], { encoding: 'utf8' }); runs.push(r); }
  const falhou = runs.some(r => r.status !== 0);
  const saida = runs[0].stdout;
  res[name] = { saida, status: falhou ? 'erro' : 'ok', erro: falhou ? (runs.find(r => r.status !== 0).stderr || '').split('\n').find(l => l && !/JAVA_TOOL/.test(l)) : undefined,
    deterministico: runs.every(r => r.stdout === saida), portavel: !ID_HASH.test(saida), vazio: saida === '' };
  if (falhou) erros++;
  fs.writeFileSync(path.join(out, name + '.txt'), saida);
}
fs.writeFileSync(path.join(out, 'gabarito.json'), JSON.stringify(res, null, 1));
for (const [k, v] of Object.entries(res)) console.log(k.padEnd(48), v.status === 'erro' ? 'ERRO: ' + v.erro : v.vazio ? 'sem saida' : !v.portavel ? 'NAO PORTAVEL (identidade de objeto)' : !v.deterministico ? 'NAO DETERMINISTICO' : 'ok');
process.exit(erros ? 1 : 0);
