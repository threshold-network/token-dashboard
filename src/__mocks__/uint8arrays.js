// Mock for uint8arrays to fix WalletConnect import issues in tests
module.exports = {
  fromString: jest.fn((str) => Buffer.from(str)),
  toString: jest.fn((arr) => Buffer.from(arr).toString()),
  concat: jest.fn((arrays) => Buffer.concat(arrays)),
  equals: jest.fn((a, b) => Buffer.from(a).equals(Buffer.from(b))),
}
