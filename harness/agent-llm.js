#!/usr/bin/env node
// Agente da abordagem B (e base da C), independente de fornecedor. Uma chamada = uma rodada de correção do Sample.js.
// Uso: node agent-llm.js <pasta-da-sample> <saida-chamada.json>      (a pasta tem Sample.java, Sample.js, gabarito.txt, FALHA.json)
//      node agent-llm.js --list                                       (só Gemini: lista os modelos da chave)
// Ambiente:
//   LLM_PROVIDER  gemini (padrão) | anthropic | openai   ("openai" serve para qualquer API compatível: OpenAI, Groq, OpenRouter, DeepSeek, Mistral, Ollama...)
//   LLM_MODEL     nome do modelo (para o Gemini também vale GEMINI_MODEL)
//   chave         GEMINI_API_KEY | ANTHROPIC_API_KEY | OPENAI_API_KEY (ou LLM_API_KEY para qualquer um; no Ollama local pode ficar vazia)
//   LLM_BASE      URL base (obrigatória para APIs compatíveis que não são da OpenAI; ex.: https://api.groq.com/openai/v1)
//   AGENT_MODE    traduzir = abordagem C (traduz Sample.java direto; a pasta só precisa de Sample.java); vazio = B (corrige o Sample.js do JSweet)
//   LLM_TEMP      temperatura (padrão 0; "none" não envia o parâmetro, necessário em alguns modelos de raciocínio)
//   LLM_MAX_TOKENS  limite de saída (padrão 8192; Anthropic: padrão 8192; OpenAI-compatível: só enviado se definido)
// O campo "uso" do JSON de saída usa sempre os nomes do Gemini (promptTokenCount, candidatesTokenCount, thoughtsTokenCount, totalTokenCount).
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const P = (process.env.LLM_PROVIDER || 'gemini').toLowerCase();
if (!['gemini', 'anthropic', 'openai'].includes(P)) { console.error('LLM_PROVIDER deve ser gemini, anthropic ou openai'); process.exit(2); }
const KEY = { gemini: process.env.GEMINI_API_KEY || process.env.LLM_API_KEY, anthropic: process.env.ANTHROPIC_API_KEY || process.env.LLM_API_KEY, openai: process.env.OPENAI_API_KEY || process.env.LLM_API_KEY || '' }[P];
const BASE = { gemini: process.env.GEMINI_BASE || process.env.LLM_BASE || 'https://generativelanguage.googleapis.com/v1beta', anthropic: process.env.LLM_BASE || 'https://api.anthropic.com', openai: process.env.LLM_BASE || 'https://api.openai.com/v1' }[P];
if (KEY === undefined || (P !== 'openai' && !KEY)) { console.error(`defina a chave do provedor ${P} (${P === 'gemini' ? 'GEMINI_API_KEY' : 'ANTHROPIC_API_KEY'} ou LLM_API_KEY)`); process.exit(2); }
const tEnv = process.env.LLM_TEMP ?? process.env.GEMINI_TEMP; const TEMP = tEnv === 'none' ? undefined : Number(tEnv ?? 0);
const sleep = ms => new Promise(res => setTimeout(res, ms));

