import React, { FC } from "react"
import { render, screen } from "@testing-library/react"
import { TbtcBalanceCard } from "../TbtcBalanceCard"
import { useToken } from "../../../../hooks/useToken"
import { useStarknetTBTCBalance } from "../../../../hooks/tbtc/useStarknetTBTCBalance"
import { useNonEVMConnection } from "../../../../hooks/useNonEVMConnection"
import { ChainName } from "../../../../threshold-ts/types"
import { Token } from "../../../../enums"
import {
  TokenContext,
  TokenContextType,
} from "../../../../contexts/TokenContext"
import { TokenBalanceCardProps } from "../../../../components/TokenBalanceCard"
import {
  StarknetReactProvider,
  StarknetWalletProvider,
} from "../../../../contexts/StarknetWalletProvider"

// Mock the threshold context to avoid initialization issues
jest.mock("../../../../utils/getThresholdLib", () => ({
  getThresholdLib: jest.fn(),
}))

jest.mock("../../../../contexts/ThresholdContext", () => ({
  useThreshold: jest.fn(() => ({
    tbtc: {
      l2TbtcToken: null,
    },
  })),
}))

// Mock the hooks
jest.mock("../../../../hooks/useToken")
jest.mock("../../../../hooks/tbtc/useStarknetTBTCBalance")
jest.mock("../../../../hooks/useNonEVMConnection")
jest.mock("../../../../contexts/StarknetWalletProvider", () => ({
  StarknetReactProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  StarknetWalletProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}))
jest.mock("../../../../components/TokenBalanceCard", () => ({
  __esModule: true,
  default: ({ token, title, additionalInfo, ...props }: any) => {
    const { useToken } = require("../../../../hooks/useToken")
    const { balance, usdBalance } = useToken(token)

    return (
      <div data-testid="token-balance-card">
        <div>{title}</div>
        <div data-testid="balance">{balance}</div>
        <div data-testid="usd-balance">{usdBalance}</div>
        {additionalInfo && (
          <div data-testid="additional-info">{additionalInfo}</div>
        )}
      </div>
    )
  },
}))

jest.mock("@web3-react/core", () => ({
  __esModule: true,
  useWeb3React: jest.fn(),
}))

// Import useWeb3React after mocking to ensure the mock is available
import { useWeb3React } from "@web3-react/core"

