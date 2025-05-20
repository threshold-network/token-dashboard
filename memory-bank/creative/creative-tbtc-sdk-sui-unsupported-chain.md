🎨🎨🎨 ENTERING CREATIVE PHASE: ARCHITECTURE DESIGN (DEBUGGING) 🎨🎨🎨
Focus: TBTC SDK "Unsupported destination chain" error during SUI wallet integration.
Objective: Identify why the `destinationChainName` passed to the SDK's `initializeCrossChain` method is not recognized as "Sui", and propose solutions.
Requirements:

- Successful call to `sdk.initializeCrossChain` for SUI.
- Correct `destinationChainName` (expected: "Sui") being passed to the SDK.

## Component Description

After resolving the "L1 Cross-chain contracts loader not available" error by ensuring the core SDK is initialized with `crossChainSupport: true` (via `this._crossChainConfig.isCrossChain`), a new error has emerged: "Unsupported destination chain".

This error occurs within the `@keep-network/tbtc-v2.ts` SDK's `initializeCrossChain` method, specifically in its `switch` statement if the provided `destinationChainName` does not match "Base", "Arbitrum", "Solana", or "Sui".

The `destinationChainName` is determined in `src/threshold-ts/tbtc/index.ts` within the `_initiateCrossChain` method:

```typescript
const connectedChainId = await chainIdFromSigner(signer) // e.g., Sepolia's ID
const destinationChainName =
  this._crossChainConfig.chainName === ChainName.Ethereum
    ? getEthereumNetworkNameFromChainId(connectedChainId)
    : this._crossChainConfig.chainName // This should be ChainName.Sui (string "Sui")
```

`this._crossChainConfig.chainName` is updated in `ThresholdContext.tsx` when a non-EVM wallet (like SUI) connects, using `nonEVMChainName`.

## Requirements & Constraints

- The `destinationChainName` variable must resolve to the exact string "Sui" (case-sensitive, as typically expected in switch cases) for the SDK to correctly identify the SUI pathway.
- The `ChainName` enum used in `token-dashboard` must align with the string values expected by the `@keep-network/tbtc-v2.ts` SDK.

## Options Analysis

### Option 1: Verify Enum Values and String Representation of `ChainName.Sui`

**Description**: Inspect the definition of the `ChainName` enum (specifically `ChainName.Sui`) used in `token-dashboard` (`src/threshold-ts/types/index.ts` or similar) and ensure its string value is exactly "Sui". Also, log the actual value of `destinationChainName` being passed to the SDK's `initializeCrossChain` method to confirm its runtime value.
**Pros**:

- Directly targets the most likely cause (string mismatch).
- Simple to verify with logging and code inspection.
  **Cons**:
- If the enum is correct, this won't solve the issue, but it's a necessary check.
  **Complexity**: Low
  **Implementation Time**: <1 hour (inspection + logging)

**Investigation Steps for Option 1**:

1.  Locate and inspect the definition of the `ChainName` enum, particularly `ChainName.Sui`. This is likely in `src/threshold-ts/types.ts` or `src/threshold-ts/types/index.ts` based on `EthereumConfig`, `BitcoinConfig`, `CrossChainConfig` imports in `src/threshold-ts/tbtc/index.ts`.
2.  In `src/threshold-ts/tbtc/index.ts`, inside the `_initiateCrossChain` method, add a log just before calling `await sdk.initializeCrossChain(...)`:
    ```typescript
    console.log(
      "[Threshold SDK Wrapper] Calling initializeCrossChain with destinationChainName:",
      destinationChainName,
      "Original this._crossChainConfig.chainName:",
      this._crossChainConfig.chainName
    )
    await sdk.initializeCrossChain(
      destinationChainName as DestinationChainName, // The type DestinationChainName comes from the SDK
      signer,
      this._crossChainConfig.nonEVMProvider
    )
    ```
3.  Run the SUI connection flow and observe the console output for `destinationChainName`.

### Option 2: Analyze Logic in `getEthereumNetworkNameFromChainId`

**Description**: If the logic incorrectly routes to `getEthereumNetworkNameFromChainId(connectedChainId)`, ensure this function doesn't return a value that somehow overrides or confuses the SUI path. This is less likely if `this._crossChainConfig.chainName` is correctly set to `ChainName.Sui`.
**Pros**:

- Rules out a more complex interaction.
  **Cons**:
