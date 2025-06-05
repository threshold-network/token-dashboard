import React from "react"
import { render, screen } from "@testing-library/react"
import { TbtcBalanceCard } from "../TbtcBalanceCard"
import { useToken } from "../../../../hooks/useToken"
import { useStarknetTBTCBalance } from "../../../../hooks/tbtc/useStarknetTBTCBalance"
import { useNonEVMConnection } from "../../../../hooks/useNonEVMConnection"
import { ChainName } from "../../../../threshold-ts/types"

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
jest.mock("../../../../contexts/StarknetWalletProvider")
jest.mock("../../../../components/TokenBalanceCard", () => ({
  __esModule: true,
  default: ({ title, tokenBalance, usdBalance, additionalInfo }: any) => (
    <div data-testid="token-balance-card">
      <div>{title}</div>
      <div data-testid="balance">{tokenBalance}</div>
      <div data-testid="usd-balance">{usdBalance}</div>
      {additionalInfo && (
        <div data-testid="additional-info">{additionalInfo}</div>
      )}
    </div>
  ),
}))

describe("TbtcBalanceCard", () => {
  const mockUseToken = useToken as jest.MockedFunction<typeof useToken>
  const mockUseStarknetTBTCBalance =
    useStarknetTBTCBalance as jest.MockedFunction<typeof useStarknetTBTCBalance>
  const mockUseNonEVMConnection = useNonEVMConnection as jest.MockedFunction<
    typeof useNonEVMConnection
  >

  beforeEach(() => {
    // Default mocks
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
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("should render tBTC balance when only Ethereum is connected", () => {
    render(<TbtcBalanceCard />)

    expect(screen.getByTestId("balance")).toHaveTextContent("100.5")
    expect(screen.getByTestId("usd-balance")).toHaveTextContent("5000")
    expect(screen.queryByTestId("additional-info")).not.toBeInTheDocument()
  })

  it("should render both Ethereum and StarkNet balances when StarkNet is connected", () => {
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
    })

    mockUseStarknetTBTCBalance.mockReturnValue({
      balance: "50.25",
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    })

    render(<TbtcBalanceCard />)

    expect(screen.getByTestId("balance")).toHaveTextContent("100.5")
    expect(screen.getByTestId("additional-info")).toBeInTheDocument()
    expect(screen.getByTestId("additional-info")).toHaveTextContent(
      "StarkNet: 50.25 tBTC"
    )
  })

  it("should show loading state for StarkNet balance", () => {
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
    })

    mockUseStarknetTBTCBalance.mockReturnValue({
      balance: "0",
      isLoading: true,
      error: null,
      refetch: jest.fn(),
    })

    render(<TbtcBalanceCard />)

    expect(screen.getByTestId("additional-info")).toHaveTextContent(
      "StarkNet: Loading..."
    )
  })

  it("should show error state for StarkNet balance", () => {
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
    })

    mockUseStarknetTBTCBalance.mockReturnValue({
      balance: "0",
      isLoading: false,
      error: "Failed to fetch balance",
      refetch: jest.fn(),
    })

    render(<TbtcBalanceCard />)

    expect(screen.getByTestId("additional-info")).toHaveTextContent(
      "StarkNet: Error"
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
    })

    mockUseStarknetTBTCBalance.mockReturnValue({
      balance: "50",
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    })

    render(<TbtcBalanceCard />)

    // The main balance should show Ethereum balance
    expect(screen.getByTestId("balance")).toHaveTextContent("100")

    // Additional info should show StarkNet balance
    expect(screen.getByTestId("additional-info")).toHaveTextContent(
      "StarkNet: 50 tBTC"
    )
  })

  it("should handle StarkNet connection without balance", () => {
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
    })

    mockUseStarknetTBTCBalance.mockReturnValue({
      balance: "0",
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    })

    render(<TbtcBalanceCard />)

    expect(screen.getByTestId("additional-info")).toHaveTextContent(
      "StarkNet: 0 tBTC"
    )
  })
})
