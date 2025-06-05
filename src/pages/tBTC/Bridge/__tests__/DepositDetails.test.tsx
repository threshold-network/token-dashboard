import React from "react"
import { render } from "@testing-library/react"
import { Provider } from "react-redux"
import { configureStore } from "@reduxjs/toolkit"
import { ChainName } from "../../../../threshold-ts/types"
import { MemoryRouter } from "react-router-dom"

// Mock all the complex dependencies
jest.mock("../../../../components/ViewInBlockExplorer", () => ({
  __esModule: true,
  default: ({ children, id }: any) => <a href={`#${id}`}>{children}</a>,
}))

jest.mock("@walletconnect/ethereum-provider", () => ({
  __esModule: true,
  default: jest.fn(),
}))

jest.mock("../../../../web3/connectors", () => ({
  walletConnect: {},
}))

jest.mock("../../../../hooks/posthog", () => ({
  usePosthog: jest.fn(() => ({ capture: jest.fn() })),
}))

jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useParams: jest.fn(() => ({})),
  useLocation: jest.fn(() => ({ state: {} })),
  useNavigate: jest.fn(() => jest.fn()),
}))

// Mock the hooks
jest.mock("../../../../hooks/useNonEVMConnection", () => ({
  useNonEVMConnection: jest.fn(() => ({
    isNonEVMActive: false,
    nonEVMChainName: null,
    nonEVMPublicKey: null,
    nonEVMProvider: null,
  })),
}))

jest.mock("../../../../hooks/useIsActive", () => ({
  useIsActive: jest.fn(() => ({
    chainId: 1,
    account: "0xtest",
    isActive: true,
  })),
}))

const mockUseNonEVMConnection = jest.requireMock(
  "../../../../hooks/useNonEVMConnection"
).useNonEVMConnection
const mockUseIsActive = jest.requireMock(
  "../../../../hooks/useIsActive"
).useIsActive

// Import after mocks
const { DepositDetails } = require("../DepositDetails")

// Create mock store
const createMockStore = (depositData: any) => {
  return configureStore({
    reducer: {
      tbtc: () => ({
        depositData,
        loading: false,
        error: null,
      }),
    },
  })
}

