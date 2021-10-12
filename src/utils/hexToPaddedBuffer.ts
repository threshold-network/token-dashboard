/**
 * Pads a hex string with zeroes, and returns a buffer.
 * @param {string} hexString The hex string, with/without the 0x prefix.
 * @param {number} padLength Length to pad string to, in bytes.
 * @return {Buffer} The padded hex as a Buffer.
 */
function hexToPaddedBuffer(hexString: string, padLength: number) {
  hexString = hexString.startsWith("0x") ? hexString.slice(2) : hexString
  hexString = hexString.padStart(padLength, "0")
  return new Buffer(hexString, "hex")
}

export default hexToPaddedBuffer
