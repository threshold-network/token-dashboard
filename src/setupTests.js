// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom"

jest.mock("@keep-network/tbtc-v2.ts/dist/src/deposit", () => ({
  calculateDepositAddress: jest.fn(),
  calculateDepositRefundLocktime: jest.fn(),
  DepositScriptParameters: jest.fn(),
  revealDeposit: jest.fn(),
  getRevealedDeposit: jest.fn(),
}))

jest.mock("@keep-network/tbtc-v2.ts/dist/src/bitcoin", () => ({
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
}))

jest.mock("@keep-network/tbtc-v2.ts/dist/src", () => ({
  EthereumBridge: jest.fn(),
  ElectrumClient: jest.fn(),
  EthereumTBTCToken: jest.fn(),
}))

jest.mock("crypto-js")
