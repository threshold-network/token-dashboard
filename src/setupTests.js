// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom"

// Add TextEncoder/TextDecoder polyfills for tests
global.TextEncoder = require("util").TextEncoder
global.TextDecoder = require("util").TextDecoder

// Mock react-icons to fix test issues
jest.mock("react-icons/all", () => ({
  __esModule: true,
}))

// Mock axios to fix test issues
jest.mock("axios", () => ({
  default: {
    get: jest.fn(),
    post: jest.fn(),
  },
}))

jest.mock("@keep-network/tbtc-v2.ts", () => ({
  BitcoinNetwork: {
    Mainnet: "mainnet",
    Testnet: "testnet",
  },
  chainIdFromSigner: jest.fn().mockResolvedValue(1),
  ethereumAddressFromSigner: jest.fn().mockResolvedValue("0x123"),
  loadEthereumCoreContracts: jest.fn().mockResolvedValue({}),
  TBTC: {
    initializeMainnet: jest.fn().mockResolvedValue({
      initializeCrossChain: jest.fn(),
      crossChainContracts: jest.fn(),
    }),
    initializeSepolia: jest.fn().mockResolvedValue({
      initializeCrossChain: jest.fn(),
      crossChainContracts: jest.fn(),
    }),
    initializeCustom: jest.fn().mockResolvedValue({
      initializeCrossChain: jest.fn(),
      crossChainContracts: jest.fn(),
    }),
  },
  calculateDepositAddress: jest.fn(),
  calculateDepositRefundLocktime: jest.fn(),
  DepositScriptParameters: jest.fn(),
  revealDeposit: jest.fn(),
  getRevealedDeposit: jest.fn(),
  decodeBitcoinAddress: jest.fn(),
  TransactionHash: {
    from: jest.fn().mockReturnValue({
      reverse: jest
        .fn()
        .mockReturnValue(
          "reversed_9eb901fc68f0d9bcaf575f23783b7d30ac5dd8d95f3c83dceaa13dce17de816a"
        ),
      toString: jest
        .fn()
        .mockReturnValue(
          "9eb901fc68f0d9bcaf575f23783b7d30ac5dd8d95f3c83dceaa13dce17de816a"
        ),
    }),
    reverse: jest
      .fn()
      .mockReturnValue(
        "reversed_9eb901fc68f0d9bcaf575f23783b7d30ac5dd8d95f3c83dceaa13dce17de816a"
      ),
    toString: jest
      .fn()
      .mockReturnValue(
        "9eb901fc68f0d9bcaf575f23783b7d30ac5dd8d95f3c83dceaa13dce17de816a"
      ),
  },
  computeHash160: jest.fn(),
  EthereumBridge: jest.fn(),
  ElectrumClient: jest.fn(),
  EthereumTBTCToken: jest.fn(),
}))

jest.mock("crypto-js")

// Mock the @threshold-network/components theme to fix test issues
jest.mock("@threshold-network/components", () => {
  const React = require("react")

  // Mock all commonly used Chakra hooks
  const mockColorModeValue = (lightValue, darkValue) => lightValue

  return {
    // Re-export actual React for forwardRef
    forwardRef: React.forwardRef,

    // Chakra UI hooks
    useColorModeValue: jest.fn(mockColorModeValue),
    useColorMode: jest.fn(() => ({
      colorMode: "light",
      toggleColorMode: jest.fn(),
    })),
    useBreakpointValue: jest.fn((values) => values?.base || values),
    useDisclosure: jest.fn(() => ({
      isOpen: false,
      onOpen: jest.fn(),
      onClose: jest.fn(),
      onToggle: jest.fn(),
    })),
    useClipboard: jest.fn((value) => ({
      value,
      onCopy: jest.fn(),
      hasCopied: false,
    })),

    // Chakra UI components (mock as simple divs/spans)
    Box: ({ children, ...props }) =>
      React.createElement("div", props, children),
    Flex: ({ children, ...props }) =>
      React.createElement("div", props, children),
    VStack: ({ children, ...props }) =>
      React.createElement("div", props, children),
    HStack: ({ children, ...props }) =>
      React.createElement("div", props, children),
    Stack: ({ children, ...props }) =>
      React.createElement("div", props, children),
    Text: ({ children, ...props }) =>
      React.createElement("span", props, children),
    Button: ({ children, ...props }) =>
      React.createElement("button", props, children),
    Link: ({ children, ...props }) => React.createElement("a", props, children),
    Image: (props) => React.createElement("img", props),
    Icon: (props) => React.createElement("svg", props),
    Badge: ({ children, ...props }) =>
      React.createElement("span", props, children),
    Alert: ({ children, ...props }) =>
      React.createElement("div", props, children),
    AlertIcon: (props) => React.createElement("span", props),
    Spinner: (props) =>
      React.createElement("div", { ...props, "data-testid": "spinner" }),
    List: ({ children, ...props }) =>
      React.createElement("ul", props, children),
    ListItem: ({ children, ...props }) =>
      React.createElement("li", props, children),
    Skeleton: ({ children, isLoaded = true, ...props }) =>
      isLoaded
        ? children
        : React.createElement("div", { ...props, "data-testid": "skeleton" }),

    // Theme components
    ChakraProvider: ({ children }) => children,
    defaultTheme: {
      components: {
        Badge: { variants: {} },
      },
    },

    // Typography components
    H1: ({ children, ...props }) => React.createElement("h1", props, children),
    H2: ({ children, ...props }) => React.createElement("h2", props, children),
    H3: ({ children, ...props }) => React.createElement("h3", props, children),
    H4: ({ children, ...props }) => React.createElement("h4", props, children),
    H5: ({ children, ...props }) => React.createElement("h5", props, children),
    BodyLg: ({ children, ...props }) =>
      React.createElement("p", props, children),
    BodyMd: ({ children, ...props }) =>
      React.createElement("p", props, children),
    BodySm: ({ children, ...props }) =>
      React.createElement("p", props, children),
    LabelSm: ({ children, ...props }) =>
      React.createElement("span", props, children),

    // Toast components
    Toast: ({ children, ...props }) =>
      React.createElement("div", props, children),
    useToast: jest.fn(() => jest.fn()),
  }
})
