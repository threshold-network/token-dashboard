const ETH_REGEX = /^0x[a-fA-F0-9]{40}$/ // 0x + 40 hex chars
const BYTES32_REGEX = /^0x[a-fA-F0-9]{64}$/ // 0x + 64 hex chars

const shortenAddress = (address?: string | null, sliceDigits = -4): string => {
  if (!address) return ""

  // Check if it's an Ethereum address
  if (ETH_REGEX.test(address)) {
    return `${address.slice(0, Math.abs(sliceDigits) + 2)}...${address.slice(
      sliceDigits
    )}`
  }

  // Check if it's a bytes32 address (e.g., 0x + 64 hex)
  if (BYTES32_REGEX.test(address)) {
    return `${address.slice(0, 10)}...${address.slice(-10)}`
  }

  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export default shortenAddress
