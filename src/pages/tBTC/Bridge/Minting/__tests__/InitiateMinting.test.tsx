import React from "react"
import { render } from "@testing-library/react"
import { ChainName } from "../../../../../threshold-ts/types"

// Mock all complex dependencies first
jest.mock("@keep-network/tbtc-v2.ts", () => ({
  BitcoinUtxo: jest.fn(),
  TBTC: jest.fn(),
}))

jest.mock("../../../../../components/tBTC", () => ({
  __esModule: true,
}))

jest.mock("../../../../../utils/getThresholdLib", () => ({
  getThresholdLib: jest.fn(),
  threshold: {},
}))

// Mock dependencies
jest.mock("../../../../../hooks/useNonEVMConnection", () => ({
  useNonEVMConnection: jest.fn(() => ({
    isNonEVMActive: false,
    nonEVMChainName: null,
    nonEVMPublicKey: null,
    nonEVMProvider: null,
  })),
}))

jest.mock("../../../../../hooks/useTbtcState", () => ({
  useTbtcState: jest.fn(() => ({
    tBTCMintAmount: "1500000000000000000",
    mintingFee: "1000000000000000",
    thresholdNetworkFee: "2000000000000000",
    crossChainFee: "3000000000000000",
    updateState: jest.fn(),
    starknetAddress: undefined,
    chainName: "Ethereum",
  })),
}))

jest.mock("../../../../../contexts/ThresholdContext", () => ({
  useThreshold: jest.fn(() => ({
    tbtc: {
      getEstimatedDepositFees: jest.fn().mockResolvedValue({
        treasuryFee: "2000000000000000",
        optimisticMintFee: "1000000000000000",
        amountToMint: "1500000000000000000",
        crossChainFee: "3000000000000000",
      }),
    },
  })),
}))

jest.mock("../../../../../hooks/tbtc", () => ({
  useRevealDepositTransaction: jest.fn(() => ({
    sendTransaction: jest.fn(),
  })),
}))

jest.mock("../../../../../hooks/useModal", () => ({
  useModal: jest.fn().mockReturnValue({
    closeModal: jest.fn(),
  }),
}))

jest.mock(
  "../../../../../components/withOnlyConnectedWallet",
  () => (Component: any) => Component
)

const mockUseNonEVMConnection = jest.requireMock(
  "../../../../../hooks/useNonEVMConnection"
).useNonEVMConnection
const mockUseTbtcState = jest.requireMock(
  "../../../../../hooks/useTbtcState"
).useTbtcState

// Import after mocks
const { InitiateMinting } = require("../InitiateMinting")

describe("InitiateMinting StarkNet Support", () => {
  const mockUtxo = {
    transactionHash: "0x123",
    outputIndex: 0,
    value: "100000000", // 1 BTC in satoshis
  }

  const mockOnPreviousStepClick = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("TDD - Expected StarkNet behavior", () => {
    it("should show StarkNet-specific UI content when it's a StarkNet deposit", () => {
      // Arrange
      mockUseNonEVMConnection.mockReturnValue({
        isNonEVMActive: true,
        nonEVMChainName: ChainName.Starknet,
        nonEVMPublicKey: "0x123abc",
        nonEVMProvider: {},
      })

      mockUseTbtcState.mockReturnValue({
        tBTCMintAmount: "1500000000000000000",
        mintingFee: "1000000000000000",
        thresholdNetworkFee: "2000000000000000",
        crossChainFee: "3000000000000000",
        updateState: jest.fn(),
        starknetAddress: "0x123abc",
        chainName: "StarkNet",
      })

      // Act
      const { getByText } = render(
        <InitiateMinting
          utxo={mockUtxo}
          onPreviousStepClick={mockOnPreviousStepClick}
        />
      )

      // Assert
      expect(getByText(/initiate starknet minting/i)).toBeInTheDocument()
      expect(getByText(/starkgate bridge/i)).toBeInTheDocument()
      expect(getByText(/15-30 minutes/i)).toBeInTheDocument()
    })

    it("should show standard minting UI for non-StarkNet deposits", () => {
      // Arrange
      mockUseNonEVMConnection.mockReturnValue({
        isNonEVMActive: false,
        nonEVMChainName: null,
        nonEVMPublicKey: null,
        nonEVMProvider: null,
      })

      mockUseTbtcState.mockReturnValue({
        tBTCMintAmount: "1500000000000000000",
        mintingFee: "1000000000000000",
        thresholdNetworkFee: "2000000000000000",
        crossChainFee: "0",
        updateState: jest.fn(),
        starknetAddress: undefined,
        chainName: "Ethereum",
      })

      // Act
      const { getByText, queryByText } = render(
        <InitiateMinting
          utxo={mockUtxo}
          onPreviousStepClick={mockOnPreviousStepClick}
        />
      )

      // Assert
      expect(queryByText(/initiate starknet minting/i)).not.toBeInTheDocument()
      expect(queryByText(/starkgate bridge/i)).not.toBeInTheDocument()
      expect(getByText(/initiate minting/i)).toBeInTheDocument()
    })

    it("should display cross-chain bridging explanation for StarkNet", () => {
      // Arrange
      mockUseNonEVMConnection.mockReturnValue({
        isNonEVMActive: true,
        nonEVMChainName: ChainName.Starknet,
        nonEVMPublicKey: "0x123abc",
        nonEVMProvider: {},
      })

      mockUseTbtcState.mockReturnValue({
        tBTCMintAmount: "1500000000000000000",
        mintingFee: "1000000000000000",
        thresholdNetworkFee: "2000000000000000",
        crossChainFee: "3000000000000000",
        updateState: jest.fn(),
        starknetAddress: "0x123abc",
        chainName: "StarkNet",
      })

      // Act
      const { getByText } = render(
        <InitiateMinting
          utxo={mockUtxo}
          onPreviousStepClick={mockOnPreviousStepClick}
        />
      )

      // Assert
      expect(getByText(/bridge to starknet/i)).toBeInTheDocument()
      expect(getByText(/ethereum mainnet/i)).toBeInTheDocument()
      expect(getByText(/starknet mainnet/i)).toBeInTheDocument()
    })

    it("should show proper button text for StarkNet", () => {
      // Arrange
      mockUseNonEVMConnection.mockReturnValue({
        isNonEVMActive: true,
        nonEVMChainName: ChainName.Starknet,
        nonEVMPublicKey: "0x123abc",
        nonEVMProvider: {},
      })

      mockUseTbtcState.mockReturnValue({
        tBTCMintAmount: "1500000000000000000",
        mintingFee: "1000000000000000",
        thresholdNetworkFee: "2000000000000000",
        crossChainFee: "3000000000000000",
        updateState: jest.fn(),
        starknetAddress: "0x123abc",
        chainName: "StarkNet",
      })

      // Act
      const { getByRole } = render(
        <InitiateMinting
          utxo={mockUtxo}
          onPreviousStepClick={mockOnPreviousStepClick}
        />
      )

      // Assert
      const button = getByRole("button", {
        name: /initiate starknet bridging/i,
      })
      expect(button).toBeInTheDocument()
    })
  })
})
