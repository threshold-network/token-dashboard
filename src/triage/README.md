# Triage / Diagnostic Tests

These tests reproduce user-reported issues and aid diagnosis; they are **not** product coverage and should not gate releases by default.

## Conventions

1. Location: place triage cases under `src/triage/<area>/`.
2. Naming: use `*.triage.test.tsx` and `describe("Triage: ...")` so intent is clear in output.
3. Fixtures: store user-provided data in `__fixtures__/` alongside the test. These are often sensitive—keep them gitignored (`src/triage/**/__fixtures__/*.json`) and avoid committing real user data. Note provenance and redact or replace before any commit.
4. Scope: keep assertions focused on reproducing the reported behavior (observed vs expected). Avoid broad correctness assertions that belong in unit tests.
5. Links: add a comment in each triage test pointing to the user issue/ticket.

## Running

- All triage tests: `yarn test:triage`
- Single triage suite: `yarn test -- triage <name>` (Jest pattern)

## Browser impersonation tip

- For wallet-related triage that requires mimicking a user’s browser wallet, follow the guidance in the main `README.md` triage section (Impersonator extension link and MetaMask picker note) to avoid duplicating instructions here.

## Adding a triage case

- Include the user report link and reproduction steps in the test description or a short comment.
- Add fixtures and clearly mark any redactions.
- If the case graduates to product coverage, move it out of `src/triage/` into the appropriate area and rename it to a standard `*.test.tsx`.