function montar(prompt, MODEL) {
  if (P === 'gemini') return { url: `${BASE}/models/${MODEL}:generateContent`, headers: { 'x-goog-api-key': KEY }, body: { contents: [{ role: 'user', parts: [{ text: prompt }] }], generationConfig: TEMP === undefined ? {} : { temperature: TEMP } } };
  if (P === 'anthropic') return { url: `${BASE}/v1/messages`, headers: { 'x-api-key': KEY, 'anthropic-version': '2023-06-01' }, body: { model: MODEL, max_tokens: Number(process.env.LLM_MAX_TOKENS || 8192), ...(TEMP === undefined ? {} : { temperature: TEMP }), messages: [{ role: 'user', content: prompt }] } };
  return { url: `${BASE}/chat/completions`, headers: KEY ? { authorization: `Bearer ${KEY}` } : {}, body: { model: MODEL, messages: [{ role: 'user', content: prompt }], ...(TEMP === undefined ? {} : { temperature: TEMP }), ...(process.env.LLM_MAX_TOKENS ? { max_tokens: Number(process.env.LLM_MAX_TOKENS) } : {}) } };
}
function ler(j) {
  if (P === 'gemini') { const c = (j.candidates || [])[0]; return { text: (c?.content?.parts || []).map(p => p.text || '').join(''), uso: j.usageMetadata || null, finish: c?.finishReason || null }; }
  if (P === 'anthropic') { const u = j.usage; return { text: (j.content || []).filter(b => b.type === 'text').map(b => b.text).join(''), uso: u ? { promptTokenCount: u.input_tokens, candidatesTokenCount: u.output_tokens, thoughtsTokenCount: 0, totalTokenCount: (u.input_tokens || 0) + (u.output_tokens || 0) } : null, finish: j.stop_reason || null };}
  const u = j.usage, rac = u?.completion_tokens_details?.reasoning_tokens || 0;
  return { text: j.choices?.[0]?.message?.content || '', uso: u ? { promptTokenCount: u.prompt_tokens, candidatesTokenCount: (u.completion_tokens || 0) - rac, thoughtsTokenCount: rac, totalTokenCount: u.total_tokens ?? (u.prompt_tokens || 0) + (u.completion_tokens || 0) } : null, finish: j.choices?.[0]?.finish_reason || null };
}
const msgErro = j => JSON.stringify(j.error || j).slice(0, 400);

