// Mock for multiformats to fix dependency issues
module.exports = {
  bases: {
    base16: {
      encode: jest.fn((data) => data.toString("hex")),
      decode: jest.fn((str) => Buffer.from(str, "hex")),
    },
    base32: {
      encode: jest.fn((data) => data.toString("base64")),
      decode: jest.fn((str) => Buffer.from(str, "base64")),
    },
    base64: {
      encode: jest.fn((data) => data.toString("base64")),
      decode: jest.fn((str) => Buffer.from(str, "base64")),
    },
  },
}
