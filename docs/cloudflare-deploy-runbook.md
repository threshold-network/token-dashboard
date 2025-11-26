# Cloudflare Pages Deploy (token-dashboard-legacy)

## Workflow

- File: `.github/workflows/cloudflare-legacy-deployment.yml`
- Trigger: `workflow_dispatch` with inputs
  - `branch` (default `main`)
  - `env_prefix` (optional path/alias override)
- Jobs: `Build` (yarn build, artifact upload) → `Deploy` (wrangler pages deploy)
  → smoke check.
- Environment gate: `cloudflare-production` (approve in Actions UI).

## Required secrets

- `CF_PAGES_API_TOKEN` (Pages:Edit scope)
- `CLOUDFLARE_ACCOUNT_ID`
- Build secrets: `ALCHEMY_API_KEY`, `MAINNET_ELECTRUMX_PROTOCOL`,
  `MAINNET_ELECTRUMX_HOST`, `MAINNET_ELECTRUMX_PORT`, `MAINNET_SENTRY_DSN`,
  `TRM_SUPPORT`, `WALLET_CONNECT_PROJECT_ID`, `TBTC_SUBGRAPH_API_KEY`,
  `GOOGLE_TAG_MANAGER_ID`, `GOOGLE_TAG_MANAGER_SUPPORT` (true/false in workflow
  env).

## How to deploy

```bash
# from any machine with gh auth
gh workflow run cloudflare-legacy-deployment.yml -f branch=main
# approve the environment prompt in GitHub Actions
```

- Production URL: https://token-dashboard-legacy.pages.dev
- Custom domain: https://old-app.threshold.network
- Post-deploy smoke: curls
  `https://old-app.threshold.network/overview/network` (fails the job on
  non-200/301).

## Notes

- Wrangler pinned to 4.50.0.
- If you need a preview alias, pass `env_prefix=preview/<branch>` so Pages uses
  that alias.
- Redirects/headers can be added via `_redirects` / `_headers` in the repo.
- Current legacy deployment is intentionally non-indexable: `_headers` sets
  `X-Robots-Tag: noindex, nofollow` and `robots.txt` disallows all. Remove these
  when you want search indexing back.
