🎨🎨🎨 ENTERING CREATIVE PHASE: ARCHITECTURE DESIGN (DEBUGGING) 🎨🎨🎨
Focus: TBTC SDK "SUI client is not defined" error during SDK initialization for SUI wallet.
Objective: Understand why the SUI client is not being passed correctly to the SDK and implement a solution.
Requirements:

- Correctly pass a valid SUI client to the SDK's `initializeCrossChain` method.
- Ensure all required parameters are provided when SUI is the destination chain.

## Component Description

After fixing the "Unsupported destination chain" error by correctly mapping `ChainName.SUI` to the string "Sui", we now encounter a new error: "SUI client is not defined". The console log confirms our mapping works:

```
[Threshold SDK Wrapper] Calling initializeCrossChain with destinationChainName: Sui Original this._crossChainConfig.chainName: SUI
```

This new error occurs because the SDK's `initializeCrossChain` method has different parameter requirements based on the destination chain. When "Sui" is the destination, it specifically checks if the `suiClient` parameter is provided:

```typescript
// In @keep-network/tbtc-v2.ts/services/tbtc.ts
case "Sui":
  if (!suiClient) {
    throw new Error("SUI client is not defined")
  }
  if (!suiSigner) {
    throw new Error("SUI signer is not defined")
  }
  // ...rest of the SUI-specific logic...
```

Looking at how our code is calling this method in `src/threshold-ts/tbtc/index.ts`:

```typescript
await sdk.initializeCrossChain(
  destinationChainName as DestinationChainName,
  signer,
  this._crossChainConfig.nonEVMProvider // Passing to the 3rd parameter (solanaProvider)
)
```

The issue is that the `initializeCrossChain` method expects different parameters for different chains:

```typescript
// In @keep-network/tbtc-v2.ts/services/tbtc.ts
async initializeCrossChain(
  destinationChainName: DestinationChainName,
  ethereumChainSigner: EthereumSigner,
  solanaProvider?: any, // 3rd parameter
  suiClient?: SuiClient,  // 4th parameter
  suiSigner?: SuiSigner   // 5th parameter
): Promise<void> {
```

When our code passes `this._crossChainConfig.nonEVMProvider` to the third parameter, it's using the spot meant for `solanaProvider`, but for SUI we need to pass the SUI client to the 4th parameter and the SUI signer to the 5th parameter.

## Requirements & Constraints

- We need to properly distinguish between different types of non-EVM providers in the wrapper code.
- For SUI, we need to call `sdk.initializeCrossChain` with the correct SUI client and signer parameters.
- The `ThresholdContext.tsx` should correctly provide SUI-specific client/signer when SUI wallet is connected.

## Options Analysis

### Option 1: Conditionally Pass Parameters Based on Chain Type

**Description**: Update the `_initiateCrossChain` method to conditionally pass parameters based on the destination chain type. For SUI, pass `undefined` as the 3rd parameter (solanaProvider) and extract/pass the SUI client and signer to the 4th and 5th parameters.
**Pros**:

- Properly aligns with SDK's method signature expectations.
- Clear separation between different chain types.
  **Cons**:
- Requires more knowledge about the specific structure of `nonEVMProvider` for SUI.
- May require modifications to how SUI client/signer are stored in `this._crossChainConfig`.
  **Complexity**: Medium
  **Implementation Time**: 1-2 hours (investigation + implementation)

**Investigation Steps for Option 1**:

1. Examine how `nonEVMProvider` is set in `ThresholdContext.tsx` for SUI wallet connections.
2. Determine if we can extract SUI client and signer from this provider or if additional changes are needed.
3. Update the `_initiateCrossChain` method to conditionally pass parameters:
   ```typescript
   if (destinationChainName === "Sui") {
     // Extract SUI client/signer and pass to correct parameters
     const suiClient = /* extract from nonEVMProvider or state */
     const suiSigner = /* extract from nonEVMProvider or state */
     await sdk.initializeCrossChain(
       destinationChainName as DestinationChainName,
       signer,
       undefined, // No Solana provider
       suiClient,
       suiSigner
     )
   } else {
     // Original call for other chains
     await sdk.initializeCrossChain(
       destinationChainName as DestinationChainName,
       signer,
       this._crossChainConfig.nonEVMProvider
     )
   }
   ```

### Option 2: Enhance CrossChainConfig Type to Store Chain-Specific Providers

**Description**: Modify the `CrossChainConfig` type to explicitly store different types of providers for different chains, rather than a generic `nonEVMProvider`. Then, update `ThresholdContext.tsx` to set the appropriate providers when a wallet connects.
**Pros**:

- Clean, type-safe solution.
- Makes the distinction between different non-EVM providers explicit.
  **Cons**:
- Requires more extensive changes across multiple files.
- Could potentially break existing code that relies on the current structure.
  **Complexity**: High
  **Implementation Time**: 3-4 hours (multiple file changes)

**Implementation Example for Option 2**:

```typescript
// In src/threshold-ts/types/index.ts
export type CrossChainConfig = {
  isCrossChain: boolean
  chainName: ChainName | null
  // Replace generic nonEVMProvider with chain-specific providers
  solanaProvider: AnchorProvider | null
  suiClient: SuiClient | null
  suiSigner: SuiSigner | null
}
```

### Option 3: Direct Hotfix - Assume `nonEVMProvider` Contains SUI Client for SUI Chain

**Description**: Take a more direct approach by assuming that for SUI chains, `nonEVMProvider` is or contains the SUI client and signer we need. Add debugging to understand its structure and use it directly.
**Pros**:

- Potentially simpler if our assumption is correct.
- Less invasive if it works.
  **Cons**:
- May be incorrect if `nonEVMProvider` is structured differently than expected.
- Could lead to runtime errors if assumptions are wrong.
  **Complexity**: Low to Medium
  **Implementation Time**: 1-2 hours (investigation + implementation)

**Investigation Steps for Option 3**:

1. Add extensive logging of `this._crossChainConfig.nonEVMProvider` when SUI is the selected chain.
2. Determine if it contains or is a SUI client, or how to derive the SUI client from it.
3. Implement conditional passing based on findings.

## Recommended Approach

Start with a combination of Option 1 and Option 3:

1. Add debug logging to understand what's in `this._crossChainConfig.nonEVMProvider` for SUI.
2. Based on findings, implement a conditional approach to pass parameters correctly based on the destination chain.

This approach strikes a balance between immediate investigation and a targeted solution without extensive refactoring.

## Implementation Guidelines

1. **Add Debug Logging**:

   ```typescript
   // In _initiateCrossChain method in src/threshold-ts/tbtc/index.ts
   console.log(
     "[Threshold SDK Wrapper] Destination chain:",
     destinationChainName
   )
   console.log(
     "[Threshold SDK Wrapper] nonEVMProvider:",
     this._crossChainConfig.nonEVMProvider
   )
   // Attempt to identify if it contains SUI client/signer
   console.log(
     "[Threshold SDK Wrapper] nonEVMProvider instanceof:",
     this._crossChainConfig.nonEVMProvider
       ? Object.getPrototypeOf(this._crossChainConfig.nonEVMProvider)
           .constructor.name
       : "null"
   )
   ```

2. **Modify Call Based on Destination Chain**:

   ```typescript
   // In _initiateCrossChain method in src/threshold-ts/tbtc/index.ts
   if (destinationChainName === "Sui") {
     // For SUI, we need to pass suiClient and suiSigner as separate parameters
     const nonEVMProvider = this._crossChainConfig.nonEVMProvider
     // Assuming nonEVMProvider is or contains the SUI client - TO BE VERIFIED
     await sdk.initializeCrossChain(
       destinationChainName as DestinationChainName,
       signer,
       undefined, // No Solana provider for SUI
       nonEVMProvider, // Attempt to pass as suiClient
       nonEVMProvider // Attempt to pass as suiSigner - may need adjustment
     )
   } else {
     // Original call for other chains
     await sdk.initializeCrossChain(
       destinationChainName as DestinationChainName,
       signer,
       this._crossChainConfig.nonEVMProvider
     )
   }
   ```

3. **Analyze Results and Refine**:
   - Run the code and analyze the logs to understand what's in `nonEVMProvider`.
   - Refine the approach based on findings.

## Verification Checkpoint

- [ ] Is `nonEVMProvider` correctly logged and its type/structure understood?
- [ ] Does the modified call to `sdk.initializeCrossChain` pass the appropriate parameters for SUI?
- [ ] Does the SUI wallet connect successfully without the "SUI client is not defined" error?

🎨🎨🎨 EXITING CREATIVE PHASE - DECISION MADE 🎨🎨🎨
Summary: Analyzed the "SUI client is not defined" error which occurs because we're not passing the required `suiClient` parameter to the SDK's `initializeCrossChain` method for SUI chains.
Key Decisions: Add debug logging to understand what's in `nonEVMProvider` for SUI, then conditionally modify how parameters are passed based on the destination chain.
Next Steps: Implement the logging and conditional parameter passing, then test to see if it resolves the error.
