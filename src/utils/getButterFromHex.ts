export const getBufferFromHex = (hex: string): Buffer => {
  const validHex = toValidHex(hex).toLowerCase()
  return new Buffer(validHex, "hex")
}

const toValidHex = (hex: string): string => {
  hex = hex.substring(0, 2) === "0x" ? hex.substring(2) : hex
  if (hex === "") {
    return ""
  }
  return hex.length % 2 !== 0 ? `0${hex}` : hex
}