describe("TbtcBalanceCard", () => {
  const mockUseToken = useToken as jest.MockedFunction<typeof useToken>
  const mockUseStarknetTBTCBalance =
    useStarknetTBTCBalance as jest.MockedFunction<typeof useStarknetTBTCBalance>
  const mockUseNonEVMConnection = useNonEVMConnection as jest.MockedFunction<
    typeof useNonEVMConnection
  >

  const tbtcContext: TokenContextType[Token.TBTCV2] = {
    balance: "100.5",
    usdBalance: "5000",
    contract: null,
    decimals: 18,
    loading: false,
    error: null,
  } as any

  const wrapper: FC = ({ children }) => (
    <TokenContext.Provider
      value={{
        [Token.TBTCV2]: tbtcContext,
      }}
    >
      <StarknetReactProvider>
        <StarknetWalletProvider>{children}</StarknetWalletProvider>
      </StarknetReactProvider>
    </TokenContext.Provider>
  )

  beforeEach(() => {
    ;(useWeb3React as jest.Mock).mockReturnValue({
      account: "0x0",
      active: true,
    })
    mockUseToken.mockReturnValue({
      balance: "100.5",
      usdBalance: "5000",
      contract: null,
      decimals: 18,
    } as any)
    mockUseStarknetTBTCBalance.mockReturnValue({
      balance: "0",
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    })
    mockUseNonEVMConnection.mockReturnValue({
      nonEVMChainName: null,
      nonEVMPublicKey: null,
      nonEVMProvider: null,
      isNonEVMActive: false,
      connectedWalletName: null,
      connectedWalletIcon: null,
      isNonEVMConnecting: false,
      isNonEVMDisconnecting: false,
      disconnectNonEVMWallet: jest.fn(),
      nonEVMChainId: null,
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("should render tBTC balance when only Ethereum is connected", () => {
    render(<TbtcBalanceCard />, { wrapper })

    expect(screen.getByTestId("balance")).toHaveTextContent("100.5")
    expect(screen.getByTestId("usd-balance")).toHaveTextContent("5000")
    expect(screen.queryByTestId("additional-info")).not.toBeInTheDocument()
  })

  it("should render both Ethereum and Starknet balances when Starknet is connected", () => {
    mockUseNonEVMConnection.mockReturnValue({
      nonEVMChainName: ChainName.Starknet,
      nonEVMPublicKey: "0x123...abc",
      nonEVMProvider: {},
      isNonEVMActive: true,
      connectedWalletName: "Argent X",
      connectedWalletIcon: null,
      isNonEVMConnecting: false,
      isNonEVMDisconnecting: false,
      disconnectNonEVMWallet: jest.fn(),
      nonEVMChainId: "SN_GOERLI",
    })

    mockUseStarknetTBTCBalance.mockReturnValue({
      balance: "50.25",
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    })

    render(<TbtcBalanceCard />, { wrapper })

    expect(screen.getByTestId("balance")).toHaveTextContent("100.5")
    expect(screen.getByTestId("additional-info")).toBeInTheDocument()
    expect(screen.getByTestId("additional-info")).toHaveTextContent(
      "Starknet: 50.25 tBTC"
    )
  })

  it("should show loading state for Starknet balance", () => {
    mockUseNonEVMConnection.mockReturnValue({
      nonEVMChainName: ChainName.Starknet,
      nonEVMPublicKey: "0x123...abc",
      nonEVMProvider: {},
      isNonEVMActive: true,
      connectedWalletName: "Argent X",
      connectedWalletIcon: null,
      isNonEVMConnecting: false,
      isNonEVMDisconnecting: false,
      disconnectNonEVMWallet: jest.fn(),
      nonEVMChainId: "SN_GOERLI",
    })

    mockUseStarknetTBTCBalance.mockReturnValue({
      balance: "0",
      isLoading: true,
      error: null,
      refetch: jest.fn(),
    })

    render(<TbtcBalanceCard />, { wrapper })

    expect(screen.getByTestId("additional-info")).toHaveTextContent(
      "Starknet:Loading..."
    )
  })

  it("should show error state for Starknet balance", () => {
    mockUseNonEVMConnection.mockReturnValue({
      nonEVMChainName: ChainName.Starknet,
      nonEVMPublicKey: "0x123...abc",
      nonEVMProvider: {},
      isNonEVMActive: true,
      connectedWalletName: "Argent X",
      connectedWalletIcon: null,
      isNonEVMConnecting: false,
      isNonEVMDisconnecting: false,
      disconnectNonEVMWallet: jest.fn(),
      nonEVMChainId: "SN_GOERLI",
    })

    mockUseStarknetTBTCBalance.mockReturnValue({
      balance: "0",
      isLoading: false,
      error: "Failed to fetch balance",
      refetch: jest.fn(),
    })

    render(<TbtcBalanceCard />, { wrapper })

    expect(screen.getByTestId("additional-info")).toHaveTextContent(
      "Starknet: Not available"
    )
  })

  it("should calculate combined balance when both chains have balances", () => {
    mockUseToken.mockReturnValue({
      balance: "100",
      usdBalance: "5000",
      contract: null,
      decimals: 18,
    } as any)

    mockUseNonEVMConnection.mockReturnValue({
      nonEVMChainName: ChainName.Starknet,
      nonEVMPublicKey: "0x123...abc",
      nonEVMProvider: {},
      isNonEVMActive: true,
      connectedWalletName: "Argent X",
      connectedWalletIcon: null,
      isNonEVMConnecting: false,
      isNonEVMDisconnecting: false,
      disconnectNonEVMWallet: jest.fn(),
      nonEVMChainId: "SN_GOERLI",
    })

    mockUseStarknetTBTCBalance.mockReturnValue({
      balance: "50",
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    })

    render(<TbtcBalanceCard />, { wrapper })

    // The main balance should show Ethereum balance
    expect(screen.getByTestId("balance")).toHaveTextContent("100")

    // Additional info should show Starknet balance
    expect(screen.getByTestId("additional-info")).toHaveTextContent(
      "Starknet: 50 tBTC"
    )
  })

  it("should handle Starknet connection without balance", () => {
    mockUseNonEVMConnection.mockReturnValue({
      nonEVMChainName: ChainName.Starknet,
      nonEVMPublicKey: "0x123...abc",
      nonEVMProvider: {},
      isNonEVMActive: true,
      connectedWalletName: "Argent X",
      connectedWalletIcon: null,
      isNonEVMConnecting: false,
      isNonEVMDisconnecting: false,
      disconnectNonEVMWallet: jest.fn(),
      nonEVMChainId: "SN_GOERLI",
    })

    mockUseStarknetTBTCBalance.mockReturnValue({
      balance: "0",
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    })

    render(<TbtcBalanceCard />, { wrapper })

    expect(screen.getByTestId("additional-info")).toHaveTextContent(
      "Starknet: 0 tBTC"
    )
  })
})
