import React from "react"
import { render } from "@testing-library/react"
import { ChainName } from "../../../../../threshold-ts/types"
import { getThresholdLib } from "../../../../../utils/getThresholdLib"

// Mock dependencies
jest.mock("../../../../../hooks/useTbtcState")
jest.mock("../../../../../hooks/useIsActive")
jest.mock("../../../../../hooks/useNonEVMConnection")
jest.mock("../../../../../utils/getThresholdLib", () => ({
  getThresholdLib: jest.fn(),
}))

jest.mock("../../../../../utils/shortenAddress", () => ({
  __esModule: true,
  default: (address: string) =>
    address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "",
}))

jest.mock("../../../../../components/TransactionDetails", () => ({
  TransactionDetailsAmountItem: ({ label, amount, suffixItem }: any) => (
    <div>
      {label}: {amount} {suffixItem}
    </div>
  ),
  TransactionDetailsItem: ({ label, value }: any) => (
    <div>
      {label}: {value}
    </div>
  ),
}))

// Import hooks for mocking
import { useTbtcState } from "../../../../../hooks/useTbtcState"
import { useIsActive } from "../../../../../hooks/useIsActive"
import { useNonEVMConnection } from "../../../../../hooks/useNonEVMConnection"

// Type the mocked functions
const mockUseTbtcState = useTbtcState as jest.MockedFunction<
  typeof useTbtcState
>
const mockUseNonEVMConnection = useNonEVMConnection as jest.MockedFunction<
  typeof useNonEVMConnection
>
const mockUseIsActive = useIsActive as jest.MockedFunction<typeof useIsActive>

import MintingTransactionDetails from "../MintingTransactionDetails"

describe("MintingTransactionDetails StarkNet Support", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(getThresholdLib as jest.Mock).mockReturnValue({ tbtc: {} })
    mockUseTbtcState.mockReturnValue({
      tBTCMintAmount: "1500000000000000000", // 1.5 in Wei
      mintingFee: "1000000000000000", // 0.001 in Wei
      thresholdNetworkFee: "2000000000000000", // 0.002 in Wei
      ethAddress: "0xEthAddress123",
      crossChainFee: "3000000000000000", // 0.003 in Wei
      starknetAddress: undefined,
      chainName: "Ethereum",
      nonEVMChainName: null,
      nonEVMPublicKey: null,
      nonEVMProvider: null,
      nonEVMChainId: null,
    } as any)
    mockUseIsActive.mockReturnValue({
      chainId: 1,
      account: "0xtest",
      isActive: true,
      nonEVMChainName: null,
      nonEVMPublicKey: null,
      nonEVMProvider: null,
      nonEVMChainId: null,
    } as any)
    mockUseNonEVMConnection.mockReturnValue({
      isNonEVMActive: false,
      nonEVMChainName: null,
      nonEVMPublicKey: null,
      nonEVMProvider: null,
      nonEVMChainId: null,
    })
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
        nonEVMChainId: "SN_GOERLI",
      })

      // Act
      const { getByText } = render(<MintingTransactionDetails />)

      // Assert
      expect(getByText(/Starknet Recipient/)).toBeInTheDocument()
      expect(getByText(/0x0123...cdef/)).toBeInTheDocument()
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
        nonEVMChainId: "SN_GOERLI",
      })

      // Act
      const { getByText } = render(<MintingTransactionDetails />)

      // Assert
      expect(getByText(/Cross-Chain Fee/)).toBeInTheDocument()
      expect(getByText(/3000000000000000.*tBTC/)).toBeInTheDocument()
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
        nonEVMChainId: null,
      })

      // Act
      const { queryByText } = render(<MintingTransactionDetails />)

      // Assert
      expect(queryByText("Starknet Recipient")).not.toBeInTheDocument()
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
        nonEVMChainId: "SN_GOERLI",
      })

      // Act
      const { getByText } = render(<MintingTransactionDetails />)

      // Assert
      expect(getByText(/ETH address/)).toBeInTheDocument()
      expect(getByText(/0xEthA...s123/)).toBeInTheDocument()
    })
  })
})
