// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom"

// Add TextEncoder/TextDecoder polyfills for tests
global.TextEncoder = require("util").TextEncoder
global.TextDecoder = require("util").TextDecoder

// Mock react-icons to fix test issues
jest.mock("react-icons/all", () => ({
  __esModule: true,
}))

// Mock axios to fix test issues
jest.mock("axios", () => ({
  default: {
    get: jest.fn(),
    post: jest.fn(),
  },
}))

jest.mock("@keep-network/tbtc-v2.ts", () => ({
  BitcoinNetwork: {
    Mainnet: "mainnet",
    Testnet: "testnet",
  },
  chainIdFromSigner: jest.fn().mockResolvedValue(1),
  ethereumAddressFromSigner: jest.fn().mockResolvedValue("0x123"),
  loadEthereumCoreContracts: jest.fn().mockResolvedValue({}),
  TBTC: {
    initializeMainnet: jest.fn().mockResolvedValue({
      initializeCrossChain: jest.fn(),
      crossChainContracts: jest.fn(),
    }),
    initializeSepolia: jest.fn().mockResolvedValue({
      initializeCrossChain: jest.fn(),
      crossChainContracts: jest.fn(),
    }),
    initializeCustom: jest.fn().mockResolvedValue({
      initializeCrossChain: jest.fn(),
      crossChainContracts: jest.fn(),
    }),
  },
  calculateDepositAddress: jest.fn(),
  calculateDepositRefundLocktime: jest.fn(),
  DepositScriptParameters: jest.fn(),
  revealDeposit: jest.fn(),
  getRevealedDeposit: jest.fn(),
  decodeBitcoinAddress: jest.fn(),
  TransactionHash: {
    from: jest.fn().mockReturnValue({
      reverse: jest
        .fn()
        .mockReturnValue(
          "reversed_9eb901fc68f0d9bcaf575f23783b7d30ac5dd8d95f3c83dceaa13dce17de816a"
        ),
      toString: jest
        .fn()
        .mockReturnValue(
          "9eb901fc68f0d9bcaf575f23783b7d30ac5dd8d95f3c83dceaa13dce17de816a"
        ),
    }),
    reverse: jest
      .fn()
      .mockReturnValue(
        "reversed_9eb901fc68f0d9bcaf575f23783b7d30ac5dd8d95f3c83dceaa13dce17de816a"
      ),
    toString: jest
      .fn()
      .mockReturnValue(
        "9eb901fc68f0d9bcaf575f23783b7d30ac5dd8d95f3c83dceaa13dce17de816a"
      ),
  },
  computeHash160: jest.fn(),
  EthereumBridge: jest.fn(),
  ElectrumClient: jest.fn(),
  EthereumTBTCToken: jest.fn(),
}))

jest.mock("crypto-js")
