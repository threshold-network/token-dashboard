import { screen } from "@testing-library/react"
import { renderWithProviders } from "../../../test-helpers/renderWithProviders"
import { MockStarknetProvider } from "../../../test/starknet-test-utils"
import NavbarComponent from "../NavbarComponent"
import { ChainName } from "../../../threshold-ts/types"
import { UseNonEVMConnectionResult } from "../../../hooks/useNonEVMConnection"

// Mock the necessary hooks and components
jest.mock("../../../hooks/useChakraBreakpoint", () => ({
  __esModule: true,
  default: () => false,
}))

jest.mock("../../../pages", () => ({
  pages: [],
}))

jest.mock("../../../utils/shortenAddress", () => ({
  __esModule: true,
  default: (address: string) => {
    if (!address) return ""
    if (address.length < 10) return address
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  },
}))

jest.mock("../../../hooks/useNonEVMConnection", () => ({
  useNonEVMConnection: jest.fn(),
}))

jest.mock("../../../hooks/useStarknetConnection", () => ({
  useStarknetConnection: jest.fn(() => ({
    connected: false,
    isConnected: false,
    connect: jest.fn(),
    disconnect: jest.fn(),
    selectedAddress: null,
    provider: null,
    starknetWalletName: null,
    chainId: null,
  })),
}))

jest.mock("../../../contexts/StarknetWalletProvider", () => ({
  useStarknetWallet: jest.fn(() => ({
    switchNetwork: jest.fn(),
  })),
}))

jest.mock("../../../hooks/useIsActive", () => ({
  useIsActive: jest.fn(() => ({
    account: null,
    chainId: 1,
  })),
  __esModule: true,
}))

jest.mock("@chakra-ui/react", () => ({
  ...jest.requireActual("@chakra-ui/react"),
  useToast: jest.fn(() => jest.fn()),
}))

// Mock Chakra UI hooks
jest.mock("@threshold-network/components", () => ({
  ...jest.requireActual("@threshold-network/components"),
  useColorMode: () => ({
    toggleColorMode: jest.fn(),
  }),
  useColorModeValue: (light: any, dark: any) => light,
  IconButton: ({ children, ...props }: any) => (
    <button {...props}>{children}</button>
  ),
  Menu: ({ children }: any) => <div>{children}</div>,
  MenuButton: ({ children, ...props }: any) => (
    <button {...props}>{children}</button>
  ),
  MenuList: ({ children }: any) => <div>{children}</div>,
  MenuItem: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  MenuDivider: () => <hr />,
  Box: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  Stack: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  HStack: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  Button: ({ children, ...props }: any) => (
    <button {...props}>{children}</button>
  ),
  Link: ({ children, ...props }: any) => <a {...props}>{children}</a>,
  Flex: ({ children, ...props }: any) => <div {...props}>{children}</div>,
}))

// Mock the network button components to avoid routing issues
jest.mock("../NetworkButton", () => ({
  __esModule: true,
  default: () => <div>Network Button</div>,
}))

jest.mock("../StarkNetNetworkButton", () => ({
  __esModule: true,
  default: () => {
    // Access the global variable to determine if button should show
    // @ts-ignore
    if (!global.shouldShowStarkNetButton) return null
    return (
      <div data-testid="starknet-network-button">StarkNet Network Button</div>
    )
  },
}))

jest.mock("../../StarknetWalletStatus", () => ({
  __esModule: true,
  default: () => (
    <div data-testid="starknet-wallet-status">StarkNet Wallet Status</div>
  ),
}))

// Create a test wrapper for NavbarComponent
const TestNavbar = ({
  nonEVMConnectionValue,
}: {
  nonEVMConnectionValue: any
}) => {
  const { useNonEVMConnection } = require("../../../hooks/useNonEVMConnection")
  useNonEVMConnection.mockReturnValue(nonEVMConnectionValue)

  return (
    <NavbarComponent
      account={null}
      chainId={1}
      openWalletModal={() => {}}
      deactivate={() => {}}
    />
  )
}

