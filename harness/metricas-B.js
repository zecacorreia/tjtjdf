#!/usr/bin/env node
// Relatório completo de métricas de uma execução da abordagem B.
// Uso: node metricas-B.js <pasta-B> [pasta-A]
const fs = require('fs'), path = require('path');
const [, , pb, pa] = process.argv; if (!pb) { console.error('uso: node metricas-B.js <pasta-B> [pasta-A]'); process.exit(2); }
const jl = f => fs.existsSync(f) ? fs.readFileSync(f, 'utf8').trim().split('\n').filter(Boolean).map(JSON.parse) : [];
const ex = jl(path.join(pb, 'execucoes.jsonl')), av = jl(path.join(pb, 'avaliacao.jsonl'));
const cdir = path.join(pb, 'chamadas'); const calls = (fs.existsSync(cdir) ? fs.readdirSync(cdir) : []).filter(f => /-\d+-r\d+\.json$/.test(f)).map(f => { const m = /^(.+)-(\d+)-r(\d+)\.json$/.exec(f); return { sample: m[1], rep: +m[2], rodada: +m[3], ...JSON.parse(fs.readFileSync(path.join(cdir, f), 'utf8')) }; });
const cfg = fs.existsSync(path.join(pb, 'config.txt')) ? fs.readFileSync(path.join(pb, 'config.txt'), 'utf8').trim().replace(/\n/g, ' | ') : '';
const n = (x, d = 0) => x == null || Number.isNaN(x) ? 'n/d' : Number(x).toLocaleString('pt-BR', { maximumFractionDigits: d });
const avg = a => a.length ? a.reduce((x, y) => x + y, 0) / a.length : null;
console.log(`\nExecução B: ${path.basename(pb)}\nconfig: ${cfg}`);
if (fs.existsSync(path.join(pb, 'INVALIDA.txt'))) { console.log('\n*** EXECUÇÃO MARCADA COMO INVÁLIDA: ' + fs.readFileSync(path.join(pb, 'INVALIDA.txt'), 'utf8').trim() + '\n*** Os números abaixo não medem o modelo e não devem ser usados.'); }
console.log('\n=== Por repetição ===');
console.log('sample / rep'.padEnd(40), 'válida', 'L3 ', 'rodadas', '503/429', 'ent', 'resp', 'rac ', 'total', 'ms_resposta', 'seg_total', 'literal?');
const linhas = [];
for (const e of ex) {
  const cs = calls.filter(c => c.sample === e.sample && c.rep === e.rep).sort((a, b) => a.rodada - b.rodada);
  const ok = cs.filter(c => c.uso); const a = av.find(x => x.sample === e.sample && x.rep === e.rep);
  const t = k => ok.reduce((s, c) => s + (c.uso[k] || 0), 0);
  const l = { sample: e.sample, rep: e.rep, valida: !e.invalida_infra, L3: !!(a && a.L3), rodadas: ok.length, transit: cs.reduce((s, c) => s + (c.tentativas_transitorias || []).length, 0),
    ent: t('promptTokenCount'), resp: t('candidatesTokenCount'), rac: t('thoughtsTokenCount'), total: t('totalTokenCount'), ms: avg(ok.map(c => c.ms_resposta).filter(x => x != null)), seg: e.segundos, lit: cs.some(c => c.literal_suspeito), sha: a && a.js_sha256, antes: e.js_antes };
  linhas.push(l);
  console.log(`${l.sample} #${l.rep}`.padEnd(40), (l.valida ? 'sim' : 'NÃO').padEnd(6), (l.valida ? (l.L3 ? 'sim' : 'não') : '-').padEnd(3), String(l.rodadas).padEnd(7), String(l.transit).padEnd(7), n(l.ent).padEnd(4), n(l.resp).padEnd(4), n(l.rac).padEnd(4), n(l.total).padEnd(5), (l.ms == null ? 'n/d' : n(l.ms / 1000, 1) + ' s').padEnd(11), n(l.seg).padEnd(9), l.lit ? 'SIM' : 'não');
}
const v = linhas.filter(l => l.valida);
console.log('\n=== Agregado (só repetições válidas) ===');
console.log(`repetições: ${linhas.length} no total, ${v.length} válidas, ${linhas.length - v.length} invalidadas por falha da API`);
console.log(`taxa de sucesso (L3): ${v.filter(l => l.L3).length}/${v.length}${v.length ? ' = ' + n(100 * v.filter(l => l.L3).length / v.length, 1) + '%' : ''}`);
console.log(`rodadas de correção até acertar (média): ${n(avg(v.filter(l => l.L3).map(l => l.rodadas)), 1)}`);
console.log(`tokens por repetição: média ${n(avg(v.map(l => l.total)))}  (entrada ${n(avg(v.map(l => l.ent)))} + resposta ${n(avg(v.map(l => l.resp)))} + raciocínio ${n(avg(v.map(l => l.rac)))})`);
console.log(`tokens somados da execução: ${n(v.reduce((s, l) => s + l.total, 0))}`);
const lat = avg(v.map(l => l.ms).filter(x => x != null)); console.log(`latência do modelo por chamada: ${lat == null ? 'n/d (execução anterior à gravação de ms_resposta)' : n(lat / 1000, 1) + ' s'}`);
console.log(`erros transitórios da API (503/429): ${linhas.reduce((s, l) => s + l.transit, 0)}`);
console.log(`literal suspeito: ${v.some(l => l.lit) ? 'SIM, revisar as respostas' : 'nenhum'}`);
const shas = new Set(v.map(l => l.sha)); console.log(`JS finais distintos: ${shas.size} de ${v.length} repetições  ${v.length > 1 && shas.size === 1 ? '(idênticos: sem variação entre repetições)' : ''}`);
console.log(`esforço humano na B: 0 edições na tradução (o pré-passo com o main é igual para A, B e C)`);
if (pa) { const a = jl(path.join(pa, 'avaliacao.jsonl')).filter(r => r.rep === 1 && r.comparavel); console.log(`A, para comparar: ${a.filter(r => r.L3).length}/${a.length} em L3 nas comparáveis; a B parte das ${a.filter(r => !r.L3).length} que a A errou`); }
