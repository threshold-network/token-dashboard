module.exports = {
  connect: jest.fn(),
  disconnect: jest.fn(),
  getAvailableWallets: jest.fn().mockReturnValue([]),
}
