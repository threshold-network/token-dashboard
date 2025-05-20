🎨🎨🎨 ENTERING CREATIVE PHASE: ARCHITECTURE DESIGN (DEBUGGING) 🎨🎨🎨
Focus: TBTC SDK "SUI signer is not defined" error during SDK initialization for SUI wallet.
Objective: Implement a valid SUI signer for the SDK's `initializeCrossChain` method.
Requirements:

- Create a working SUI signer implementation
- Pass the signer to the SDK's `initializeCrossChain` method
- Ensure successful SDK initialization with SUI wallet

## Component Description

After fixing the previous issues, we're now encountering a "SUI signer is not defined" error. Our logs show that we're successfully creating a SuiClient for testnet, but we're not providing a SUI signer to the SDK's `initializeCrossChain` method. The SDK is checking for this signer and requiring it for SUI chain operations.

In the current implementation, we're passing:

```typescript
await sdk.initializeCrossChain(
  destinationChainName as DestinationChainName,
  signer, // Ethereum signer
  undefined, // No Solana provider
  suiClient, // SuiClient we created
  undefined // No SUI signer - THIS IS THE PROBLEM
)
```

The error occurs because the SDK is expecting a valid SUI signer in the 5th parameter when the destination chain is "Sui". We need to create this signer and pass it to the method.

## Requirements & Constraints

- We need a valid SUI signer implementation that satisfies the SDK's requirements
- The signer should be created from the connected SUI wallet if possible
- If we can't get a real signer, we may need to create a mock implementation

## Options Analysis

### Option 1: Create a Simple Mock SUI Signer

**Description**: Create a minimal implementation of a SUI signer that provides just enough of the required interface to pass validation.
**Pros**:

- Simple implementation
- Doesn't require external dependencies
- May be sufficient if actual signing isn't needed for deposit flows
  **Cons**:
- Won't work for actual signing operations
- May cause issues later if real signing is needed
- Difficult to determine the exact required interface

**Implementation Example**:

```typescript
const mockSuiSigner = {
  getAddress: async () => "0x...", // Mock address
  signData: async () => ({ signature: "0x..." }), // Mock signature
  // Add other required methods
}
```

### Option 2: Extract SUI Wallet Adapter and Create Signer

**Description**: Extract the SUI wallet adapter from the connected wallet and create a proper SUI signer that can perform real signing operations.
**Pros**:

- Uses the actual connected wallet for operations
- Should work for all real signing needs
- Most robust solution
  **Cons**:
- More complex implementation
- Requires understanding the SUI wallet adapter interface in detail

**Investigation Steps**:

1. Examine the SUI wallet SDK to understand the signer interface requirements
2. Modify the `useNonEVMConnection` hook to include the wallet adapter and key functionality
3. Create a wrapper that adapts the wallet adapter to the signer interface expected by the SDK

### Option 3: Modify useNonEVMConnection to Store and Provide the Wallet

**Description**: Update the `useNonEVMConnection` hook to store the entire SUI wallet from `useWallet` and provide it as part of `nonEVMProvider`.
**Pros**:

- Maintains the existing architecture
- Makes wallet capabilities available throughout the app
  **Cons**:
- May not perfectly match the SDK's expected signer interface
- Could require additional wrapper code

**Implementation Example**:

```typescript
// In useNonEVMConnection.ts
if (isSUIActive && suiAccount?.address) {
  // Store the whole wallet object instead of null
  connectionData.nonEVMProvider = useWalletKit()
  // Rest of the code
}
```

## Recommended Approach

Option 2 is the recommended approach. We should examine the SUI wallet SDK to understand the exact signer interface required, then extract and adapt the wallet adapter to create a proper SUI signer. This will provide the most robust solution that will work for both initialization and any future signing operations.

## Implementation Guidelines

### Step 1: Examine SUI Wallet SDK

First, we need to understand the signer interface expected by the TBTC SDK. Based on typical SUI interfaces, it likely requires:

- A `getAddress` method
- A `signTransaction` or `signData` method
- Possibly other methods for chain interaction

### Step 2: Modify useNonEVMConnection

Update the `useNonEVMConnection` hook to extract and store the relevant wallet information:

```typescript
// In useNonEVMConnection.ts
// Handle SUI wallet connection
if (isSUIActive && suiAccount?.address) {
  // Create a SUI signer from the wallet adapter
  const suiSigner = {
    getAddress: async () => suiAccount.address,
    signData: async (data: Uint8Array) => {
      // Use the wallet adapter to sign data
      return await signPersonalMessage({
        message: data,
      })
    },
    // Add other required methods
  }

  connectionData.nonEVMProvider = suiSigner
  connectionData.nonEVMChainName = ChainName.SUI as unknown as Exclude<
    keyof typeof ChainName,
    "Ethereum"
  >
  connectionData.nonEVMPublicKey = suiAccount.address
  connectionData.isNonEVMActive = isSUIActive
  connectionData.connectedWalletName = suiAdapter?.name
  connectionData.connectedWalletIcon = suiAdapter?.icon
  connectionData.isNonEVMConnecting = isSUIConnecting
  connectionData.isNonEVMDisconnecting = false
}
```

### Step 3: Modify \_initiateCrossChain Method

Update the `_initiateCrossChain` method to pass the signer from `nonEVMProvider`:

```typescript
// In _initiateCrossChain method in src/threshold-ts/tbtc/index.ts
if (destinationChainName === "Sui") {
  // For SUI, we need to create a SuiClient
  const suiClient = new SuiClient({
    url: "https://fullnode.testnet.sui.io:443",
  })

  console.log("[Threshold SDK Wrapper] Created SuiClient for testnet")

  const suiSigner = this._crossChainConfig.nonEVMProvider
  console.log("[Threshold SDK Wrapper] SUI signer:", suiSigner)

  await sdk.initializeCrossChain(
    destinationChainName as DestinationChainName,
    signer,
    undefined, // No Solana provider
    suiClient, // Pass the SUI client we created
    suiSigner // Pass the SUI signer from nonEVMProvider
  )
}
```

### Alternative Approach - Create a Minimal Mock Signer

If extracting a proper signer from the wallet proves difficult, we can create a minimal mock signer that satisfies the SDK's validation:

```typescript
if (destinationChainName === "Sui") {
  // Create a basic mock signer that has the minimum required interface
  const mockSuiSigner = {
    getAddress: async () => this._crossChainConfig.nonEVMPublicKey || "0x0000",
    signData: async (data: Uint8Array) => {
      console.warn("[Threshold SDK Wrapper] Mock SUI signer used for signData")
      return { signature: new Uint8Array(64) } // Mock signature
    },
    // Add other required methods as needed
  }

  await sdk.initializeCrossChain(
    destinationChainName as DestinationChainName,
    signer,
    undefined,
    suiClient,
    mockSuiSigner
  )
}
```

## Verification Checkpoint

- [ ] Do we understand the SUI signer interface required by the SDK?
- [ ] Can we extract a proper signer from the connected wallet?
- [ ] If not, does our mock signer implementation satisfy the SDK's requirements?
- [ ] Does the SUI wallet connect successfully without the "SUI signer is not defined" error?

🎨🎨🎨 EXITING CREATIVE PHASE - DECISION MADE 🎨🎨🎨
Summary: The best approach is to create a proper SUI signer by extracting and adapting the wallet adapter from the connected SUI wallet. This will provide the most robust solution for both initialization and any future signing operations.
If creating a proper signer proves difficult, we can implement a minimal mock signer that satisfies the SDK's validation checks.
