#!/usr/bin/env bash
# Local security scan for Lily's Sweet Treats (static analysis).
# Usage: bash scripts/security-scan.sh
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "=== 1) Dependency audit (npm) ==="
npm audit --audit-level=high || true

echo ""
echo "=== 2) Secrets-ish patterns in source (no .env) ==="
if command -v grep >/dev/null 2>&1; then
  grep -RInE 'sk_live_|sk_test_[A-Za-z0-9]{20,}|whsec_[A-Za-z0-9]+|SUPABASE_SERVICE_ROLE|BEGIN (RSA |OPENSSH )?PRIVATE KEY' \
    --include='*.ts' --include='*.tsx' --include='*.js' --include='*.jsx' --include='*.mjs' \
    --exclude-dir=node_modules --exclude-dir=.next --exclude-dir=.git \
    src public scripts 2>/dev/null && echo "⚠ Possible secrets found above" || echo "OK: no hardcoded secret patterns in source"
fi

echo ""
echo "=== 3) Semgrep SAST (if installed) ==="
SEMGREP=""
if command -v semgrep >/dev/null 2>&1; then
  SEMGREP=semgrep
elif [ -x "$HOME/Library/Python/3.14/bin/semgrep" ]; then
  SEMGREP="$HOME/Library/Python/3.14/bin/semgrep"
fi
if [ -n "$SEMGREP" ]; then
  "$SEMGREP" --config=p/owasp-top-ten --config=p/typescript --config=p/react \
    --exclude='node_modules' --exclude='.next' src || true
else
  echo "semgrep not installed — skip (pip install semgrep)"
fi

echo ""
echo "=== 4) Done. Also run dynamic checks against localhost after start.sh ==="
echo "    See SECURITY-AUDIT.md for the full checklist."