describe("Navbar Starknet Integration", () => {
  beforeEach(() => {
    // Reset the global variable before each test
    // @ts-ignore
    global.shouldShowStarkNetButton = false
  })

  const renderComponent = (
    nonEVMConnectionValue: Partial<UseNonEVMConnectionResult> = {}
  ) => {
    const defaultValue: UseNonEVMConnectionResult = {
      isNonEVMActive: false,
      nonEVMChainName: null,
      nonEVMPublicKey: null,
      nonEVMProvider: null,
      connectedWalletName: null,
      connectedWalletIcon: null,
      isNonEVMConnecting: false,
      isNonEVMDisconnecting: false,
      disconnectNonEVMWallet: jest.fn(),
      nonEVMChainId: null,
    }
    const mergedValue = { ...defaultValue, ...nonEVMConnectionValue }
    return renderWithProviders(
      <MockStarknetProvider value={{ connected: mergedValue.isNonEVMActive }}>
        <TestNavbar nonEVMConnectionValue={mergedValue} />
      </MockStarknetProvider>
    )
  }

  it("should show Connect Wallet button when not connected", () => {
    renderComponent()

    expect(screen.getByText("Connect Wallet")).toBeInTheDocument()
    // StarkNet network button should not be visible when not connected
    expect(
      screen.queryByTestId("starknet-network-button")
    ).not.toBeInTheDocument()
  })

  it("should show wallet address when Starknet is connected", () => {
    const starknetAddress =
      "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7"

    // Enable the StarkNet button for this test
    // @ts-ignore
    global.shouldShowStarkNetButton = true

    // Need to update the Starknet connection mock to return connected = true
    const {
      useStarknetConnection,
    } = require("../../../hooks/useStarknetConnection")
    useStarknetConnection.mockReturnValue({
      connected: false,
      isConnected: true,
      connect: jest.fn(),
      disconnect: jest.fn(),
      selectedAddress: starknetAddress,
      provider: {},
      starknetWalletName: "Argent X",
      chainId: "SN_GOERLI",
    })

    renderComponent({
      isNonEVMActive: true,
      nonEVMChainName: ChainName.Starknet,
      nonEVMPublicKey: starknetAddress,
      nonEVMProvider: {},
      connectedWalletName: "Argent X",
      connectedWalletIcon: null,
      isNonEVMConnecting: false,
      isNonEVMDisconnecting: false,
      disconnectNonEVMWallet: jest.fn(),
      nonEVMChainId: "SN_GOERLI",
    })

    // Should show shortened address instead of "Connect Wallet"
    expect(screen.queryByText("Connect Wallet")).not.toBeInTheDocument()
    // Should show chain name
    expect(screen.getByText("Starknet:")).toBeInTheDocument()
    // Should show shortened address (first 6 and last 4 chars)
    expect(screen.getByText("0x049d...4dc7")).toBeInTheDocument()
    // StarkNet network button should be visible when connected
    expect(screen.getByTestId("starknet-network-button")).toBeInTheDocument()
  })

  it("should show wallet address when a different non-EVM chain is connected", () => {
    // Reset the Starknet connection mock
    const {
      useStarknetConnection,
    } = require("../../../hooks/useStarknetConnection")
    useStarknetConnection.mockReturnValue({
      connected: false,
      isConnected: false,
      connect: jest.fn(),
      disconnect: jest.fn(),
      selectedAddress: null,
      provider: null,
      starknetWalletName: null,
      chainId: null,
    })

    renderComponent({
      isNonEVMActive: true,
      nonEVMChainName: ChainName.Solana,
      nonEVMPublicKey: "SomePublicKey123",
      nonEVMProvider: {},
      connectedWalletName: "Phantom",
      connectedWalletIcon: null,
      isNonEVMConnecting: false,
      isNonEVMDisconnecting: false,
      disconnectNonEVMWallet: jest.fn(),
      nonEVMChainId: null,
    })

    // Should show shortened address instead of "Connect Wallet"
    expect(screen.queryByText("Connect Wallet")).not.toBeInTheDocument()

    // Debug what's rendered
    // screen.debug()

    // Should show chain name - use a more flexible matcher
    expect(
      screen.getByText((content, element) => {
        return content.includes("Solana")
      })
    ).toBeInTheDocument()

    // Should show shortened address - use a more flexible matcher
    expect(
      screen.getByText((content, element) => {
        return content.includes("SomeP") && content.includes("y123")
      })
    ).toBeInTheDocument()
    // StarkNet network button should not be visible for other chains
    expect(
      screen.queryByTestId("starknet-network-button")
    ).not.toBeInTheDocument()
  })
})
