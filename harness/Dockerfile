# Java 11 + Maven (JSweet 3.1.0 / pom com release 11) + Node 22 (avaliador e execução do JS gerado).
FROM maven:3.9-eclipse-temurin-11
RUN apt-get update && apt-get install -y --no-install-recommends curl ca-certificates gnupg \
 && curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
 && apt-get install -y --no-install-recommends nodejs \
 && rm -rf /var/lib/apt/lists/*
# Só para a abordagem B (CLI do Claude Code). Nome do pacote npm assumido; confirme antes de usar.
RUN npm install -g @anthropic-ai/claude-code || echo "claude-code nao instalado (so a abordagem A funciona)"
WORKDIR /work
