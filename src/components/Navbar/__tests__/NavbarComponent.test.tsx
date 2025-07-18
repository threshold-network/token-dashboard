// Mock @threshold-network/components before imports
jest.mock("@threshold-network/components", () => ({
  ...jest.requireActual("@threshold-network/components"),
  useColorModeValue: jest.requireActual("@chakra-ui/react").useColorModeValue,
  H5: ({ children }: any) => <h5>{children}</h5>,
  VStack: ({ children }: any) => <div>{children}</div>,
}))

import { screen } from "@testing-library/react"
import { useMatch } from "react-router-dom"
import { renderWithRouter } from "../../../test-helpers/renderWithRouter"
import NavbarComponent from "../NavbarComponent"
import {
  MockStarknetWalletProvider,
  createMockStarknetContextValue,
} from "../../../test/starknet-test-utils"

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

jest.mock("../StarknetNetworkButton", () => ({
  __esModule: true,
  default: () => <button>StarknetNetworkButton</button>,
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
    return renderWithRouter(
      <MockStarknetWalletProvider value={starknetValue}>
        <NavbarComponent {...defaultProps} {...props} />
      </MockStarknetWalletProvider>
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

  it("should render StarknetNetworkButton", () => {
    renderComponent()

    expect(screen.getByText("StarknetNetworkButton")).toBeInTheDocument()
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
