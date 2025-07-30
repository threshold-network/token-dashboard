import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import { ChakraProvider, extendTheme } from "@chakra-ui/react"
import { Provider } from "react-redux"
import { configureStore } from "@reduxjs/toolkit"
import { rootReducer } from "../../../../../store"
import { InitiateMinting } from "../InitiateMinting"
import { useTbtcState } from "../../../../../hooks/useTbtcState"
import { useThreshold } from "../../../../../contexts/ThresholdContext"
import { useModal } from "../../../../../hooks/useModal"
import { useNonEVMConnection } from "../../../../../hooks/useNonEVMConnection"
import { useRevealDepositTransaction } from "../../../../../hooks/tbtc"
import { ChainName } from "../../../../../threshold-ts/types"
import { BitcoinUtxo } from "@keep-network/tbtc-v2.ts"
import { ModalType } from "../../../../../enums"

// --- Mocks Setup ---
jest.mock("../../../../../threshold-ts", () => ({
  TBTC: jest.fn().mockImplementation(() => ({
    getEstimatedDepositFees: jest.fn(),
    revealDeposit: jest.fn(),
    bridgeContract: true,
  })),
  Threshold: jest.fn().mockImplementation(() => ({
    tbtc: {
      getEstimatedDepositFees: jest.fn(),
      revealDeposit: jest.fn(),
      bridgeContract: true,
    },
  })),
}))

jest.mock("../../../../../utils/getThresholdLib", () => ({
  getThresholdLib: jest.fn(() => ({
    tbtc: {
      getEstimatedDepositFees: jest.fn(),
      revealDeposit: jest.fn(),
      bridgeContract: true,
    },
  })),
}))

jest.mock("../../../../../hooks/useTbtcState")
jest.mock("../../../../../contexts/ThresholdContext")
jest.mock("../../../../../hooks/useModal")
jest.mock("../../../../../hooks/useNonEVMConnection")
jest.mock("../../../../../hooks/tbtc")

// Mock the Toast component to avoid import errors
jest.mock("../../../../../components/Toast", () => ({
  Toast: ({ children }: any) => <div>{children}</div>,
}))

// Mock additional components that might be missing
jest.mock("../../../../../components/InfoBox", () => ({
  __esModule: true,
  default: ({ children }: any) => <div>{children}</div>,
}))

jest.mock("../../../../../components/TokenBalance", () => ({
  InlineTokenBalance: ({ tokenAmount, withSymbol, tokenSymbol }: any) => (
    <span>{`${tokenAmount} ${
      withSymbol && tokenSymbol ? tokenSymbol : ""
    }`}</span>
  ),
}))

jest.mock("../../../../../components/SubmitTxButton", () => ({
  __esModule: true,
  default: ({ children, onSubmit, ...props }: any) => (
    <button onClick={onSubmit} {...props}>
      {children}
    </button>
  ),
}))

jest.mock("../../components/BridgeProcessCardTitle", () => ({
  BridgeProcessCardTitle: ({ title }: any) => <h1>{title}</h1>,
}))

jest.mock("../../components/BridgeProcessCardSubTitle", () => ({
  BridgeProcessCardSubTitle: ({ subTitle }: any) => <h2>{subTitle}</h2>,
}))

jest.mock("../../components/MintingTransactionDetails", () => ({
  __esModule: true,
  default: () => <div>Minting Transaction Details</div>,
}))

// Mock the HOC by making it a pass-through
jest.mock(
  "../../../../../components/withOnlyConnectedWallet",
  () => (Component: any) => (props: any) => <Component {...props} />
)

const mockUseTbtcState = useTbtcState as jest.Mock
const mockUseThreshold = useThreshold as jest.Mock
const mockUseModal = useModal as jest.Mock
const mockUseNonEVMConnection = useNonEVMConnection as jest.Mock
const mockUseRevealDepositTransaction = useRevealDepositTransaction as jest.Mock

const mockRevealDeposit = jest.fn()
const mockOpenModal = jest.fn()

const mockUtxo = {
  transactionHash: "0x12345",
  outputIndex: 0,
  value: "100000000", // 1 BTC
} as unknown as BitcoinUtxo

const onPreviousStepClick = jest.fn()

const renderWithProviders = (
  ui: React.ReactElement,
  {
    initialState = {},
    store = configureStore({
      reducer: rootReducer,
      preloadedState: initialState,
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: false,
        }),
    }),
    ...renderOptions
  } = {}
) => {
  const Wrapper: React.FC = ({ children }) => (
    <ChakraProvider theme={extendTheme({})}>
      <Provider store={store}>{children}</Provider>
    </ChakraProvider>
  )
  return render(ui, { wrapper: Wrapper, ...renderOptions })
}

