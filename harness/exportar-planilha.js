#!/usr/bin/env node
// Junta TODOS os resultados dos harness (A, B, C; DF e CF) em um CSV que abre direto no Excel.
// Uso: node exportar-planilha.js [raiz-do-repo] [arquivo-saida]
//   raiz padrão: pasta acima de _publicar (ou $W no container); saída padrão: _publicar/docs/resultados-todas-execucoes.csv
// Uma linha por (pasta de execução, sample, repetição). Sem dependências.
const fs = require('fs'), path = require('path');
const root = process.argv[2] || process.env.W || path.resolve(__dirname, '..', '..');
const out = process.argv[3] || path.join(root, '_publicar', 'docs', 'resultados-todas-execucoes.csv');
const SETS = [['DF', path.join(root, 'estudo', 'resultados-harness')], ['CF', path.join(root, '_publicar', 'estudo-cf', 'resultados-harness')]];
const jl = f => fs.existsSync(f) ? fs.readFileSync(f, 'utf8').split('\n').filter(l => l.trim()).map(l => { try { return JSON.parse(l); } catch (e) { return null; } }).filter(Boolean) : [];
const cfg = d => { const o = {}; const f = path.join(d, 'config.txt'); if (fs.existsSync(f)) for (const l of fs.readFileSync(f, 'utf8').split('\n')) { const i = l.indexOf('='); if (i > 0) o[l.slice(0, i)] = l.slice(i + 1).trim(); } return o; };
const cols = ['conjunto', 'pasta', 'data_execucao', 'abordagem', 'modo', 'modelo', 'temperatura', 'valida', 'sample', 'rep', 'comparavel', 'L1_gerou', 'L2_executa', 'ES5', 'L3_saida_igual', 'rodadas', 'tokens_entrada', 'tokens_resposta', 'tokens_raciocinio', 'tokens_total', 'latencia_ms_resposta', 'literal_suspeito', 'tentativas_transitorias', 'jsweet_segundos_total', 'jsweet_ms', 'js_sha256', 'observacao'];
const rows = [];
for (const [conj, base] of SETS) {
  if (!fs.existsSync(base)) continue;
  for (const pasta of fs.readdirSync(base).sort()) {
    const d = path.join(base, pasta); if (!fs.statSync(d).isDirectory() || !/^[ABC]-/.test(pasta)) continue;
    const ab = pasta[0], c = cfg(d), av = jl(path.join(d, 'avaliacao.jsonl')), ex = jl(path.join(d, 'execucoes.jsonl')), tp = jl(path.join(d, 'tempos.jsonl'));
    // chamadas à IA, agregadas por sample+rep (soma das rodadas)
    const ch = {}; const cd = path.join(d, 'chamadas');
    if (fs.existsSync(cd)) for (const f of fs.readdirSync(cd).filter(f => f.endsWith('.json'))) {
      const m = f.match(/^(.*)-(\d+)-r(\d+)\.json$/); if (!m) continue;
      let j; try { j = JSON.parse(fs.readFileSync(path.join(cd, f), 'utf8')); } catch (e) { continue; }
      const k = m[1] + '|' + m[2]; const o = ch[k] = ch[k] || { rod: 0, ti: 0, tr: 0, tt: 0, tot: 0, ms: 0, sus: false, tent: 0, http: [], infra: false };
      const u = j.uso || {}; o.rod++; o.ti += u.promptTokenCount || 0; o.tr += u.candidatesTokenCount || 0; o.tt += u.thoughtsTokenCount || 0; o.tot += u.totalTokenCount || 0;
      o.ms += j.ms_resposta || 0; o.sus = o.sus || !!j.literal_suspeito; o.tent += (j.tentativas_transitorias || []).length; o.http.push(j.http); o.infra = o.infra || !!j.infra_falhou;
    }
    const invPasta = fs.existsSync(path.join(d, 'INVALIDA.txt'));
    const exm = {}; for (const e of ex) exm[e.sample + '|' + e.rep] = e;
    const tpm = {}; for (const t of tp) tpm[t.rep] = t;
    const m = /(\d{8})-(\d{6})/.exec(pasta); const data = m ? `${m[1].slice(6, 8)}/${m[1].slice(4, 6)}/${m[1].slice(0, 4)} ${m[2].slice(0, 2)}:${m[2].slice(2, 4)}` : '';
    const modo = c.modo === 'revisao' ? 'revisão' : ab === 'B' ? 'correção' : ab === 'C' ? 'tradução direta' : 'JSweet';
    for (const a of av) {
      const k = a.sample + '|' + a.rep, o = ch[k] || {}, e = exm[k] || {}, t = tpm[a.rep] || {};
      const ruim = o.infra || (o.http || []).some(h => h >= 400);
      const valida = invPasta ? 'não (INVALIDA.txt)' : ruim ? 'não (erro de API)' : 'sim';
      const seg = t.segundos_total ?? t.segundos;
      const obs = (ab === 'A' && typeof seg === 'number' && seg < 0) ? 'tempo negativo (ajuste de relógio do Docker); resultado L1/L2/L3 válido' : '';
      rows.push({ conjunto: conj, pasta, data_execucao: data, abordagem: ab, modo, modelo: ab === 'A' ? '' : (c.modelo || ''), temperatura: ab === 'A' ? '' : (c.temperatura || ''), valida,
        sample: a.sample, rep: a.rep, comparavel: a.comparavel ? 'sim' : 'não', L1_gerou: a.L1 ? 'sim' : 'não', L2_executa: a.L2 ? 'sim' : 'não', ES5: a.ES5 === true ? 'sim' : a.ES5 === false ? 'não' : '',
        L3_saida_igual: a.comparavel ? (a.L3 ? 'sim' : 'não') : 'n/a', rodadas: ab === 'A' ? '' : (e.rodadas || o.rod || ''),
        tokens_entrada: o.ti ?? '', tokens_resposta: o.tr ?? '', tokens_raciocinio: o.tt ?? '', tokens_total: o.tot ?? '', latencia_ms_resposta: o.ms ?? '',
        literal_suspeito: o.rod ? (o.sus ? 'sim' : 'não') : '', tentativas_transitorias: o.tent ?? '',
        jsweet_segundos_total: ab === 'A' ? (t.segundos_total ?? t.segundos ?? '') : '', jsweet_ms: ab === 'A' ? (t.jsweet_ms ?? '') : '', js_sha256: a.js_sha256 || '', observacao: obs });
    }
  }
}
const esc = v => { v = String(v ?? ''); return /[;"\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v.replace(/\./g, c => c); };
const num = v => typeof v === 'number' ? String(v).replace('.', ',') : v; // vírgula decimal para Excel pt-BR
const csv = '﻿' + cols.join(';') + '\n' + rows.map(r => cols.map(c => esc(num(r[c]))).join(';')).join('\n') + '\n';
fs.mkdirSync(path.dirname(out), { recursive: true }); fs.writeFileSync(out, csv);
console.log(`planilha: ${rows.length} linhas de ${new Set(rows.map(r => r.pasta)).size} execuções -> ${out}`);
