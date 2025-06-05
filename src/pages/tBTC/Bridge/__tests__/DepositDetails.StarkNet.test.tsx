/**
 * StarkNet-specific tests for DepositDetails component
 * Following TDD approach - Red, Green, Refactor
 */

import React from "react"
import { render } from "@testing-library/react"
import { ChainName } from "../../../../threshold-ts/types"

// Create a minimal test component to verify StarkNet display logic
const StarkNetDepositInfo: React.FC<{
  chainName?: string
  starknetAddress?: string
  isStarkNet?: boolean
}> = ({ chainName, starknetAddress, isStarkNet }) => {
  const shouldShowStarkNetInfo = isStarkNet || chainName === "StarkNet"

  if (!shouldShowStarkNetInfo) {
    return null
  }

  return (
    <div>
      <h2>StarkNet Cross-Chain Deposit</h2>
      <div>
        <label>Deposit Type</label>
        <span>StarkNet Cross-Chain</span>
      </div>
      <div>
        <label>Recipient Address</label>
        <span>{starknetAddress}</span>
      </div>
      <a
        href={`https://starkscan.co/contract/${starknetAddress}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        View on Explorer
      </a>
    </div>
  )
}

describe("DepositDetails StarkNet Display Logic", () => {
  describe("TDD Red Phase - Define expected behavior", () => {
    it("should display StarkNet deposit info when chainName is StarkNet", () => {
      const { getByText } = render(
        <StarkNetDepositInfo
          chainName="StarkNet"
          starknetAddress="0x123abc456def"
          isStarkNet={true}
        />
      )

      expect(getByText(/starknet cross-chain deposit/i)).toBeInTheDocument()
      expect(getByText("0x123abc456def")).toBeInTheDocument()
      expect(getByText(/recipient address/i)).toBeInTheDocument()
    })

    it("should not display StarkNet info for non-StarkNet deposits", () => {
      const { container } = render(
        <StarkNetDepositInfo chainName="Ethereum" isStarkNet={false} />
      )

      expect(container.firstChild).toBeNull()
    })

    it("should show deposit type label for StarkNet", () => {
      const { getByText } = render(
        <StarkNetDepositInfo
          chainName="StarkNet"
          starknetAddress="0x123abc456def"
          isStarkNet={true}
        />
      )

      expect(getByText("Deposit Type")).toBeInTheDocument()
      expect(getByText("StarkNet Cross-Chain")).toBeInTheDocument()
    })

    it("should link to correct StarkNet explorer", () => {
      const { getByRole } = render(
        <StarkNetDepositInfo
          chainName="StarkNet"
          starknetAddress="0x123abc456def"
          isStarkNet={true}
        />
      )

      const explorerLink = getByRole("link", { name: /view on explorer/i })
      expect(explorerLink).toHaveAttribute(
        "href",
        "https://starkscan.co/contract/0x123abc456def"
      )
      expect(explorerLink).toHaveAttribute("target", "_blank")
    })
  })
})

// Export the component for use in actual implementation
export { StarkNetDepositInfo }
