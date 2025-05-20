🎨🎨🎨 ENTERING CREATIVE PHASE: ARCHITECTURE DESIGN 🎨🎨🎨
Focus: TBTC SDK Initialization for SUI Wallet Integration
Objective: Analyze and propose solutions for the "L1 Cross-chain contracts loader not available" error.
Requirements:

- Successful initialization of TBTC SDK when SUI wallet is connected.
- Maintain functionality for Sepolia (L1) interactions where appropriate.
- Ensure SUI network transactions (deposits via Wormhole) are possible.

## Component Description

The TBTC SDK (`@keep-network/tbtc-v2.ts`) is used in the `token-dashboard` to facilitate cross-chain Bitcoin (tBTC) operations. The current task (TD-SUI-01) involves integrating SUI network support, allowing users to deposit BTC and bridge it to the SUI network via Wormhole. The error occurs during the SDK's `initializeSdk` method, called when a SUI wallet connection is attempted.

Error Message: `Uncaught (in promise) Error: Something went wrong when initializing tbtc sdk: Error: L1 Cross-chain contracts loader not available for this instance`
Stack Trace Snippet:

- `TBTC.initializeSdk (index.ts:698)`
- `handleConnect (ConnectSUI.tsx:53)`

This suggests the SDK is trying to load or configure L1 (Ethereum/Sepolia) components that are either not found, not configured correctly for the SUI context, or not needed for a primarily SUI-focused interaction.

## Requirements & Constraints

- The SDK must successfully initialize to allow SUI wallet operations.
- The solution should align with the existing `tbtc-v2` SDK architecture.
- Sepolia testnet (`REACT_APP_DEFAULT_PROVIDER_CHAIN_ID=11155111`) is the L1.
- Wormhole is used for bridging, with specific SUI gateway and chain ID (21).
- The `tasks.md` indicates `SuiBTCDepositorWormhole.json` artifact was created and `l1-bitcoin-depositor.ts` updated. These changes should be reviewed.

## Options Analysis

### Option 1: Review and Correct SDK Initialization Parameters for SUI Context

**Description**: Thoroughly inspect the `initializeSdk` call site and the parameters being passed, especially those related to L1 contracts, network configuration, and artifact loading when SUI is the target or active network. Ensure that all necessary configurations for L1 (Sepolia) are correctly provided _if_ they are essential prerequisites even for SUI operations, or are conditionally loaded.
**Pros**:

- Directly addresses the error source (SDK initialization).
- Likely to provide a robust and correct solution if misconfiguration is the cause.
- Leverages existing SDK structure.
  **Cons**:
- Requires deep understanding of the `tbtc-v2` SDK's initialization process and its expectations for L1 vs. L2/other chain configurations.
- May involve debugging the SDK's internal logic.
  **Complexity**: Medium to High
  **Implementation Time**: 2-4 hours (investigation + potential fix)

**Investigation Steps for Option 1**:

1. Examine `ConnectSUI.tsx` where `handleConnect` calls the SDK initialization.
2. Trace the `initializeSdk` method in `tbtc-v2/typescript/src/index.ts`.
3. Verify how L1 contract addresses and artifacts (e.g., `BTCDepositorWormhole`) are loaded or passed.
4. Check if the `artifactLoader.getSepolia` function in `l1-bitcoin-depositor.ts` (mentioned in `tasks.md`) is behaving as expected and if `SuiBTCDepositorWormhole` is correctly identified when SUI context is active.
5. Ensure that the SDK configuration (passed during `new TBTC(config)`) correctly reflects the dual needs of Sepolia (as L1) and SUI (as destination).

### Option 2: Conditional L1 Feature Initialization in TBTC SDK

**Description**: Modify the TBTC SDK to allow a "lighter" initialization or conditional loading of L1-specific components if they are not strictly necessary for the SUI-specific workflow being initiated. This might involve adding flags or context to the `initializeSdk` method or its configuration.
**Pros**:

- Could bypass the error if full L1 setup isn't immediately required for SUI interaction.
- Might simplify the initialization flow for non-L1 primary interactions.
  **Cons**:
- Involves modifying the linked `tbtc-v2` SDK, which might have broader implications or require more extensive testing.
- If L1 components _are_ fundamentally needed even for SUI pre-checks or context, this won't solve the underlying issue.
  **Complexity**: Medium to High
  **Implementation Time**: 3-6 hours (SDK modification + testing)