(async () => {
  if (process.argv[2] === '--list') {
    if (P !== 'gemini') { console.error('--list só existe para o Gemini; para os outros, veja a documentação do provedor'); process.exit(2); }
    const r = await fetch(`${BASE}/models?pageSize=200`, { headers: { 'x-goog-api-key': KEY } }); const j = await r.json();
    if (!r.ok) { console.error(msgErro(j)); process.exit(1); }
    for (const m of j.models) if ((m.supportedGenerationMethods || []).includes('generateContent')) console.log(m.name.replace('models/', ''), '-', m.displayName || ''); return;
  }
  const MODEL = process.env.LLM_MODEL || process.env.GEMINI_MODEL; if (!MODEL) { console.error('defina LLM_MODEL (ou GEMINI_MODEL)'); process.exit(2); }
  const [, , dir, out] = process.argv; if (!dir || !out) { console.error('uso: node agent-llm.js <pasta> <saida.json>'); process.exit(2); }
  const rd = f => fs.readFileSync(path.join(dir, f), 'utf8');
  const C = process.env.AGENT_MODE === 'traduzir';   // C: a IA traduz Sample.java direto; a 1a rodada nao ve Sample.js nem gabarito
  const tem = f => fs.existsSync(path.join(dir, f));
  const oldJs = tem('Sample.js') ? rd('Sample.js') : '';
  let prompt;
  if (!C) {
    const instr = fs.readFileSync(path.join(__dirname, 'prompt-B.txt'), 'utf8');
    prompt = `${instr}\n\n=== Sample.java ===\n${rd('Sample.java')}\n\n=== Sample.js ===\n${oldJs}\n\n=== gabarito.txt (saída esperada) ===\n${rd('gabarito.txt')}\n\n=== FALHA.json (resultado do avaliador) ===\n${rd('FALHA.json')}\n`;
  } else {
    prompt = fs.readFileSync(path.join(__dirname, 'prompt-C.txt'), 'utf8') + `\n=== Sample.java ===\n${rd('Sample.java')}\n`;
    if (oldJs) prompt += fs.readFileSync(path.join(__dirname, 'prompt-C-correcao.txt'), 'utf8') + `\n=== Sample.js (anterior) ===\n${oldJs}\n\n=== gabarito.txt (saída esperada) ===\n${rd('gabarito.txt')}\n\n=== FALHA.json (resultado do avaliador) ===\n${rd('FALHA.json')}\n`;
  }
  const req = montar(prompt, MODEL);
  const MAX = Number(process.env.LLM_TENTATIVAS || process.env.GEMINI_TENTATIVAS || 8), TRANS = [429, 500, 502, 503, 504, 529]; const transitorios = [];
  const t0 = Date.now(); let r, j, tTent = t0;
  for (let k = 1; k <= MAX; k++) {
    tTent = Date.now();
    try { r = await fetch(req.url, { method: 'POST', headers: { 'content-type': 'application/json', ...req.headers }, body: JSON.stringify(req.body) }); j = await r.json().catch(() => ({})); }
    catch (e) { r = { ok: false, status: 503 }; j = { error: String(e.cause || e) }; }   // falha de rede conta como transitória
    if (r.ok || !TRANS.includes(r.status)) break;
    if (r.status === 429 && /per ?day|daily/i.test(JSON.stringify(j))) { console.error(`COTA DIÁRIA ESGOTADA (HTTP 429): esperar não resolve hoje. Troque de modelo/provedor ou ative o faturamento.\n${msgErro(j)}`); process.exit(5); }
    transitorios.push(r.status);
    const sug = /retry (?:in|after) ([\d.]+)\s*s/i.exec(JSON.stringify(j)) || (r.headers?.get?.('retry-after') ? [0, r.headers.get('retry-after')] : null);
    const espera = Math.min(120000, sug ? Math.ceil(Number(sug[1]) * 1000) + 2000 : 5000 * 2 ** (k - 1));
    console.error(`HTTP ${r.status} transitorio (tentativa ${k}/${MAX}); aguardando ${Math.round(espera / 1000)}s`);
    if (k < MAX) await sleep(espera);
  }
  const ms = Date.now() - t0, ms_resposta = Date.now() - tTent;
  const infra_falhou = !r.ok && TRANS.includes(r.status);
  if (!r.ok && [400, 401, 402, 403, 404].includes(r.status)) { console.error(`CONFIG: HTTP ${r.status} - ${msgErro(j)}\nConfira a chave e o saldo (402 = saldo insuficiente), LLM_PROVIDER, LLM_MODEL, LLM_BASE e LLM_TEMP (use LLM_TEMP=none se o modelo recusar o parâmetro temperature).`); process.exit(4); }
  const { text, uso, finish } = r.ok ? ler(j) : { text: '', uso: null, finish: null };
  const m = text.match(/```(?:javascript|js)?\n([\s\S]*?)```/); const novo = m ? m[1] : null;
  let aplicado = false, literal_suspeito = false;
  if (r.ok && novo && novo.trim()) {
    const lits = rd('gabarito.txt').split('\n').filter(l => l.trim().length >= 4);
    literal_suspeito = lits.some(l => (novo.includes(`"${l}"`) || novo.includes(`'${l}'`)) && !(oldJs.includes(`"${l}"`) || oldJs.includes(`'${l}'`)));
    fs.writeFileSync(path.join(dir, 'Sample.js'), novo.endsWith('\n') ? novo : novo + '\n'); aplicado = true;
  }
  fs.writeFileSync(out, JSON.stringify({ provedor: P, modelo: MODEL, temperatura: TEMP ?? null, http: r.status, ms, ms_resposta, aplicado, literal_suspeito, tentativas_transitorias: transitorios, infra_falhou,
    prompt_sha256: crypto.createHash('sha256').update(prompt).digest('hex'), uso, finish, erro: r.ok ? null : j.error || j, resposta: text }, null, 1));
  console.log(aplicado ? 'ok' : 'sem alteracao', `${P}/${MODEL}`, JSON.stringify(uso || {}));
  if (infra_falhou) { console.error('INFRA: sem resposta do modelo apos todas as tentativas'); process.exit(3); }
  if (!aplicado) console.error(r.ok ? (text ? 'resposta sem bloco ```js. Inicio da resposta: ' + text.slice(0, 400) : 'resposta sem texto. finish=' + finish) : `ERRO HTTP ${r.status}: ${msgErro(j)}`);
})().catch(e => { console.error(e); process.exit(1); });
