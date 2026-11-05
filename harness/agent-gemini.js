#!/usr/bin/env node
// Atalho de compatibilidade: o agente agora é independente de fornecedor (agent-llm.js); aqui o padrão continua sendo o Gemini.
process.env.LLM_PROVIDER = process.env.LLM_PROVIDER || 'gemini';
require('./agent-llm.js');
