import React from "react"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import {
  StarknetWalletProvider,
  useStarknetWallet,
} from "../StarknetWalletProvider"
import * as starknetkit from "starknetkit"

// Mock starknetkit
jest.mock("starknetkit", () => ({
  connect: jest.fn(),
  disconnect: jest.fn(),
  // Mock the connectors directly in the main module
  InjectedConnector: jest.fn().mockImplementation(() => ({
    id: "argentX",
    name: "Argent X",
    icon: "/argentx-icon.svg",
  })),
  WebWalletConnector: jest.fn().mockImplementation(() => ({
    id: "argentWebWallet",
    name: "Argent Web Wallet",
    icon: "/argent-web-icon.svg",
  })),
  StarknetChainId: jest.fn().mockImplementation(() => ({
    id: "starknet",
    name: "Starknet",
    icon: "/starknet-icon.svg",
  })),
}))

// Test component to consume the context
const TestComponent = () => {
  const {
    connect,
    disconnect,
    account,
    provider,
    connected,
    connecting,
    error,
    walletName,
    walletIcon,
    availableWallets,
  } = useStarknetWallet()

  return (
    <div>
      <div data-testid="account">{account || "No account"}</div>
      <div data-testid="connected">
        {connected ? "Connected" : "Not connected"}
      </div>
      <div data-testid="connecting">
        {connecting ? "Connecting" : "Not connecting"}
      </div>
      <div data-testid="error">{error ? error.message : "No error"}</div>
      <div data-testid="wallet-name">{walletName || "No wallet"}</div>
      <div data-testid="wallet-icon">{walletIcon || "No icon"}</div>
      <div data-testid="provider">
        {provider ? "Provider exists" : "No provider"}
      </div>
      <div data-testid="wallets-count">{availableWallets.length}</div>
      <button onClick={connect}>Connect</button>
      <button onClick={disconnect}>Disconnect</button>
    </div>
  )
}

