module.exports = {
  Account: jest.fn(),
  Provider: jest.fn(),
  constants: {
    StarknetChainId: {
      MAINNET: "0x534e5f4d41494e",
      TESTNET: "0x534e5f5345504f4c4941",
    },
  },
  RpcProvider: jest.fn(),
}
