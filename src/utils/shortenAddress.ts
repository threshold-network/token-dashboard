const shortenAddress = (address?: string, sliceDigits = -4): string => {
  return address
    ? `${address.slice(0, Math.abs(sliceDigits) + 2)}...${address.slice(
        sliceDigits
      )}`
    : ""
}

export default shortenAddress
