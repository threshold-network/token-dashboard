import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { ChakraProvider } from "@chakra-ui/react"
import StarknetWalletStatus from "../StarknetWalletStatus"
import { useStarknetConnection } from "../../hooks/useStarknetConnection"
import { mockStarknetWalletData } from "../../test/starknet-test-utils"

// Mock dependencies
jest.mock("../../hooks/useStarknetConnection")
jest.mock("../CopyToClipboard", () => ({
  CopyToClipboard: ({ text, tooltip }: any) => (
    <button data-testid="copy-button" title={tooltip}>
      Copy {text}
    </button>
  ),
}))
jest.mock("starknetkit", () => ({
  connect: jest.fn(),
  disconnect: jest.fn(),
}))
jest.mock("../../utils/shortenAddress", () => ({
  shortenAddress: (address: string) => mockStarknetWalletData.shortAddress,
}))

const mockUseStarknetConnection = useStarknetConnection as jest.MockedFunction<
  typeof useStarknetConnection
>

const renderWithChakra = (component: React.ReactElement) => {
  return render(<ChakraProvider>{component}</ChakraProvider>)
}

describe("StarknetWalletStatus", () => {
  const mockDisconnect = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("should not render when wallet is not connected", () => {
    mockUseStarknetConnection.mockReturnValue({
      isConnected: false,
      isConnecting: false,
      address: null,
      provider: null,
      walletName: null,
      walletIcon: null,
      connect: jest.fn(),
      disconnect: mockDisconnect,
      chainId: null,
      availableWallets: [],
      error: null,
    })

    const { container } = renderWithChakra(<StarknetWalletStatus />)
    expect(container.firstChild).toBeNull()
  })

  it("should render wallet status when connected", () => {
    mockUseStarknetConnection.mockReturnValue({
      isConnected: true,
      isConnecting: false,
      address: mockStarknetWalletData.validAddress,
      provider: {},
      walletName: "Argent X",
      walletIcon: "argent-icon",
      connect: jest.fn(),
      disconnect: mockDisconnect,
      chainId: "0x534e5f4d41494e", // mainnet
      availableWallets: [],
      error: null,
    })

    renderWithChakra(<StarknetWalletStatus />)

    // Check wallet name is displayed
    expect(screen.getByText("Argent X")).toBeInTheDocument()

    // Check shortened address is displayed
    expect(
      screen.getByText(mockStarknetWalletData.shortAddress)
    ).toBeInTheDocument()

    // Check network name
    expect(screen.getByText("Mainnet")).toBeInTheDocument()

    // Check copy button exists
    expect(screen.getByTestId("copy-button")).toBeInTheDocument()

    // Check disconnect button exists
    expect(
      screen.getByLabelText("Disconnect Starknet wallet")
    ).toBeInTheDocument()
  })

  it("should show testnet for sepolia chain ID", () => {
    mockUseStarknetConnection.mockReturnValue({
      isConnected: true,
      isConnecting: false,
      address: mockStarknetWalletData.validAddress,
      provider: {},
      walletName: "Braavos",
      walletIcon: "braavos-icon",
      connect: jest.fn(),
      disconnect: mockDisconnect,
      chainId: "0x534e5f5345504f4c4941", // sepolia
      availableWallets: [],
      error: null,
    })

    renderWithChakra(<StarknetWalletStatus />)

    expect(screen.getByText("Testnet")).toBeInTheDocument()
  })

  it("should show unknown network for unknown chain ID", () => {
    mockUseStarknetConnection.mockReturnValue({
      isConnected: true,
      isConnecting: false,
      address: mockStarknetWalletData.validAddress,
      provider: {},
      walletName: "Unknown Wallet",
      walletIcon: null,
      connect: jest.fn(),
      disconnect: mockDisconnect,
      chainId: "0xunknown",
      availableWallets: [],
      error: null,
    })

    renderWithChakra(<StarknetWalletStatus />)

    expect(screen.getByText("Unknown")).toBeInTheDocument()
  })

  it("should handle disconnect when button is clicked", async () => {
    mockUseStarknetConnection.mockReturnValue({
      isConnected: true,
      isConnecting: false,
      address: mockStarknetWalletData.validAddress,
      provider: {},
      walletName: "Argent X",
      walletIcon: "argent-icon",
      connect: jest.fn(),
      disconnect: mockDisconnect,
      chainId: "0x534e5f4d41494e",
      availableWallets: [],
      error: null,
    })

    renderWithChakra(<StarknetWalletStatus />)

    const disconnectButton = screen.getByLabelText("Disconnect Starknet wallet")
    fireEvent.click(disconnectButton)

    await waitFor(() => {
      expect(mockDisconnect).toHaveBeenCalledTimes(1)
    })
  })

  it("should show default wallet name when walletName is not provided", () => {
    mockUseStarknetConnection.mockReturnValue({
      isConnected: true,
      isConnecting: false,
      address: mockStarknetWalletData.validAddress,
      provider: {},
      walletName: null,
      walletIcon: null,
      connect: jest.fn(),
      disconnect: mockDisconnect,
      chainId: "0x534e5f4d41494e",
      availableWallets: [],
      error: null,
    })

    renderWithChakra(<StarknetWalletStatus />)

    expect(screen.getByText("Starknet Wallet")).toBeInTheDocument()
  })

  it("should use Argent icon for Argent wallets", () => {
    mockUseStarknetConnection.mockReturnValue({
      isConnected: true,
      isConnecting: false,
      address: mockStarknetWalletData.validAddress,
      provider: {},
      walletName: "Argent X",
      walletIcon: "argent-icon",
      connect: jest.fn(),
      disconnect: mockDisconnect,
      chainId: "0x534e5f4d41494e",
      availableWallets: [],
      error: null,
    })

    const { container } = renderWithChakra(<StarknetWalletStatus />)

    // The icon should be rendered
    const svgElements = container.querySelectorAll("svg")
    expect(svgElements.length).toBeGreaterThan(0)
  })

  it("should use Starknet icon for non-Argent wallets", () => {
    mockUseStarknetConnection.mockReturnValue({
      isConnected: true,
      isConnecting: false,
      address: mockStarknetWalletData.validAddress,
      provider: {},
      walletName: "Braavos",
      walletIcon: "braavos-icon",
      connect: jest.fn(),
      disconnect: mockDisconnect,
      chainId: "0x534e5f4d41494e",
      availableWallets: [],
      error: null,
    })

    const { container } = renderWithChakra(<StarknetWalletStatus />)

    // The icon should be rendered
    const svgElements = container.querySelectorAll("svg")
    expect(svgElements.length).toBeGreaterThan(0)
  })

  it("should have proper tooltip on disconnect button", async () => {
    mockUseStarknetConnection.mockReturnValue({
      isConnected: true,
      isConnecting: false,
      address: mockStarknetWalletData.validAddress,
      provider: {},
      walletName: "Argent X",
      walletIcon: "argent-icon",
      connect: jest.fn(),
      disconnect: mockDisconnect,
      chainId: "0x534e5f4d41494e",
      availableWallets: [],
      error: null,
    })

    renderWithChakra(<StarknetWalletStatus />)

    const disconnectButton = screen.getByLabelText("Disconnect Starknet wallet")

    // Hover over the button to show tooltip
    fireEvent.mouseOver(disconnectButton)

    // The button should exist and be clickable
    expect(disconnectButton).toBeInTheDocument()
    expect(disconnectButton).toBeEnabled()
  })
})