describe("DepositDetails StarkNet", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("should display StarkNet deposit info when deposit is for StarkNet", () => {
    // Arrange
    const depositData = {
      btcDepositAddress: "bc1q...",
      chainName: "StarkNet",
      starknetAddress: "0x123abc456def",
      ethAddress: "0xEthAddress123",
      btcRecoveryAddress: "bc1qrecovery...",
    }

    mockUseNonEVMConnection.mockReturnValue({
      isNonEVMActive: true,
      nonEVMChainName: ChainName.Starknet,
      nonEVMPublicKey: "0x123abc456def",
      nonEVMProvider: {},
    })

    const store = createMockStore(depositData)

    // Act
    const { getByText } = render(
      <Provider store={store}>
        <DepositDetails />
      </Provider>
    )

    // Assert
    expect(getByText(/starknet cross-chain deposit/i)).toBeInTheDocument()
    expect(getByText("0x123abc456def")).toBeInTheDocument()
    expect(getByText(/recipient address/i)).toBeInTheDocument()
  })

  it("should not display StarkNet info for non-StarkNet deposits", () => {
    // Arrange
    const depositData = {
      btcDepositAddress: "bc1q...",
      chainName: "Ethereum",
      ethAddress: "0xEthAddress123",
      btcRecoveryAddress: "bc1qrecovery...",
    }

    mockUseNonEVMConnection.mockReturnValue({
      isNonEVMActive: false,
      nonEVMChainName: null,
      nonEVMPublicKey: null,
      nonEVMProvider: null,
    })

    const store = createMockStore(depositData)

    // Act
    const { queryByText } = render(
      <Provider store={store}>
        <DepositDetails />
      </Provider>
    )

    // Assert
    expect(queryByText(/starknet cross-chain deposit/i)).not.toBeInTheDocument()
    expect(queryByText(/recipient address/i)).not.toBeInTheDocument()
  })

  it("should link to correct StarkNet explorer for mainnet", () => {
    // Arrange
    const depositData = {
      btcDepositAddress: "bc1q...",
      chainName: "StarkNet",
      starknetAddress: "0x123abc456def",
      ethAddress: "0xEthAddress123",
    }

    mockUseNonEVMConnection.mockReturnValue({
      isNonEVMActive: true,
      nonEVMChainName: ChainName.Starknet,
      nonEVMPublicKey: "0x123abc456def",
      nonEVMProvider: {},
    })

    const store = createMockStore(depositData)

    // Act
    const { getByRole } = render(
      <Provider store={store}>
        <DepositDetails />
      </Provider>
    )

    const explorerLink = getByRole("link", { name: /view on explorer/i })

    // Assert
    expect(explorerLink).toHaveAttribute(
      "href",
      expect.stringContaining("starkscan.co")
    )
    expect(explorerLink).toHaveAttribute(
      "href",
      expect.stringContaining("0x123abc456def")
    )
  })

  it("should link to correct StarkNet explorer for testnet", () => {
    // Arrange
    const depositData = {
      btcDepositAddress: "bc1q...",
      chainName: "StarkNet",
      starknetAddress: "0x123abc456def",
      ethAddress: "0xEthAddress123",
    }

    mockUseNonEVMConnection.mockReturnValue({
      isNonEVMActive: true,
      nonEVMChainName: ChainName.Starknet,
      nonEVMPublicKey: "0x123abc456def",
      nonEVMProvider: {},
    })

    // Mock testnet environment
    jest
      .spyOn(require("../../../../hooks/useIsActive"), "useIsActive")
      .mockReturnValue({
        chainId: 11155111, // Sepolia testnet
        account: "0xtest",
        isActive: true,
      })

    const store = createMockStore(depositData)

    // Act
    const { getByRole } = render(
      <Provider store={store}>
        <DepositDetails />
      </Provider>
    )

    const explorerLink = getByRole("link", { name: /view on explorer/i })

    // Assert
    expect(explorerLink).toHaveAttribute(
      "href",
      expect.stringContaining("sepolia.starkscan.co")
    )
  })

  it("should display shortened StarkNet address", () => {
    // Arrange
    const fullAddress =
      "0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"
    const depositData = {
      btcDepositAddress: "bc1q...",
      chainName: "StarkNet",
      starknetAddress: fullAddress,
      ethAddress: "0xEthAddress123",
    }

    mockUseNonEVMConnection.mockReturnValue({
      isNonEVMActive: true,
      nonEVMChainName: ChainName.Starknet,
      nonEVMPublicKey: fullAddress,
      nonEVMProvider: {},
    })

    const store = createMockStore(depositData)

    // Act
    const { getByText } = render(
      <Provider store={store}>
        <DepositDetails />
      </Provider>
    )

    // Assert
    // Should show shortened address like "0x0123...cdef"
    expect(getByText(/0x0123.*cdef/)).toBeInTheDocument()
  })

  it("should show deposit type label for StarkNet", () => {
    // Arrange
    const depositData = {
      btcDepositAddress: "bc1q...",
      chainName: "StarkNet",
      starknetAddress: "0x123abc456def",
      ethAddress: "0xEthAddress123",
    }

    mockUseNonEVMConnection.mockReturnValue({
      isNonEVMActive: true,
      nonEVMChainName: ChainName.Starknet,
      nonEVMPublicKey: "0x123abc456def",
      nonEVMProvider: {},
    })

    const store = createMockStore(depositData)

    // Act
    const { getByText } = render(
      <Provider store={store}>
        <DepositDetails />
      </Provider>
    )

    // Assert
    expect(getByText("Deposit Type")).toBeInTheDocument()
    expect(getByText("StarkNet Cross-Chain")).toBeInTheDocument()
  })
})
