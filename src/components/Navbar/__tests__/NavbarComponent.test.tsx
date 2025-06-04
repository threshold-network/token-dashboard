import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { ChakraProvider } from "@chakra-ui/react"
import NavbarComponent from "../NavbarComponent"
import { MockStarknetProvider } from "../../../test/starknet-test-utils"

// Mock the imported components
jest.mock("../WalletConnectionAlert", () => ({
  __esModule: true,
  default: () => <div>WalletConnectionAlert</div>,
}))

jest.mock("../TrmWalletScreeningAlert", () => ({
  __esModule: true,
  default: () => <div>TrmWalletScreeningAlert</div>,
}))

jest.mock("../HamburgerButton", () => ({
  __esModule: true,
  default: () => <button>HamburgerButton</button>,
}))

jest.mock("../DarkModeSwitcher", () => ({
  __esModule: true,
  default: () => <button>DarkModeSwitcher</button>,
}))

jest.mock("../AccountButton", () => ({
  __esModule: true,
  default: (props: any) => (
    <button onClick={props.openWalletModal}>AccountButton</button>
  ),
}))

jest.mock("../NetworkButton", () => ({
  __esModule: true,
  default: () => <button>NetworkButton</button>,
}))

jest.mock("../../StarknetWalletStatus", () => ({
  __esModule: true,
  default: () => <div>StarknetWalletStatus</div>,
}))

jest.mock("../../../hooks/useChakraBreakpoint", () => ({
  __esModule: true,
  default: () => false,
}))

jest.mock("../../../pages", () => ({
  pages: [],
}))

describe("NavbarComponent", () => {
  const defaultProps = {
    account: "0x123456789",
    chainId: 1,
    openWalletModal: jest.fn(),
    deactivate: jest.fn(),
  }

  const renderComponent = (
    props = {},
    starknetValue = { isConnected: false }
  ) => {
    return render(
      <ChakraProvider>
        <MemoryRouter>
          <MockStarknetProvider value={starknetValue}>
            <NavbarComponent {...defaultProps} {...props} />
          </MockStarknetProvider>
        </MemoryRouter>
      </ChakraProvider>
    )
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("should render basic navbar components", () => {
    renderComponent()

    expect(screen.getByText("DarkModeSwitcher")).toBeInTheDocument()
    expect(screen.getByText("NetworkButton")).toBeInTheDocument()
    expect(screen.getByText("AccountButton")).toBeInTheDocument()
  })

  it("should not render StarknetWalletStatus when Starknet is not connected", () => {
    renderComponent()

    expect(screen.queryByText("StarknetWalletStatus")).not.toBeInTheDocument()
  })

  it("should render StarknetWalletStatus when Starknet is connected", () => {
    renderComponent({}, { isConnected: true })

    expect(screen.getByText("StarknetWalletStatus")).toBeInTheDocument()
  })

  it("should render both AccountButton and StarknetWalletStatus when both wallets are connected", () => {
    renderComponent({ account: "0x123" }, { isConnected: true })

    expect(screen.getByText("AccountButton")).toBeInTheDocument()
    expect(screen.getByText("StarknetWalletStatus")).toBeInTheDocument()
  })

  it("should not render NetworkButton when chainId is not provided", () => {
    renderComponent({ chainId: undefined })

    expect(screen.queryByText("NetworkButton")).not.toBeInTheDocument()
  })

  it("should render wallet connection alerts", () => {
    renderComponent()

    expect(screen.getByText("WalletConnectionAlert")).toBeInTheDocument()
    expect(screen.getByText("TrmWalletScreeningAlert")).toBeInTheDocument()
  })
})
