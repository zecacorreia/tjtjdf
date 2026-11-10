#!/usr/bin/env bash
# Atalho para o Git Bash: roda o lote do JSweet (DF e CF) no Docker. Execute a partir da pasta tjtjdf (raiz do projeto).
# Uso:  bash _publicar/harness/jsweet-lote-docker.sh            (df e cf)
#       CONJUNTOS=cf REPS=1 bash _publicar/harness/jsweet-lote-docker.sh
#       PUBLICAR=1 bash _publicar/harness/jsweet-lote-docker.sh  (copia o JS para testes-js/)
export MSYS_NO_PATHCONV=1
docker run --rm -v "$(pwd -W):/work" -v "$HOME/.m2:/root/.m2" \
  -e CONJUNTOS="${CONJUNTOS:-df cf}" -e REPS="${REPS:-3}" -e PUBLICAR="${PUBLICAR:-0}" \
  tjtjdf-harness bash /work/_publicar/harness/jsweet-lote.sh
