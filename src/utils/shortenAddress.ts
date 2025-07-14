const shortenAddress = (address?: string | null, sliceDigits = -4): string => {
  if (!address) return ""

  // Detect address type and adjust formatting
  // Ethereum addresses: 0x + 40 hex chars
  // Starknet addresses: 0x + 64 hex chars
  // Generic fallback for other formats (like Solana base58)

  const isEthereumLike = address.startsWith("0x") && address.length === 42
  const isStarknetLike =
    address.startsWith("0x") && address.length >= 60 && address.length <= 67

  if (isEthereumLike || isStarknetLike) {
    // For 0x prefixed addresses, keep the prefix and show first/last characters
    const frontChars = Math.abs(sliceDigits)
    const backChars = Math.abs(sliceDigits)
    return `${address.slice(0, frontChars + 2)}...${address.slice(-backChars)}`
  } else {
    // Handle very short addresses specially
    if (address.length <= 8) {
      if (address.startsWith("0x")) {
        return `0x...${address.slice(2)}`
      }
      return address // Too short to meaningfully shorten
    }

    // For other formats (like Solana), show more characters
    const displayChars = Math.min(6, Math.floor(address.length / 4))
    return `${address.slice(0, displayChars)}...${address.slice(-displayChars)}`
  }
}

export default shortenAddress
