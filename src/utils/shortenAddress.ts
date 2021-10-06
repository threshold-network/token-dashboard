const shortenAddress = (address: string, sliceDigits = -4): string => {
  return `0x...${address.slice(sliceDigits)}`
}

export default shortenAddress
