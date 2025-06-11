import React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import {
  ChakraProvider,
  extendTheme,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react"
import { ConnectStarknet } from "../ConnectStarknet"
import { useStarknetConnection } from "../../../../hooks/useStarknetConnection"
// Mock the hooks and components
jest.mock("../../../../hooks/useStarknetConnection")
jest.mock("@threshold-network/components", () => ({
  H4: ({ children }: { children: React.ReactNode }) => <h4>{children}</h4>,
  BodyMd: ({ children }: { children: React.ReactNode }) => <p>{children}</p>,
}))

// Mock icons
jest.mock("../../../../static/icons/Starknet", () => ({
  StarknetIcon: () => <div data-testid="starknet-icon">Starknet Icon</div>,
}))

jest.mock("../../../../static/icons/Argent", () => ({
  ArgentIcon: () => <div data-testid="argent-icon">Argent Icon</div>,
}))

jest.mock("@chakra-ui/react", () => ({
  ...jest.requireActual("@chakra-ui/react"),
  Badge: ({ children }: { children: React.ReactNode }) => (
    <span>{children}</span>
  ),
}))

const mockUseStarknetConnection = useStarknetConnection as jest.MockedFunction<
  typeof useStarknetConnection
>

// Create a minimal theme to avoid issues with the default theme.
const testTheme = extendTheme({
  components: {
    Badge: {
      baseStyle: {
        borderRadius: "full",
        px: 3,
        py: 1,
        textTransform: "none",
        fontSize: "sm",
        fontWeight: "medium",
        letterSpacing: "0.5px",
      },
    },
  },
})

const TestWrapper: React.FC = ({ children }) => (
  <ChakraProvider theme={testTheme}>
    <Modal isOpen={true} onClose={() => {}}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Connect Starknet</ModalHeader>
        <ModalBody>{children}</ModalBody>
        <ModalFooter />
      </ModalContent>
    </Modal>
  </ChakraProvider>
)

const renderComponent = (props = {}) => {
  const defaultProps = {
    goBack: jest.fn(),
    closeModal: jest.fn(),
  }

  return render(<ConnectStarknet {...defaultProps} {...props} />, {
    wrapper: TestWrapper,
  })
}

describe("ConnectStarknet", () => {
  const mockConnect = jest.fn()
  const mockDisconnect = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("when no wallets are available", () => {
    beforeEach(() => {
      mockUseStarknetConnection.mockReturnValue({
        isConnected: false,
        isConnecting: false,
        address: null,
        provider: null,
        walletName: null,
        walletIcon: null,
        chainId: null,
        availableWallets: [],
        error: null,
        connect: mockConnect,
        disconnect: mockDisconnect,
      })
    })

    it("should render the connect button", () => {
      renderComponent()

      expect(
        screen.getByRole("heading", { name: "Connect StarkNet Wallet" })
      ).toBeInTheDocument()
      expect(
        screen.getByText(
          "Connect your StarkNet wallet to interact with tBTC on StarkNet"
        )
      ).toBeInTheDocument()
      expect(
        screen.getByRole("button", { name: "Connect Starknet Wallet" })
      ).toBeInTheDocument()
    })

    it("should show info alert about no wallets detected", () => {
      renderComponent()

      expect(
        screen.getByText(
          "No StarkNet wallets detected. Please install Argent X or Braavos."
        )
      ).toBeInTheDocument()
    })

    it("should call connect when button is clicked", async () => {
      renderComponent()

      const connectButton = screen.getByRole("button", {
        name: "Connect Starknet Wallet",
      })
      fireEvent.click(connectButton)

      await waitFor(() => {
        expect(mockConnect).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe("when wallets are available", () => {
    beforeEach(() => {
      mockUseStarknetConnection.mockReturnValue({
        isConnected: false,
        isConnecting: false,
        address: null,
        provider: null,
        walletName: null,
        walletIcon: null,
        chainId: null,
        availableWallets: [
          { id: "argentX", name: "Argent X", icon: "argent-icon" },
          { id: "braavos", name: "Braavos", icon: "braavos-icon" },
        ],
        error: null,
        connect: mockConnect,
        disconnect: mockDisconnect,
      })
    })

    it("should render available wallets", () => {
      renderComponent()

      expect(screen.getByText("Available wallets:")).toBeInTheDocument()
      expect(screen.getByText("Argent X")).toBeInTheDocument()
      expect(screen.getByText("Braavos")).toBeInTheDocument()
    })

    it("should show Argent icon for Argent wallet", () => {
      renderComponent()

      const argentButton = screen.getByText("Argent X").closest("button")
      expect(argentButton).toContainElement(screen.getByTestId("argent-icon"))
    })

    it("should show Starknet icon for other wallets", () => {
      renderComponent()

      const braavosButton = screen.getByText("Braavos").closest("button")
      // Get all starknet icons, the first one is in the header
      const starknetIcons = screen.getAllByTestId("starknet-icon")
      // The Braavos wallet should contain one of them (not the header one)
      const buttonIcon = braavosButton?.querySelector(
        '[data-testid="starknet-icon"]'
      )
      expect(buttonIcon).toBeInTheDocument()
    })

    it("should call connect when wallet button is clicked", async () => {
      renderComponent()

      const argentButton = screen.getByText("Argent X").closest("button")!
      fireEvent.click(argentButton)

      await waitFor(() => {
        expect(mockConnect).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe("when connecting", () => {
    beforeEach(() => {
      mockUseStarknetConnection.mockReturnValue({
        isConnected: false,
        isConnecting: true,
        address: null,
        provider: null,
        walletName: null,
        walletIcon: null,
        chainId: null,
        availableWallets: [],
        error: null,
        connect: mockConnect,
        disconnect: mockDisconnect,
      })
    })

    it("should show loading state", () => {
      renderComponent()

      expect(
        screen.getByText("Connecting to your wallet...")
      ).toBeInTheDocument()
      // Chakra UI Spinner is rendered as a div with specific classes
      expect(document.querySelector(".chakra-spinner")).toBeInTheDocument()
    })

    it("should disable back button", () => {
      renderComponent()

      const backButton = screen.getByRole("button", { name: /back/i })
      expect(backButton).toBeDisabled()
    })
  })

  describe("when there is an error", () => {
    beforeEach(() => {
      mockUseStarknetConnection.mockReturnValue({
        isConnected: false,
        isConnecting: false,
        address: null,
        provider: null,
        walletName: null,
        walletIcon: null,
        chainId: null,
        availableWallets: [],
        error: new Error("Connection rejected by user"),
        connect: mockConnect,
        disconnect: mockDisconnect,
      })
    })

    it("should display error message", () => {
      renderComponent()

      expect(
        screen.getByText("Connection rejected by user")
      ).toBeInTheDocument()
    })
  })

  describe("when connected", () => {
    it("should close modal when connection is successful", () => {
      const closeModal = jest.fn()

      // Start disconnected - set up mock BEFORE render
      mockUseStarknetConnection.mockReturnValue({
        isConnected: false,
        isConnecting: false,
        address: null,
        provider: null,
        walletName: null,
        walletIcon: null,
        chainId: null,
        availableWallets: [],
        error: null,
        connect: mockConnect,
        disconnect: mockDisconnect,
      })

      const { rerender } = render(
        <ConnectStarknet goBack={jest.fn()} closeModal={closeModal} />,
        { wrapper: TestWrapper }
      )

      expect(closeModal).not.toHaveBeenCalled()

      // Update to connected
      mockUseStarknetConnection.mockReturnValue({
        isConnected: true,
        isConnecting: false,
        address: "0x123",
        provider: {},
        walletName: "Argent X",
        walletIcon: "icon",
        chainId: "0x534e5f4d41494e",
        availableWallets: [],
        error: null,
        connect: mockConnect,
        disconnect: mockDisconnect,
      })

      rerender(<ConnectStarknet goBack={jest.fn()} closeModal={closeModal} />)

      expect(closeModal).toHaveBeenCalledTimes(1)
    })
  })

  describe("back button", () => {
    it("should call goBack when clicked", () => {
      const goBack = jest.fn()

      mockUseStarknetConnection.mockReturnValue({
        isConnected: false,
        isConnecting: false,
        address: null,
        provider: null,
        walletName: null,
        walletIcon: null,
        chainId: null,
        availableWallets: [],
        error: null,
        connect: mockConnect,
        disconnect: mockDisconnect,
      })

      renderComponent({ goBack })

      const backButton = screen.getByRole("button", { name: /back/i })
      fireEvent.click(backButton)

      expect(goBack).toHaveBeenCalledTimes(1)
    })
  })

  describe("error handling", () => {
    it("should show error when connect throws", async () => {
      mockConnect.mockRejectedValueOnce(new Error("Network error"))

      mockUseStarknetConnection.mockReturnValue({
        isConnected: false,
        isConnecting: false,
        address: null,
        provider: null,
        walletName: null,
        walletIcon: null,
        chainId: null,
        availableWallets: [],
        error: null,
        connect: mockConnect,
        disconnect: mockDisconnect,
      })

      renderComponent()

      const connectButton = screen.getByRole("button", {
        name: "Connect Starknet Wallet",
      })
      fireEvent.click(connectButton)

      await waitFor(() => {
        expect(screen.getByText("Network error")).toBeInTheDocument()
      })
    })

    it("should show generic error message when error has no message", async () => {
      mockConnect.mockRejectedValueOnce({})

      mockUseStarknetConnection.mockReturnValue({
        isConnected: false,
        isConnecting: false,
        address: null,
        provider: null,
        walletName: null,
        walletIcon: null,
        chainId: null,
        availableWallets: [],
        error: null,
        connect: mockConnect,
        disconnect: mockDisconnect,
      })

      renderComponent()

      const connectButton = screen.getByRole("button", {
        name: "Connect Starknet Wallet",
      })
      fireEvent.click(connectButton)

      await waitFor(() => {
        expect(screen.getByText("Failed to connect wallet")).toBeInTheDocument()
      })
    })
  })
})
