import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { ChakraProvider } from "@chakra-ui/react"
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

jest.mock("../../../hooks/useNonEVMConnection", () => ({
  useNonEVMConnection: jest.fn(),
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
    }
    const mergedValue = { ...defaultValue, ...nonEVMConnectionValue }
    return render(
      <ChakraProvider>
        <MemoryRouter>
          <MockStarknetProvider
            value={{ isConnected: mergedValue.isNonEVMActive }}
          >
            <TestNavbar nonEVMConnectionValue={mergedValue} />
          </MockStarknetProvider>
        </MemoryRouter>
      </ChakraProvider>
    )
  }

  it("should not show Starknet wallet status when not connected", () => {
    renderComponent()

    expect(screen.getByText("Connect Wallet")).toBeInTheDocument()
    expect(
      screen.queryByTestId("starknet-wallet-status")
    ).not.toBeInTheDocument()
  })

  it("should show Starknet wallet status when Starknet is connected", () => {
    renderComponent({
      isNonEVMActive: true,
      nonEVMChainName: ChainName.Starknet,
      nonEVMPublicKey:
        "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
      nonEVMProvider: {},
      connectedWalletName: "Argent X",
      connectedWalletIcon: null,
      isNonEVMConnecting: false,
      isNonEVMDisconnecting: false,
      disconnectNonEVMWallet: jest.fn(),
    })

    expect(screen.getByText("Connect Wallet")).toBeInTheDocument()
    expect(screen.getByTestId("starknet-wallet-status")).toBeInTheDocument()
  })

  it("should not show Starknet wallet status when a different non-EVM chain is connected", () => {
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
    })

    expect(screen.getByText("Connect Wallet")).toBeInTheDocument()
    expect(
      screen.queryByTestId("starknet-wallet-status")
    ).not.toBeInTheDocument()
  })
})