describe("<InitiateMinting />", () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks()

    // Default mock implementations
    mockUseTbtcState.mockReturnValue({
      tBTCMintAmount: "99900000",
      updateState: jest.fn(),
    })
    mockUseThreshold.mockReturnValue({
      tbtc: {
        getEstimatedDepositFees: jest.fn().mockResolvedValue({
          treasuryFee: "50000",
          optimisticMintFee: "50000",
          amountToMint: "99900000",
          crossChainFee: "0",
        }),
        revealDeposit: jest.fn().mockResolvedValue("0xtxhash"),
        bridgeContract: true, // Assume bridge contract is available
      },
    })
    mockUseModal.mockReturnValue({
      openModal: mockOpenModal,
      closeModal: jest.fn(),
    })
    mockUseRevealDepositTransaction.mockReturnValue({
      sendTransaction: mockRevealDeposit,
    })
    mockUseNonEVMConnection.mockReturnValue({
      isNonEVMActive: false,
      nonEVMChainName: null,
    })
  })

  test("renders standard EVM minting flow correctly", async () => {
    renderWithProviders(
      <InitiateMinting
        utxo={mockUtxo}
        onPreviousStepClick={onPreviousStepClick}
      />
    )

    // Check that it's NOT a StarkNet minting flow
    expect(
      screen.queryByText(/Initiate StarkNet minting/i)
    ).not.toBeInTheDocument()

    // Check that the component shows the deposit info
    const depositText = await screen.findByText(/You deposited/i)
    expect(depositText).toBeInTheDocument()

    // Check button text and interaction - the button text is just "Bridge"
    const bridgeButton = screen.getByRole("button", { name: "Bridge" })
    expect(bridgeButton).toBeInTheDocument()

    // Click the button
    fireEvent.click(bridgeButton)

    // Wait for async operations
    await screen.findByRole("button", { name: "Bridge" })

    // Check that revealDeposit was called
    expect(mockRevealDeposit).toHaveBeenCalledWith(mockUtxo)
  })

  test("renders StarkNet minting flow correctly", async () => {
    // Arrange for StarkNet
    mockUseNonEVMConnection.mockReturnValue({
      isNonEVMActive: true,
      nonEVMChainName: ChainName.Starknet,
    })

    const mockRevealDepositSDK = jest.fn().mockResolvedValue("0xstarknettxhash")
    mockUseThreshold.mockReturnValue({
      tbtc: {
        getEstimatedDepositFees: jest.fn().mockResolvedValue({
          treasuryFee: "50000",
          optimisticMintFee: "50000",
          amountToMint: "99900000",
          crossChainFee: "10000",
        }),
        revealDeposit: mockRevealDepositSDK,
        bridgeContract: true,
      },
    })

    renderWithProviders(
      <InitiateMinting
        utxo={mockUtxo}
        onPreviousStepClick={onPreviousStepClick}
      />
    )

    // Check that it IS a StarkNet minting flow
    expect(screen.getByText(/Initiate StarkNet minting/i)).toBeInTheDocument()

    // Check that starkgate bridge text appears
    const starkgateTexts = screen.getAllByText(/starkgate/i)
    expect(starkgateTexts.length).toBeGreaterThan(0)

    // Check that the component shows the deposit info
    const depositText = await screen.findByText(/You deposited/i)
    expect(depositText).toBeInTheDocument()

    // Check button text and interaction
    const bridgeButton = screen.getByRole("button", {
      name: "Initiate StarkNet Bridging",
    })
    expect(bridgeButton).toBeInTheDocument()

    // Click the button
    fireEvent.click(bridgeButton)

    // Wait for async operations
    await screen.findByRole("button")

    // Check that SDK reveal deposit was called, NOT the transaction wrapper
    expect(mockRevealDepositSDK).toHaveBeenCalledWith(mockUtxo)
    expect(mockRevealDeposit).not.toHaveBeenCalled()
  })

  test("shows error modal if minting fails", async () => {
    // Arrange for failure
    const errorMessage = "User rejected transaction"
    const mockFailingRevealDeposit = jest
      .fn()
      .mockRejectedValue(new Error(errorMessage))
    mockUseRevealDepositTransaction.mockReturnValue({
      sendTransaction: mockFailingRevealDeposit,
    })

    renderWithProviders(
      <InitiateMinting
        utxo={mockUtxo}
        onPreviousStepClick={onPreviousStepClick}
      />
    )

    const bridgeButton = screen.getByRole("button", { name: "Bridge" })
    fireEvent.click(bridgeButton)

    // Wait for the async error handling
    await new Promise((resolve) => setTimeout(resolve, 100))

    // Assert that the modal was opened with the error
    expect(mockOpenModal).toHaveBeenCalledWith(ModalType.TransactionFailed, {
      error: errorMessage,
      isExpandableError: true,
    })
  })
})
