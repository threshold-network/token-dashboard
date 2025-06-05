import React from "react"
import { render } from "@testing-library/react"
import { ChainName } from "../../../../../threshold-ts/types"

// Mock dependencies
jest.mock("../../../../../hooks/useTbtcState", () => ({
  useTbtcState: jest.fn(() => ({
    tBTCMintAmount: "1500000000000000000", // 1.5 in Wei
    mintingFee: "1000000000000000", // 0.001 in Wei
    thresholdNetworkFee: "2000000000000000", // 0.002 in Wei
    ethAddress: "0xEthAddress123",
    crossChainFee: "3000000000000000", // 0.003 in Wei
    starknetAddress: undefined,
    chainName: "Ethereum",
  })),
}))

jest.mock("../../../../../hooks/useIsActive", () => ({
  useIsActive: jest.fn(() => ({
    chainId: 1,
    account: "0xtest",
    isActive: true,
  })),
}))

jest.mock("../../../../../hooks/useNonEVMConnection", () => ({
  useNonEVMConnection: jest.fn(() => ({
    isNonEVMActive: false,
    nonEVMChainName: null,
    nonEVMPublicKey: null,
    nonEVMProvider: null,
  })),
}))

jest.mock("../../../../../utils/shortenAddress", () => ({
  __esModule: true,
  default: (address: string) =>
    address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "",
}))

const mockUseTbtcState = jest.requireMock(
  "../../../../../hooks/useTbtcState"
).useTbtcState
const mockUseNonEVMConnection = jest.requireMock(
  "../../../../../hooks/useNonEVMConnection"
).useNonEVMConnection

// Import after mocks
const MintingTransactionDetails =
  require("../MintingTransactionDetails").default

describe("MintingTransactionDetails StarkNet Support", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("TDD Red Phase - Expected behavior", () => {
    it("should display StarkNet recipient address when it's a StarkNet deposit", () => {
      // Arrange
      mockUseTbtcState.mockReturnValue({
        tBTCMintAmount: "1500000000000000000",
        mintingFee: "1000000000000000",
        thresholdNetworkFee: "2000000000000000",
        ethAddress: "0xEthAddress123",
        crossChainFee: "3000000000000000",
        starknetAddress:
          "0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
        chainName: "StarkNet",
      })

      mockUseNonEVMConnection.mockReturnValue({
        isNonEVMActive: true,
        nonEVMChainName: ChainName.Starknet,
        nonEVMPublicKey:
          "0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
        nonEVMProvider: {},
      })

      // Act
      const { getByText } = render(<MintingTransactionDetails />)

      // Assert
      expect(getByText("StarkNet Recipient")).toBeInTheDocument()
      expect(getByText("0x0123...cdef")).toBeInTheDocument()
    })

    it("should show cross-chain fee for StarkNet deposits", () => {
      // Arrange
      mockUseTbtcState.mockReturnValue({
        tBTCMintAmount: "1500000000000000000",
        mintingFee: "1000000000000000",
        thresholdNetworkFee: "2000000000000000",
        ethAddress: "0xEthAddress123",
        crossChainFee: "3000000000000000",
        starknetAddress: "0x123abc",
        chainName: "StarkNet",
      })

      mockUseNonEVMConnection.mockReturnValue({
        isNonEVMActive: true,
        nonEVMChainName: ChainName.Starknet,
        nonEVMPublicKey: "0x123abc",
        nonEVMProvider: {},
      })

      // Act
      const { getByText } = render(<MintingTransactionDetails />)

      // Assert
      expect(getByText("Cross-Chain Fee")).toBeInTheDocument()
      expect(getByText("0.003 tBTC")).toBeInTheDocument()
    })

    it("should not show StarkNet info for non-StarkNet deposits", () => {
      // Arrange
      mockUseTbtcState.mockReturnValue({
        tBTCMintAmount: "1500000000000000000",
        mintingFee: "1000000000000000",
        thresholdNetworkFee: "2000000000000000",
        ethAddress: "0xEthAddress123",
        crossChainFee: "3000000000000000",
        starknetAddress: undefined,
        chainName: "Ethereum",
      })

      mockUseNonEVMConnection.mockReturnValue({
        isNonEVMActive: false,
        nonEVMChainName: null,
        nonEVMPublicKey: null,
        nonEVMProvider: null,
      })

      // Act
      const { queryByText } = render(<MintingTransactionDetails />)

      // Assert
      expect(queryByText("StarkNet Recipient")).not.toBeInTheDocument()
    })

    it("should show ETH address for initiator even on StarkNet deposits", () => {
      // Arrange
      mockUseTbtcState.mockReturnValue({
        tBTCMintAmount: "1500000000000000000",
        mintingFee: "1000000000000000",
        thresholdNetworkFee: "2000000000000000",
        ethAddress: "0xEthAddress123",
        crossChainFee: "3000000000000000",
        starknetAddress: "0x123abc",
        chainName: "StarkNet",
      })

      mockUseNonEVMConnection.mockReturnValue({
        isNonEVMActive: true,
        nonEVMChainName: ChainName.Starknet,
        nonEVMPublicKey: "0x123abc",
        nonEVMProvider: {},
      })

      // Act
      const { getByText } = render(<MintingTransactionDetails />)

      // Assert
      expect(getByText("ETH address")).toBeInTheDocument()
      expect(getByText("0xEthA...s123")).toBeInTheDocument()
    })
  })
})
