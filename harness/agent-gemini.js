#!/usr/bin/env node
// Agente da abordagem B (e base da C) usando a API do Gemini. Uma chamada = uma rodada de correção.
// Uso: node agent-gemini.js <pasta-da-sample> <saida-chamada.json>
//   a pasta tem Sample.java, Sample.js, gabarito.txt e FALHA.json; o script reescreve Sample.js com a resposta do modelo.
//   node agent-gemini.js --list     lista os modelos disponíveis para a sua chave
// Ambiente: GEMINI_API_KEY (obrigatória), GEMINI_MODEL (obrigatória), GEMINI_BASE (opcional, para testes).
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const KEY = process.env.GEMINI_API_KEY, BASE = process.env.GEMINI_BASE || 'https://generativelanguage.googleapis.com/v1beta';
if (!KEY) { console.error('defina GEMINI_API_KEY'); process.exit(2); }
(async () => {
  if (process.argv[2] === '--list') {
    const r = await fetch(`${BASE}/models?pageSize=200`, { headers: { 'x-goog-api-key': KEY } });
    const j = await r.json(); if (!r.ok) { console.error(JSON.stringify(j)); process.exit(1); }
    for (const m of j.models) if ((m.supportedGenerationMethods || []).includes('generateContent')) console.log(m.name.replace('models/', ''), '-', m.displayName || '');
    return;
  }
  const MODEL = process.env.GEMINI_MODEL; if (!MODEL) { console.error('defina GEMINI_MODEL (use --list para ver os nomes)'); process.exit(2); }
  const [, , dir, out] = process.argv; if (!dir || !out) { console.error('uso: node agent-gemini.js <pasta> <saida.json>'); process.exit(2); }
  const rd = f => fs.readFileSync(path.join(dir, f), 'utf8');
  const instr = fs.readFileSync(path.join(__dirname, 'prompt-B.txt'), 'utf8');
  const oldJs = rd('Sample.js');
  const prompt = `${instr}\n\n=== Sample.java ===\n${rd('Sample.java')}\n\n=== Sample.js ===\n${oldJs}\n\n=== gabarito.txt (saída esperada) ===\n${rd('gabarito.txt')}\n\n=== FALHA.json (resultado do avaliador) ===\n${rd('FALHA.json')}\n`;
  const body = { contents: [{ role: 'user', parts: [{ text: prompt }] }], generationConfig: { temperature: 0 } };
  const t0 = Date.now();
  // Falhas de infraestrutura (429 de cota por minuto, 500/502/503/504) não são resposta do modelo: tenta de novo com espera.
  const MAX = Number(process.env.GEMINI_TENTATIVAS || 8), sleep = ms => new Promise(res => setTimeout(res, ms)); const transitorios = [];
  let r, j;
  let tTent = Date.now();
  for (let k = 1; k <= MAX; k++) {
    tTent = Date.now();
    try {
      r = await fetch(`${BASE}/models/${MODEL}:generateContent`, { method: 'POST', headers: { 'content-type': 'application/json', 'x-goog-api-key': KEY }, body: JSON.stringify(body) });
      j = await r.json().catch(() => ({}));
    } catch (e) { r = { ok: false, status: 503 }; j = { error: String(e.cause || e) }; }  // falha de rede conta como transitoria
    if (r.ok || ![429, 500, 502, 503, 504].includes(r.status)) break;
    transitorios.push(r.status);
    const sug = /retry in ([\d.]+)s/i.exec(JSON.stringify(j)); const espera = Math.min(120000, sug ? Math.ceil(Number(sug[1]) * 1000) + 2000 : 5000 * 2 ** (k - 1));
    console.error(`HTTP ${r.status} transitorio (tentativa ${k}/${MAX}); aguardando ${Math.round(espera / 1000)}s`);
    if (k < MAX) await sleep(espera);
  }
  const ms = Date.now() - t0, ms_resposta = Date.now() - tTent;  // ms inclui esperas de retry; ms_resposta e a latencia da ultima tentativa
  const infra_falhou = !r.ok && [429, 500, 502, 503, 504].includes(r.status);
  const text = ((j.candidates || [])[0]?.content?.parts || []).map(p => p.text || '').join('');
  const m = text.match(/```(?:javascript|js)?\n([\s\S]*?)```/);
  const novo = m ? m[1] : null;
  let aplicado = false, literal_suspeito = false;
  if (r.ok && novo && novo.trim()) {
    // sinal de trapaça: linha da saída esperada escrita como literal no JS novo e que não estava no antigo
    const lits = rd('gabarito.txt').split('\n').filter(l => l.trim().length >= 4);
    literal_suspeito = lits.some(l => (novo.includes(`"${l}"`) || novo.includes(`'${l}'`)) && !(oldJs.includes(`"${l}"`) || oldJs.includes(`'${l}'`)));
    fs.writeFileSync(path.join(dir, 'Sample.js'), novo.endsWith('\n') ? novo : novo + '\n'); aplicado = true;
  }
  fs.writeFileSync(out, JSON.stringify({
    modelo: MODEL, http: r.status, ms, ms_resposta, aplicado, literal_suspeito, tentativas_transitorias: transitorios, infra_falhou,
    prompt_sha256: crypto.createHash('sha256').update(prompt).digest('hex'),
    uso: j.usageMetadata || null, finish: (j.candidates || [])[0]?.finishReason || null,
    erro: r.ok ? null : j.error || j, resposta: text,
  }, null, 1));
  console.log(aplicado ? 'ok' : 'sem alteracao', MODEL, JSON.stringify(j.usageMetadata || {}));
  if (infra_falhou) { console.error('INFRA: sem resposta do modelo apos todas as tentativas'); process.exit(3); }
  if (!aplicado) {
    if (!r.ok) console.error(`ERRO HTTP ${r.status}:`, JSON.stringify(j.error || j).slice(0, 600));
    else if (!text) console.error('resposta sem texto. finishReason=', (j.candidates || [])[0]?.finishReason, 'promptFeedback=', JSON.stringify(j.promptFeedback || null), 'bruto=', JSON.stringify(j).slice(0, 600));
    else console.error('resposta sem bloco ```js. Inicio da resposta:', text.slice(0, 400));
  }
})().catch(e => { console.error(e); process.exit(1); });