- Unlikely to be the primary issue if `this._crossChainConfig.chainName` is not `ChainName.Ethereum`.
  **Complexity**: Low
  **Implementation Time**: <1 hour (code review)

**Investigation Steps for Option 2**:

1.  Review the condition `this._crossChainConfig.chainName === ChainName.Ethereum`. If `ChainName.Sui` is a distinct value, this path should not be taken for SUI.
2.  Briefly review `getEthereumNetworkNameFromChainId` (likely in `src/networks/utils/index.ts` or similar) to understand its return values, ensuring it doesn't produce unexpected outputs like "Sui" by mistake for an L1 ID, which could cause confusion if the primary condition was flawed.

### Option 3: Explicitly Map to SDK's Expected String Value

**Description**: If `ChainName.Sui` has a different string value (e.g., lowercase "sui"), or if there's uncertainty, explicitly map the `token-dashboard`'s internal `ChainName.Sui` to the SDK's expected string "Sui" when calling `sdk.initializeCrossChain`.
**Pros**:

- Robustly ensures the correct string is passed to the SDK, regardless of internal enum differences.
  **Cons**:
- Adds a small mapping layer; ideally, enums/constants should align.
  **Complexity**: Low
  **Implementation Time**: <1 hour (minor code change if needed)

**Implementation Example for Option 3 (if needed)**:

```typescript
// In _initiateCrossChain method in src/threshold-ts/tbtc/index.ts
let sdkDestinationChainName: string;
if (resolvedDestinationChainName === ChainName.Sui) { // Assuming resolvedDestinationChainName is what destinationChainName was before
  sdkDestinationChainName = "Sui"; // Ensure exact string for SDK
} else if (resolvedDestinationChainName === ChainName.Base) {
  sdkDestinationChainName = "Base";
} else if (resolvedDestinationChainName === ChainName.Arbitrum) {
  sdkDestinationChainName = "Arbitrum";
} // ... etc.
 else {
  sdkDestinationChainName = resolvedDestinationChainName; // pass through
}

console.log("[Threshold SDK Wrapper] Calling initializeCrossChain with SDK destinationChainName:", sdkDestinationChainName);
avait sdk.initializeCrossChain(
  sdkDestinationChainName as DestinationChainName, // SDK's DestinationChainName type
  signer,
  this._crossChainConfig.nonEVMProvider
);
```

## Recommended Approach

Start with **Option 1: Verify Enum Values and String Representation of `ChainName.Sui`**. This is the most direct and common cause for such errors. Logging the `destinationChainName` will provide immediate insight.

If logging shows an unexpected value (e.g., lowercase "sui", a numeric value, or even `undefined`/`null`), then the definition of `ChainName.Sui` or how `nonEVMChainName` is populated in `ThresholdContext.tsx` needs to be corrected. If logging shows the _correct_ string "Sui" but the error still occurs, it would imply a more subtle issue within the SDK's switch statement or the types, which is less likely for a simple string comparison.

## Implementation Guidelines (for investigating Option 1)

1.  **Locate `ChainName` enum**: Find its definition (expected in `src/threshold-ts/types.ts` or `src/threshold-ts/types/index.ts`).
2.  **Add Logging**: Implement the `console.log` statement in `src/threshold-ts/tbtc/index.ts`'s `_initiateCrossChain` method as described in Option 1.
3.  **Test**: Re-run the SUI wallet connection flow.
4.  **Analyze**: Check the console. If `destinationChainName` is not exactly "Sui", investigate why. If it is "Sui" and the error still occurs, we need to re-evaluate assumptions about the SDK's `switch` statement.

## Verification Checkpoint

- [ ] Is `destinationChainName` logged with the expected value "Sui" (case-sensitive)?
- [ ] If not, has the source of the incorrect value (enum definition, variable assignment) been identified?
- [ ] Does the `sdk.initializeCrossChain` call succeed after ensuring the correct string is passed?

🎨🎨🎨 EXITING CREATIVE PHASE - DECISION MADE 🎨🎨🎨
Summary: Investigated the "Unsupported destination chain" error. The primary suspect is a mismatch in the string value for the SUI chain name between the `token-dashboard`'s internal representation and the string expected by the `@keep-network/tbtc-v2.ts` SDK.
Key Decisions: Prioritize verifying the `ChainName.Sui` enum value and logging the actual `destinationChainName` passed to the SDK.
Next Steps: Proceed with the investigation steps for Option 1.
