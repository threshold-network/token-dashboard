# Resume Deposit Receipt Triage

## Test run

- Command: `yarn test:triage --runInBand`
- Status: ✅ Passed (warnings only from mocked Chakra props)
- Connected account now uses the depositor’s `identifierHex` (prefixed with `0x`) from each receipt, validated as a proper Ethereum address.

## Findings by receipt

1. `673.json`

   - Issue: Chain name mismatch. Receipt `networkInfo.chainName` is `"Ethereum Mainnet"`, but for `chainId: "1"` the app expects `"Ethereum"`, so validation rejects it.

2. `680.json`
   - Issue: With depositor-aligned account, flow proceeds and calls `initiateDepositFromDepositScriptParameters`; no validation errors surfaced in this triage scenario (i.e., it succeeds when the depositor matches).

## Notes

- BTC address validation and network-name resolution are mocked in the triage tests; warnings in the test output are from mocked UI components forwarding Chakra-only props.
