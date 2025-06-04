const shortenAddress = (address?: string, sliceDigits = -4): string => {
  if (!address) return ""

  // Detect address type and adjust formatting
  // Ethereum addresses: 0x + 40 hex chars
  // Starknet addresses: 0x + 64 hex chars
  // Generic fallback for other formats (like Solana base58)

  const isEthereumLike = address.startsWith("0x") && address.length === 42
  const isStarknetLike = address.startsWith("0x") && address.length === 66

  if (isEthereumLike || isStarknetLike) {
    // For 0x prefixed addresses, keep the prefix and show first/last characters
    return `${address.slice(0, Math.abs(sliceDigits) + 2)}...${address.slice(
      sliceDigits
    )}`
  } else {
    // For other formats (like Solana), show more characters
    const displayChars = Math.min(6, Math.floor(address.length / 4))
    return `${address.slice(0, displayChars)}...${address.slice(-displayChars)}`
  }
}

export default shortenAddress
