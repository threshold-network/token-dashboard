const axios = require("axios")

// Test the StarkNet relayer endpoint with correct path
async function testStarkNetRelayer() {
  const relayerUrl =
    "https://tbtc-crosschain-relayer-swmku.ondigitalocean.app/api/starknetTestnet/reveal"

  // Mock data based on the provided example
  const testPayload = {
    fundingTx: {
      value: "100000000000000000", // 0.1 ETH in wei
      version: "0x01000000",
      inputVector:
        "0x010000000000000000000000000000000000000000000000000000000000000000ffffffff0000ffffffff",
      outputVector:
        "0x0100000000000000001976a914000000000000000000000000000000000000000088ac",
      locktime: "0x00000000",
    },
    reveal: {
      fundingOutputIndex: 0,
      blindingFactor: "0x" + "2".repeat(64), // 32 bytes
      walletPubKeyHash: "0x" + "3".repeat(40), // 20 bytes
      refundPubKeyHash: "0x" + "4".repeat(40), // 20 bytes
      refundLocktime: "0x" + "5".repeat(8), // 4 bytes
      vault: "0x" + "6".repeat(40), // 20 bytes
    },
    l2DepositOwner: "0x" + "7".repeat(40), // 20 bytes
    l2Sender: "0x" + "8".repeat(40), // 20 bytes
  }

  console.log("Testing StarkNet relayer endpoint...")
  console.log("URL:", relayerUrl)
  console.log("\nTesting if endpoint is enabled...")

  try {
    // First, let's try a GET request to see if the route exists
    const getResponse = await axios.get(
      "https://tbtc-crosschain-relayer-swmku.ondigitalocean.app/api/starknetTestnet/deposit/test",
      {
        validateStatus: () => true, // Accept any status code
      }
    )
    console.log("GET test status:", getResponse.status)

    // Now try the POST
    console.log("\nSending POST request...")
    const response = await axios.post(relayerUrl, testPayload, {
      timeout: 30000, // 30 seconds timeout
      headers: {
        "Content-Type": "application/json",
      },
      validateStatus: () => true, // Accept any status code to see the actual response
    })

    console.log("\nResponse received!")
    console.log("Status:", response.status)
    console.log("Response data:", JSON.stringify(response.data, null, 2))

    if (response.status === 405) {
      console.log(
        "\n⚠️  The endpoint exists but reveal deposit API is not supported/enabled for this chain"
      )
    } else if (response.status === 404) {
      console.log(
        "\n⚠️  The endpoint route is not found - USE_ENDPOINT might be false"
      )
    } else if (response.status >= 200 && response.status < 300) {
      console.log("\n✅ Success!")
    } else {
      console.log("\n❌ Unexpected status code")
    }
  } catch (error) {
    console.log("\n❌ Error occurred:")
    console.log("Error:", error.message)
  }
}

// Run the test
testStarkNetRelayer()
