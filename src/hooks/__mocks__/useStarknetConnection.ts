import { UseStarknetConnectionResult } from "../useStarknetConnection"

export const mockUseStarknetConnection: UseStarknetConnectionResult = {
  isConnected: false,
  isConnecting: false,
  address: null,
  provider: null,
  walletName: null,
  walletIcon: null,
  connect: jest.fn().mockResolvedValue(undefined),
  disconnect: jest.fn(),
  chainId: null,
  availableWallets: [],
  error: null,
}

export const useStarknetConnection = jest.fn(
  (): UseStarknetConnectionResult => mockUseStarknetConnection
)
