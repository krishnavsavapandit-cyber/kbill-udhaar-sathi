# 🧪 Keploy Integration Guide for Udhaar Saathi

This repository integrates **[Keploy](https://keploy.io/)**, an open-source e2e testing and mock generation tool, to automatically capture and replay API network calls with zero application code changes.

---

## 📁 Keploy Assets in this Repository

| File / Folder | Purpose |
| :--- | :--- |
| [`keploy.yml`](./keploy.yml) | Keploy v2 configuration defining port `3005`, startup command, noise filters, and timeouts. |
| [`keploy/test-set-0/tests/`](./keploy/test-set-0/tests/) | Recorded YAML test cases validating Landing Page (`test-1`), Login Page (`test-2`), Unauthorized 401 Rejection (`test-3`), and PWA Manifest (`test-4`). |
| [`.github/workflows/keploy.yml`](./.github/workflows/keploy.yml) | GitHub Actions CI workflow that installs Keploy and executes automated regression tests on every commit/PR. |
| [`package.json`](./package.json) | Convenient scripts: `npm run keploy:record` and `npm run keploy:test`. |

---

## 🚀 How to Run Keploy Locally

### 1. Install Keploy CLI
On Linux / macOS / Windows WSL2:
```bash
curl -O -L https://keploy.io/install.sh && bash install.sh
```

### 2. Run Existing Keploy Regression Tests
Replay all recorded test cases against your application:
```bash
npm run keploy:test
# Or directly:
keploy test -c "npm run start" --delay 10
```

### 3. Record New API Test Cases
To capture new user flows or endpoints into YAML test cases:
```bash
npm run keploy:record
# Or directly:
keploy record -c "npm run start"
```
1. Open `http://localhost:3005` in your browser or make API calls with `curl`.
2. Keploy will capture the incoming HTTP requests and mock outgoing database/network dependencies.
3. Stop recording with `Ctrl + C`. New YAML test files will appear in `keploy/test-set-0/tests/`.

---

## 🛡️ Zero Core Code Impact
Keploy works at the system network layer and does not require modifying:
- Any React/Next.js UI components
- Any Server Actions or business logic
- Any database schemas or authentication mechanics

All tests are reproducible and executed in CI/CD without side-effects.
