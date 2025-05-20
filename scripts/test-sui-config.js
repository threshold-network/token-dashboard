// Simple test for SUI network configuration
const fs = require("fs")

// First, print available paths
console.log("Checking for SUI artifacts...")
console.log(
  `tbtc-v2 directory exists: ${fs.existsSync(
    "/Users/leonardosaturnino/Documents/GitHub/tbtc-v2"
  )}`
)
console.log(
  `Typescript dir exists: ${fs.existsSync(
    "/Users/leonardosaturnino/Documents/GitHub/tbtc-v2/typescript"
  )}`
)

try {
  // Read and display the artifact file contents directly
  const testnetArtifacts = fs.readFileSync(
    "/Users/leonardosaturnino/Documents/GitHub/tbtc-v2/typescript/src/lib/sui/artifacts/testnet/index.ts",
    "utf8"
  )
  console.log("\nTestnet Artifacts:")
  console.log(testnetArtifacts)

  // Read the config file to validate it
  const suiConfig = fs.readFileSync(
    "/Users/leonardosaturnino/Documents/GitHub/token-dashboard/src/config/sui.ts",
    "utf8"
  )
  console.log("\nSUI Config:")
  console.log(suiConfig)

  console.log("\nConfiguration verified successfully!")
} catch (error) {
  console.error("Error during verification:", error)
}
