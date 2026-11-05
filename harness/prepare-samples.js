#!/usr/bin/env node
// Pré-passo igual para A, B e C: acrescenta um `main` às samples que não têm,
// no FIM da classe (as linhas existentes não se deslocam) e registra cada edição.
// Uso: node prepare-samples.js <dir-samples-originais> <dir-saida>
const fs = require('fs'), path = require('path');
const [, , src, out] = process.argv;
if (!src || !out) { console.error('uso: node prepare-samples.js <originais> <saida>'); process.exit(2); }
const ENTRY = {
  ConfluenceWithTransitivitySample: 'new ConfluenceWithTransitivitySample().foo();',
  SourceSinkMethodCallSample: 'new SourceSinkMethodCallSample().foo();',
  IntraproceduralDataFlow: 'new IntraproceduralDataFlow().foo();',
  IntraproceduralIndirectSource: 'IntraproceduralIndirectSource o = new IntraproceduralIndirectSource(); o.m(); o.a();',
  SourceSinkVariableAttributionSample: 'new SourceSinkVariableAttributionSample().foo();',
  SourceSinkVariableAttributionWithAutoIncrement: 'new SourceSinkVariableAttributionWithAutoIncrement().foo();',
  // conjunto CF (confluence flow). ConfluenceBaseSample nao imprime nada: o main imprime o retorno de countFixes() para a sample ter saida observavel
  ConfluenceBaseSample: 'System.out.println(new ConfluenceBaseSample().countFixes());',
  ConfluenceBaseSample2: 'new ConfluenceBaseSample2().m();',
  InterproceduralConfluenceSample: 'new InterproceduralConfluenceSample().interproceduralSample();',
  MultipleConfluenceSample: 'new MultipleConfluenceSample().multipleConfluencesToTheSameLine();',
};

// Índice da chave que fecha a classe `name` (o arquivo pode ter outras classes depois dela).
function classEnd(code, name) {
  const m = new RegExp('\\bclass\\s+' + name + '\\b[^{]*\\{').exec(code);
  if (!m) throw new Error('classe ' + name + ' nao encontrada');
  let depth = 1, i = m.index + m[0].length;
  for (; i < code.length && depth > 0; i++) {
    const c = code[i], n = code[i + 1];
    if (c === '/' && n === '/') { i = code.indexOf('\n', i); if (i < 0) break; continue; }
    if (c === '/' && n === '*') { i = code.indexOf('*/', i) + 1; continue; }
    if (c === '"') { i++; while (i < code.length && code[i] !== '"') { if (code[i] === '\\') i++; i++; } continue; }
    if (c === '{') depth++; else if (c === '}') depth--;
  }
  return i - 1;
}
fs.mkdirSync(out, { recursive: true });
const rows = ['sample,acao,linha_inserida,trecho'];
for (const f of fs.readdirSync(src).filter(f => f.endsWith('.java')).sort()) {
  const name = f.replace(/\.java$/, ''); let code = fs.readFileSync(path.join(src, f), 'utf8');
  if (/static\s+void\s+main\s*\(/.test(code)) { rows.push(`${name},ja_tinha_main,,`); }
  else {
    const call = ENTRY[name]; if (!call) { console.error('sem regra de entrada para ' + name); process.exit(1); }
    const i = classEnd(code, name);
    const ins = `\n    public static void main(String[] args) { ${call} }\n`;
    code = code.slice(0, i).replace(/\s*$/, '\n') + ins + code.slice(i);
    const line = code.slice(0, code.indexOf('public static void main')).split('\n').length;
    rows.push(`${name},main_acrescentado,${line},"${call}"`);
  }
  fs.writeFileSync(path.join(out, f), code);
}
fs.writeFileSync(path.join(out, 'EDICOES.csv'), rows.join('\n') + '\n');
console.log(rows.join('\n'));