describe("StarknetWalletProvider", () => {
  const mockAddress =
    "0x04a909347487d909a6629b56880e6e03ad3859e772048c4481f3fba88ea02c32f"
  const mockWallet = {
    on: jest.fn(),
  }
  const mockConnectorData = {
    account: mockAddress,
    id: "argentX",
    name: "Argent X",
    icon: "/argent-x-icon.svg",
  }

  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
  })

  it("should render children", () => {
    render(
      <StarknetWalletProvider>
        <div>Test Child</div>
      </StarknetWalletProvider>
    )
    expect(screen.getByText("Test Child")).toBeInTheDocument()
  })

  it("should throw error when useStarknetWallet is used outside provider", () => {
    // Suppress console.error for this test
    const originalError = console.error
    console.error = jest.fn()

    expect(() => {
      render(<TestComponent />)
    }).toThrow("useStarknetWallet must be used within StarknetWalletProvider")

    console.error = originalError
  })

  it("should provide initial state", () => {
    render(
      <StarknetWalletProvider>
        <TestComponent />
      </StarknetWalletProvider>
    )

    expect(screen.getByTestId("account")).toHaveTextContent("No account")
    expect(screen.getByTestId("connected")).toHaveTextContent("Not connected")
    expect(screen.getByTestId("connecting")).toHaveTextContent("Not connecting")
    expect(screen.getByTestId("error")).toHaveTextContent("No error")
    expect(screen.getByTestId("wallet-name")).toHaveTextContent("No wallet")
    expect(screen.getByTestId("provider")).toHaveTextContent("No provider")
    expect(screen.getByTestId("wallets-count")).toHaveTextContent("3")
  })

  it("should connect wallet successfully", async () => {
    const mockConnect = starknetkit.connect as jest.Mock
    mockConnect.mockResolvedValue({
      wallet: mockWallet,
      connectorData: mockConnectorData,
    })

    render(
      <StarknetWalletProvider>
        <TestComponent />
      </StarknetWalletProvider>
    )

    const connectButton = screen.getByText("Connect")
    await userEvent.click(connectButton)

    await waitFor(() => {
      expect(screen.getByTestId("account")).toHaveTextContent(mockAddress)
      expect(screen.getByTestId("connected")).toHaveTextContent("Connected")
      expect(screen.getByTestId("wallet-name")).toHaveTextContent("Argent X")
      expect(screen.getByTestId("provider")).toHaveTextContent(
        "Provider exists"
      )
    })

    expect(mockConnect).toHaveBeenCalledWith({
      modalMode: "alwaysAsk",
    })

    // Check localStorage
    expect(localStorage.getItem("starknet-wallet")).toBe(mockAddress)
    expect(localStorage.getItem("starknet-last-wallet")).toBe("argentX")

    // Check event listeners were set up
    expect(mockWallet.on).toHaveBeenCalledWith(
      "accountsChanged",
      expect.any(Function)
    )
    expect(mockWallet.on).toHaveBeenCalledWith(
      "networkChanged",
      expect.any(Function)
    )
  })

  it("should handle connection error", async () => {
    const mockConnect = starknetkit.connect as jest.Mock
    const error = new Error("Connection failed")
    mockConnect.mockRejectedValue(error)

    render(
      <StarknetWalletProvider>
        <TestComponent />
      </StarknetWalletProvider>
    )

    const connectButton = screen.getByText("Connect")
    await userEvent.click(connectButton)

    await waitFor(() => {
      expect(screen.getByTestId("error")).toHaveTextContent("Connection failed")
      expect(screen.getByTestId("connected")).toHaveTextContent("Not connected")
    })
  })

  it("should disconnect wallet successfully", async () => {
    const mockConnect = starknetkit.connect as jest.Mock
    const mockDisconnect = starknetkit.disconnect as jest.Mock

    mockConnect.mockResolvedValue({
      wallet: mockWallet,
      connectorData: mockConnectorData,
    })
    mockDisconnect.mockResolvedValue(undefined)

    render(
      <StarknetWalletProvider>
        <TestComponent />
      </StarknetWalletProvider>
    )

    // Connect first
    const connectButton = screen.getByText("Connect")
    await userEvent.click(connectButton)

    await waitFor(() => {
      expect(screen.getByTestId("connected")).toHaveTextContent("Connected")
    })

    // Then disconnect
    const disconnectButton = screen.getByText("Disconnect")
    await userEvent.click(disconnectButton)

    await waitFor(() => {
      expect(screen.getByTestId("account")).toHaveTextContent("No account")
      expect(screen.getByTestId("connected")).toHaveTextContent("Not connected")
      expect(screen.getByTestId("wallet-name")).toHaveTextContent("No wallet")
      expect(screen.getByTestId("provider")).toHaveTextContent("No provider")
    })

    expect(mockDisconnect).toHaveBeenCalledWith({ clearLastWallet: true })
    expect(localStorage.getItem("starknet-wallet")).toBeNull()
    expect(localStorage.getItem("starknet-last-wallet")).toBeNull()
  })

  it("should auto-reconnect on mount if wallet was previously connected", async () => {
    localStorage.setItem("starknet-wallet", mockAddress)
    localStorage.setItem("starknet-last-wallet", "argentX")

    const mockConnect = starknetkit.connect as jest.Mock
    mockConnect.mockResolvedValue({
      wallet: mockWallet,
      connectorData: mockConnectorData,
    })

    render(
      <StarknetWalletProvider>
        <TestComponent />
      </StarknetWalletProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId("account")).toHaveTextContent(mockAddress)
      expect(screen.getByTestId("connected")).toHaveTextContent("Connected")
    })

    expect(mockConnect).toHaveBeenCalledWith({
      modalMode: "neverAsk",
    })
  })

  it("should clear storage if auto-reconnect fails", async () => {
    localStorage.setItem("starknet-wallet", mockAddress)
    localStorage.setItem("starknet-last-wallet", "argentX")

    const mockConnect = starknetkit.connect as jest.Mock
    mockConnect.mockRejectedValue(new Error("Auto-reconnect failed"))

    render(
      <StarknetWalletProvider>
        <TestComponent />
      </StarknetWalletProvider>
    )

    await waitFor(() => {
      expect(localStorage.getItem("starknet-wallet")).toBeNull()
      expect(localStorage.getItem("starknet-last-wallet")).toBeNull()
    })
  })

  it("should handle account change events", async () => {
    const mockConnect = starknetkit.connect as jest.Mock
    let accountsChangedHandler: ((accounts?: string[]) => void) | null = null

    const mockWalletWithEvents = {
      on: jest.fn((event, handler) => {
        if (event === "accountsChanged") {
          accountsChangedHandler = handler
        }
      }),
    }

    mockConnect.mockResolvedValue({
      wallet: mockWalletWithEvents,
      connectorData: mockConnectorData,
    })

    render(
      <StarknetWalletProvider>
        <TestComponent />
      </StarknetWalletProvider>
    )

    const connectButton = screen.getByText("Connect")
    await userEvent.click(connectButton)

    await waitFor(() => {
      expect(screen.getByTestId("account")).toHaveTextContent(mockAddress)
    })

    // Simulate account change
    const newAddress =
      "0x05a909347487d909a6629b56880e6e03ad3859e772048c4481f3fba88ea02c32f"
    accountsChangedHandler?.([newAddress])

    await waitFor(() => {
      expect(screen.getByTestId("account")).toHaveTextContent(newAddress)
    })
  })

  it("should handle disconnect through account change event", async () => {
    const mockConnect = starknetkit.connect as jest.Mock
    const mockDisconnect = starknetkit.disconnect as jest.Mock
    mockDisconnect.mockResolvedValue(undefined)

    let accountsChangedHandler: ((accounts?: string[]) => void) | null = null

    const mockWalletWithEvents = {
      on: jest.fn((event, handler) => {
        if (event === "accountsChanged") {
          accountsChangedHandler = handler
        }
      }),
    }

    mockConnect.mockResolvedValue({
      wallet: mockWalletWithEvents,
      connectorData: mockConnectorData,
    })

    render(
      <StarknetWalletProvider>
        <TestComponent />
      </StarknetWalletProvider>
    )

    const connectButton = screen.getByText("Connect")
    await userEvent.click(connectButton)

    await waitFor(() => {
      expect(screen.getByTestId("connected")).toHaveTextContent("Connected")
    })

    // Simulate disconnect through empty accounts
    accountsChangedHandler?.([])

    await waitFor(() => {
      expect(screen.getByTestId("connected")).toHaveTextContent("Not connected")
      expect(screen.getByTestId("account")).toHaveTextContent("No account")
    })
  })
})
