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

// --- Mocks Setup ---
jest.mock("../../../../../hooks/useTbtcState")
jest.mock("../../../../../contexts/ThresholdContext")
jest.mock("../../../../../hooks/useModal")
jest.mock("../../../../../hooks/useNonEVMConnection")
jest.mock("../../../../../hooks/tbtc")

// Mock the HOC by making it a pass-through
jest.mock(
  "../../../../../components/withWalletConnection",
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

    // Check titles and subtitles
    expect(
      screen.getByText("Initiate minting", { exact: false })
    ).toBeInTheDocument()
    expect(
      screen.queryByText("Initiate StarkNet minting")
    ).not.toBeInTheDocument()

    // Check balances
    await screen.findByText("0.999 tBTC") // Wait for fees to be calculated and displayed
    expect(screen.getByText("1 BTC")).toBeInTheDocument()

    // Check button text and interaction
    const bridgeButton = screen.getByRole("button", { name: "Bridge" })
    expect(bridgeButton).toBeInTheDocument()
    fireEvent.click(bridgeButton)
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

    // Check titles and subtitles
    expect(
      screen.getByText("Initiate StarkNet minting", { exact: false })
    ).toBeInTheDocument()
    expect(screen.getByText(/starkgate bridge/i)).toBeInTheDocument()

    // Check balances
    await screen.findByText("0.999 tBTC")

    // Check button text and interaction
    const bridgeButton = screen.getByRole("button", {
      name: "Initiate StarkNet Bridging",
    })
    expect(bridgeButton).toBeInTheDocument()
    fireEvent.click(bridgeButton)
    expect(mockRevealDepositSDK).toHaveBeenCalledWith(mockUtxo)
    expect(mockRevealDeposit).not.toHaveBeenCalled() // Ensure EVM method is not called
  })

  test("shows error modal if minting fails", async () => {
    // Arrange for failure
    const errorMessage = "User rejected transaction"
    mockUseRevealDepositTransaction.mockReturnValue({
      sendTransaction: jest.fn().mockRejectedValue(new Error(errorMessage)),
    })

    renderWithProviders(
      <InitiateMinting
        utxo={mockUtxo}
        onPreviousStepClick={onPreviousStepClick}
      />
    )

    const bridgeButton = screen.getByRole("button", { name: "Bridge" })
    fireEvent.click(bridgeButton)

    // Assert that the modal was opened with the error
    await screen.findByRole("button") // Wait for async actions
    expect(mockOpenModal).toHaveBeenCalledWith("TransactionFailed", {
      error: errorMessage,
      isExpandableError: true,
    })
  })
})
