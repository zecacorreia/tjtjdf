# Java 11 + Maven (JSweet 3.1.0 / pom com release 11) + Node 22 (avaliador e execução do JS gerado).
FROM maven:3.9-eclipse-temurin-11
RUN apt-get update && apt-get install -y --no-install-recommends curl ca-certificates gnupg \
 && curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
 && apt-get install -y --no-install-recommends nodejs \
 && rm -rf /var/lib/apt/lists/*
WORKDIR /work
