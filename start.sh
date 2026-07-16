#!/usr/bin/env bash
# One-command local launcher for Lily's Sweet Treats site.
set -euo pipefail
cd "$(dirname "$0")"

if [[ ! -f .env.local ]]; then
  echo "Missing .env.local — copy from .env.example and fill Stripe (+ Resend for emails)."
  exit 1
fi

# Warn if order emails will silently skip
if ! grep -qE '^RESEND_API_KEY=re_' .env.local 2>/dev/null; then
  echo "Note: RESEND_API_KEY is empty — checkout works, confirmation emails will not send locally."
  echo "      Set it from Resend (or Vercel Production env) in .env.local to test emails."
fi

if [[ ! -d node_modules ]]; then
  echo "Installing dependencies…"
  npm install
fi

# Free port 3000 if a stale dev server is holding it
if command -v lsof >/dev/null 2>&1; then
  for p in $(lsof -i :3000 -t 2>/dev/null || true); do
    kill "$p" 2>/dev/null || true
  done
  sleep 0.5
fi

echo "Starting http://localhost:3000 …"
exec npm run dev
