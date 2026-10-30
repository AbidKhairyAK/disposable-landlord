#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR"

ensure_ssh_agent() {
  if ssh-add -l >/dev/null 2>&1; then
    return 0
  fi

  if [[ -z "${SSH_AUTH_SOCK:-}" ]]; then
    echo "-> starting ssh-agent"
    eval "$(ssh-agent -s)" >/dev/null
  fi

  if ssh-add -l >/dev/null 2>&1; then
    return 0
  fi

  local -a candidates=()
  if [[ -n "${SSH_KEY_PATH:-}" ]]; then
    candidates+=("$SSH_KEY_PATH")
  fi
  candidates+=(
    "$HOME/.ssh/id_ed25519"
    "$HOME/.ssh/id_rsa"
    "$HOME/.ssh/github"
    "$HOME/.ssh/github_rsa"
  )

  for key in "${candidates[@]}"; do
    if [[ -f "$key" ]]; then
      echo "-> loading ssh key: $key"
      ssh-add "$key"
      break
    fi
  done

  if ! ssh-add -l >/dev/null 2>&1; then
    echo "ERROR: no SSH identity is loaded for GitHub private dependency access." >&2
    echo "Hint: run 'ssh-add <path-to-key>' or set SSH_KEY_PATH before running this script." >&2
    exit 1
  fi
}

ensure_ssh_agent

export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1

echo "-> building lexa-landlord image"
docker compose build "$@"
