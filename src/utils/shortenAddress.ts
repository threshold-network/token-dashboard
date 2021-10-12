const shortenAddress = (address?: string, sliceDigits = -4): string => {
  return address ? `0x...${address.slice(sliceDigits)}` : ""
}

export default shortenAddress
