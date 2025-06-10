// Mock @threshold-network/components before imports
jest.mock("@threshold-network/components", () => ({
  ...jest.requireActual("@threshold-network/components"),
  useColorModeValue: jest.requireActual("@chakra-ui/react").useColorModeValue,
  H5: ({ children }: any) => <h5>{children}</h5>,
  VStack: ({ children }: any) => <div>{children}</div>,
}))

import { render, screen } from "@testing-library/react"
import { MemoryRouter, useMatch } from "react-router-dom"
import { ChakraProvider } from "@chakra-ui/react"
import NavbarComponent from "../NavbarComponent"
import {
  MockStarknetWalletProvider,
  createMockStarknetContextValue,
} from "../../../test/starknet-test-utils"
import { theme } from "@threshold-network/components"

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

jest.mock("../StarkNetNetworkButton", () => ({
  __esModule: true,
  default: () => <button>StarkNetNetworkButton</button>,
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

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useMatch: jest.fn(() => false),
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
    starknetValue: Partial<
      ReturnType<typeof createMockStarknetContextValue>
    > = { connected: false }
  ) => {
    return render(
      <ChakraProvider theme={theme}>
        <MemoryRouter>
          <MockStarknetWalletProvider value={starknetValue}>
            <NavbarComponent {...defaultProps} {...props} />
          </MockStarknetWalletProvider>
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

  it("should render StarkNetNetworkButton", () => {
    renderComponent()

    expect(screen.getByText("StarkNetNetworkButton")).toBeInTheDocument()
  })

  it("should render AccountButton when account is provided", () => {
    renderComponent({ account: "0x123" })

    expect(screen.getByText("AccountButton")).toBeInTheDocument()
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
