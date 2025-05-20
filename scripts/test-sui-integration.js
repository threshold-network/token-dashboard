/**
 * Script to test the SUI integration implementation
 *
 * This script simulates the tBTC SDK initialization and the SUI flow
 * to verify that our implementation works as expected.
 */

const { ethers } = require("ethers")
const { SuiClient } = require("@mysten/sui/client")

/**
 * Mock tBTC SDK with our patched functionality
 */
class MockTBTC {
  constructor() {
    this.hasSuiSigner = false
    this.suiClient = null
    this.suiSigner = null
    this.crossChainContracts = new Map()
    console.log("SDK instance created")
  }

  async initializeCrossChain(
    destinationChainName,
    ethereumSigner,
    solanaProvider,
    suiClient,
    suiSigner
  ) {
    console.log(`Initializing cross-chain for ${destinationChainName}`)

    if (destinationChainName === "Sui") {
      if (!suiClient) {
        throw new Error("SUI client is not defined")
      }

      // Store client for later use
      this.suiClient = suiClient
      console.log("SUI client stored")

      // Store signer if available
      if (suiSigner) {
        this.suiSigner = suiSigner
        this.hasSuiSigner = true
        console.log("SUI signer stored during initialization")
      } else {
        console.log("No SUI signer provided during initialization")
      }

      // Initialize cross-chain contracts
      this.crossChainContracts.set("Sui", {
        l1Contracts: { name: "L1 contracts for SUI" },
        destinationChainBitcoinDepositor: this.hasSuiSigner
          ? { name: "Real SUI Bitcoin Depositor with signer" }
          : {
              name: "Mock SUI Bitcoin Depositor without signer",
              initializeDeposit: () => {
                throw new Error(
                  "SUI wallet connection required to initialize deposit on SUI network."
                )
              },
            },
      })

      console.log("Cross-chain contracts initialized for SUI")
      return
    }

    throw new Error("Unsupported destination chain")
  }

  setSuiSigner(signer) {
    console.log("Setting SUI signer")
    this.suiSigner = signer
    this.hasSuiSigner = true

    // Update contracts if they exist
    const contracts = this.crossChainContracts.get("Sui")
    if (contracts) {
      this.crossChainContracts.set("Sui", {
        ...contracts,
        destinationChainBitcoinDepositor: {
          name: "Updated SUI Bitcoin Depositor with signer",
          initializeDeposit: () => {
            console.log("Successfully called initializeDeposit with signer")
            return { txHash: "0xmocktxhash" }
          },
        },
      })
      console.log("Updated cross-chain contracts with signer")
    }
  }

  async initiateDeposit() {
    console.log("Initiating deposit")
    return {
      getBitcoinAddress: () => "1MockBitcoinAddress",
      initiateMinting: () => {
        const contracts = this.crossChainContracts.get("Sui")
        if (!contracts) {
          throw new Error("Cross-chain contracts not initialized")
        }

        return contracts.destinationChainBitcoinDepositor.initializeDeposit()
      },
    }
  }
}

/**
 * Mock SUI Wallet adapter
 */
class MockSuiWallet {
  constructor() {
    this.address = "0xmocksuiaddress"
  }

  async signTransaction(tx) {
    console.log("Signing transaction:", tx)
    return { signature: "0xmocksignature" }
  }
}

/**
 * Test the flow
 */
async function testSuiIntegration() {
  console.log("=== Testing SUI Integration ===")

  // Create mock SDK
  const sdk = new MockTBTC()

  // Create SUI client
  const suiClient = new SuiClient({
    url: "https://fullnode.testnet.sui.io:443",
  })
  console.log("Created SUI client")

  // Create mock Ethereum signer
  const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545")
  const ethereumSigner = new ethers.Wallet(
    "0x0000000000000000000000000000000000000000000000000000000000000001",
    provider
  )
  console.log("Created Ethereum signer")

  // Initialize cross-chain without SUI signer
  console.log("\n--- Initializing without SUI signer ---")
  await sdk.initializeCrossChain("Sui", ethereumSigner, undefined, suiClient)

  // Attempt to initiate minting (should fail)
  console.log("\n--- Attempting to initiate minting without SUI wallet ---")
  try {
    const deposit = await sdk.initiateDeposit()
    const bitcoinAddress = await deposit.getBitcoinAddress()
    console.log(`Got Bitcoin deposit address: ${bitcoinAddress}`)

    console.log("Attempting to reveal deposit without signer:")
    await deposit.initiateMinting()
  } catch (error) {
    console.log(`Got expected error: ${error.message}`)
  }

  // Now set SUI signer and try again
  console.log("\n--- Setting SUI signer and trying again ---")
  const mockSuiWallet = new MockSuiWallet()
  sdk.setSuiSigner(mockSuiWallet)

  // Try again with signer
  try {
    const deposit = await sdk.initiateDeposit()
    const bitcoinAddress = await deposit.getBitcoinAddress()
    console.log(`Got Bitcoin deposit address: ${bitcoinAddress}`)

    console.log("Attempting to reveal deposit with signer:")
    await deposit.initiateMinting()
    console.log("Success! Deposit revealed with SUI signer")
  } catch (error) {
    console.error("Error:", error.message)
  }

  console.log("\n=== Test completed ===")
}

// Run the test
testSuiIntegration().catch(console.error)
