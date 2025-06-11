// Mock for @ledgerhq/connect-kit-loader
// This package is ESM-only which causes issues with Jest
// This mock provides the same API but in CommonJS format

module.exports = {
  SupportedProviderImplementations: {
    LedgerConnect: "LedgerConnect",
    WalletConnect: "WalletConnect",
  },
  SupportedProviders: {
    Ethereum: "Ethereum",
  },
  loadConnectKit: jest.fn().mockImplementation(() => {
    return Promise.resolve({
      getAccount: jest.fn().mockResolvedValue({
        id: "mock-account-id",
        address: "0x1234567890123456789012345678901234567890",
        chainId: "1",
      }),
      onDisconnect: jest.fn(),
      disconnect: jest.fn().mockResolvedValue(undefined),
      emit: jest.fn(),
      on: jest.fn(),
      off: jest.fn(),
      setChainId: jest.fn(),
      checkSupport: jest.fn().mockResolvedValue({
        isLedgerConnectSupported: true,
        isLedgerConnectEnabled: true,
      }),
      // Mock the modal/UI related methods
      openModal: jest.fn(),
      closeModal: jest.fn(),
      isModalOpen: false,
    })
  }),
}
