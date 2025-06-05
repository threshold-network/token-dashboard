import React from "react"
import { render, fireEvent, waitFor } from "@testing-library/react"
import { ProvideData } from "../ProvideData"
import { useWeb3React } from "@web3-react/core"
import { useNonEVMConnection } from "../../../../../hooks/useNonEVMConnection"
import {
  useThreshold,
  useStarkNetStatus,
} from "../../../../../contexts/ThresholdContext"
import { ChainName } from "../../../../../threshold-ts/types"
import { initializeStarkNetDeposit } from "../../../../../utils/tbtcStarknetHelpers"

// Mock dependencies
jest.mock("@web3-react/core")
jest.mock("../../../../../hooks/useNonEVMConnection")
jest.mock("../../../../../contexts/ThresholdContext")
jest.mock("../../../../../utils/tbtcStarknetHelpers")
jest.mock("../../../../../hooks/useTbtcState")
jest.mock("../../../../../hooks/tbtc/useDepositTelemetry")

const mockUseWeb3React = useWeb3React as jest.MockedFunction<
  typeof useWeb3React
>
const mockUseNonEVMConnection = useNonEVMConnection as jest.MockedFunction<
  typeof useNonEVMConnection
>
const mockUseThreshold = useThreshold as jest.MockedFunction<
  typeof useThreshold
>
const mockUseStarkNetStatus = useStarkNetStatus as jest.MockedFunction<
  typeof useStarkNetStatus
>
const mockInitializeStarkNetDeposit =
  initializeStarkNetDeposit as jest.MockedFunction<
    typeof initializeStarkNetDeposit
  >

// Mock threshold object
const mockThreshold = {
  tbtc: {
    initiateDeposit: jest.fn(),
    initiateCrossChainDeposit: jest.fn(),
    calculateDepositAddress: jest.fn().mockResolvedValue("bc1qtest123"),
  },
}

// Mock deposit object
const mockDeposit = {
  getReceipt: jest.fn().mockReturnValue({
    depositor: { identifierHex: "0x123" },
    blindingFactor: "blind123",
    walletPublicKeyHash: "pkh123",
    refundLocktime: "1234567",
    extraData: undefined,
  }),
}

describe("Chain-specific deposit flows", () => {
  beforeEach(() => {
    jest.clearAllMocks()

    // Default mocks
    mockUseWeb3React.mockReturnValue({
      account: "0xuser123",
      chainId: 1, // Ethereum mainnet by default
    } as any)

    mockUseNonEVMConnection.mockReturnValue({
      isNonEVMActive: false,
      nonEVMChainName: undefined,
      nonEVMPublicKey: undefined,
    })

    mockUseThreshold.mockReturnValue(mockThreshold as any)

    mockUseStarkNetStatus.mockReturnValue({
      isStarkNetReady: false,
      isStarkNetInitializing: false,
      crossChainError: null,
    })

    // Mock other required hooks
    jest.mock("../../../../../hooks/useTbtcState", () => ({
      useTbtcState: () => ({ updateState: jest.fn() }),
    }))
  })

  it("should use standard flow for Arbitrum", async () => {
    // Setup for Arbitrum
    mockUseWeb3React.mockReturnValue({
      account: "0xuser123",
      chainId: 42161, // Arbitrum
    } as any)

    mockThreshold.tbtc.initiateCrossChainDeposit.mockResolvedValue(mockDeposit)

    const { getByLabelText, getByRole } = render(<ProvideData />)

    // Fill form
    fireEvent.change(getByLabelText(/recovery address/i), {
      target: { value: "bc1qrecovery" },
    })

    // Submit
    fireEvent.click(getByRole("button", { name: /create deposit/i }))

    await waitFor(() => {
      // Should use standard cross-chain method with chainId
      expect(mockThreshold.tbtc.initiateCrossChainDeposit).toHaveBeenCalledWith(
        "bc1qrecovery",
        42161
      )
      // Should NOT use StarkNet helper
      expect(mockInitializeStarkNetDeposit).not.toHaveBeenCalled()
    })
  })

  it("should use standard flow for Base", async () => {
    // Setup for Base
    mockUseWeb3React.mockReturnValue({
      account: "0xuser123",
      chainId: 8453, // Base
    } as any)

    mockThreshold.tbtc.initiateCrossChainDeposit.mockResolvedValue(mockDeposit)

    const { getByLabelText, getByRole } = render(<ProvideData />)

    // Fill form
    fireEvent.change(getByLabelText(/recovery address/i), {
      target: { value: "bc1qrecovery" },
    })

    // Submit
    fireEvent.click(getByRole("button", { name: /create deposit/i }))

    await waitFor(() => {
      // Should use standard cross-chain method with chainId
      expect(mockThreshold.tbtc.initiateCrossChainDeposit).toHaveBeenCalledWith(
        "bc1qrecovery",
        8453
      )
      // Should NOT use StarkNet helper
      expect(mockInitializeStarkNetDeposit).not.toHaveBeenCalled()
    })
  })

  it("should use standard flow for Ethereum L1", async () => {
    // Setup for Ethereum mainnet
    mockUseWeb3React.mockReturnValue({
      account: "0xuser123",
      chainId: 1, // Ethereum mainnet
    } as any)

    mockThreshold.tbtc.initiateDeposit.mockResolvedValue(mockDeposit)

    const { getByLabelText, getByRole } = render(<ProvideData />)

    // Fill form
    fireEvent.change(getByLabelText(/recovery address/i), {
      target: { value: "bc1qrecovery" },
    })

    // Submit
    fireEvent.click(getByRole("button", { name: /create deposit/i }))

    await waitFor(() => {
      // Should use L1 method
      expect(mockThreshold.tbtc.initiateDeposit).toHaveBeenCalledWith(
        "bc1qrecovery"
      )
      // Should NOT use cross-chain or StarkNet methods
      expect(
        mockThreshold.tbtc.initiateCrossChainDeposit
      ).not.toHaveBeenCalled()
      expect(mockInitializeStarkNetDeposit).not.toHaveBeenCalled()
    })
  })

  it("should use special flow ONLY for StarkNet", async () => {
    // Setup for StarkNet
    mockUseNonEVMConnection.mockReturnValue({
      isNonEVMActive: true,
      nonEVMChainName: ChainName.Starknet,
      nonEVMPublicKey: "0xstarknetaddr123",
    })

    mockUseStarkNetStatus.mockReturnValue({
      isStarkNetReady: true,
      isStarkNetInitializing: false,
      crossChainError: null,
    })

    mockInitializeStarkNetDeposit.mockResolvedValue(mockDeposit)

    const { getByLabelText, getByRole } = render(<ProvideData />)

    // Fill form - StarkNet should show additional field
    fireEvent.change(getByLabelText(/recovery address/i), {
      target: { value: "bc1qrecovery" },
    })

    // StarkNet address field should be visible
    const starknetField = getByLabelText(/starknet address/i)
    expect(starknetField).toBeInTheDocument()
    fireEvent.change(starknetField, {
      target: { value: "0xstarknetuser" },
    })

    // Submit
    fireEvent.click(getByRole("button", { name: /create deposit/i }))

    await waitFor(() => {
      // Should use StarkNet helper
      expect(mockInitializeStarkNetDeposit).toHaveBeenCalledWith(
        mockThreshold,
        "0xstarknetuser",
        "bc1qrecovery"
      )
      // Should NOT use standard methods
      expect(mockThreshold.tbtc.initiateDeposit).not.toHaveBeenCalled()
      expect(
        mockThreshold.tbtc.initiateCrossChainDeposit
      ).not.toHaveBeenCalled()
    })
  })
})