**Investigation Steps for Option 2**:

1. Analyze the SDK's `initializeSdk` to identify where the L1 loader is invoked.
2. Determine if the L1 components are critical for _all_ SDK initializations or only for specific operations.
3. If not always critical, design a mechanism (e.g., a config flag `omitL1ContractsLoader?: boolean` or `initializationContext: 'SUI' | 'L1'`) to conditionally skip or defer L1 contract loading.
4. Implement and test this change in the linked SDK.

### Option 3: Ensure L1 Provider and Signer are Always Available/Mocked During SUI Flow

**Description**: The SDK might expect an L1 provider/signer context to be available globally or passed in, even if the primary interaction is SUI. Ensure that a valid (even if temporarily inactive or correctly configured for Sepolia) L1 ethers provider/signer is passed to the SDK during initialization when SUI is being connected.
**Pros**:

- Might satisfy an SDK prerequisite without major SDK code changes.
- Relatively simpler to implement if the issue is just a missing L1 context.
  **Cons**:
- Could mask underlying issues if the L1 components are genuinely failing to load for other reasons.
- Adds a dependency on having L1 context available during SUI connection, which might not always be ideal.
  **Complexity**: Low to Medium
  **Implementation Time**: 1-3 hours

**Investigation Steps for Option 3**:

1. Review how the Ethereum provider/signer (for Sepolia) is managed in `ThresholdContext.tsx` or similar.
2. Ensure this L1 provider is correctly passed into the `TBTC` constructor or `initializeSdk` method.
3. Verify that the SDK configuration object explicitly includes L1 (Sepolia) RPC URLs and any other required L1 parameters.
4. The `tasks.md` mentions `.env` is configured for Sepolia; double-check these are picked up by the SDK config.

## Recommended Approach

Start with **Option 1: Review and Correct SDK Initialization Parameters for SUI Context**. This is the least invasive and targets the most probable cause – a misconfiguration or misunderstanding of how the SDK expects to be initialized in a cross-chain scenario involving SUI and an L1 like Sepolia. The details in `tasks.md` about SDK modifications and configurations are key here.

If Option 1 reveals that the SDK rigidly requires L1 components in a way that's problematic for the SUI flow, then **Option 2: Conditional L1 Feature Initialization** would be the next logical step, but this requires more careful consideration due to SDK modification. Option 3 is a subset of checks within Option 1.

## Implementation Guidelines (for investigating Option 1)

1.  **Set up Debugging**: Place breakpoints in `ConnectSUI.tsx` (around `handleConnect` and SDK initialization) and within the `tbtc-v2` SDK's `initializeSdk` method and related L1 contract loading functions.
2.  **Inspect Configuration**: Carefully log and inspect the configuration object passed to `new TBTC(config)` and any parameters passed directly to `initializeSdk`.
3.  **Verify Artifact Paths and Loading**: Confirm that the `SuiBTCDepositorWormhole.json` (contract address: `0xb306e0683f890BAFa669c158c7Ffa4b754b70C95` on Sepolia) and other necessary L1 artifacts are being correctly loaded by the `artifactLoader`. Check the logic in `l1-bitcoin-depositor.ts`.
4.  **Network Consistency**: Ensure that the L1 network ID (Sepolia: 11155111) is consistently used and recognized by the SDK.
5.  **Provider Checks**: Confirm the Ethereum provider instance for Sepolia is valid and active when the SDK initializes.

## Verification Checkpoint

- [ ] Can the `tbtc sdk` initialize without the "L1 Cross-chain contracts loader not available" error when connecting a SUI wallet?
- [ ] Are the changes (if any) localized and well-understood?
- [ ] Does the Sepolia (L1) functionality of the dashboard remain intact?
- [ ] Can the SUI deposit flow be initiated?

🎨🎨🎨 EXITING CREATIVE PHASE - DECISION MADE 🎨🎨🎨
Summary: Investigated the "L1 Cross-chain contracts loader not available" error. Three potential options explored.
Key Decisions: Prioritize investigation of SDK initialization parameters (Option 1) as the first step.
Next Steps: Proceed with debugging and configuration verification as outlined in Option 1's Implementation Guidelines.
