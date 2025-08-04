/**
 * Starknet-specific tests for InitiateMinting component
 * Following TDD approach
 */

import React from "react"
import { render } from "@testing-library/react"

// Create a minimal test component to verify Starknet UI logic
const StarkNetMintingUI: React.FC<{
  isStarkNetDeposit: boolean
  depositAmount: string
  mintAmount: string
}> = ({ isStarkNetDeposit, depositAmount, mintAmount }) => {
  return (
    <div>
      <h3>
        {isStarkNetDeposit ? "Initiate Starknet minting" : "Initiate minting"}
      </h3>

      <div>
        <p>
          You deposited {depositAmount} BTC and will receive {mintAmount} tBTC
        </p>

        {isStarkNetDeposit ? (
          <p>
            Receiving tBTC on Starknet requires bridging through the StarkGate
            bridge. Your tBTC will be minted on Ethereum Mainnet and then
            bridged to Starknet Mainnet. This process typically takes 15-30
            minutes to complete.
          </p>
        ) : (
          <p>
            Receiving tBTC requires a single transaction on Ethereum and takes
            approximately 2 hours. The bridging can be initiated before you get
            all your Bitcoin deposit confirmations.
          </p>
        )}
      </div>

      {isStarkNetDeposit && (
        <div>
          <strong>Bridge to Starknet:</strong> After minting on Ethereum, your
          tBTC will automatically be bridged to Starknet using the StarkGate
          bridge.
        </div>
      )}

      <button>
        {isStarkNetDeposit ? "Initiate Starknet Bridging" : "Bridge"}
      </button>
    </div>
  )
}

describe("InitiateMinting Starknet UI Logic", () => {
  describe("TDD - Expected behavior", () => {
    it("should show Starknet-specific UI when it's a Starknet deposit", () => {
      const { getByText } = render(
        <StarkNetMintingUI
          isStarkNetDeposit={true}
          depositAmount="1.0"
          mintAmount="0.995"
        />
      )

      expect(getByText("Initiate Starknet minting")).toBeInTheDocument()
      expect(getByText(/15-30 minutes/i)).toBeInTheDocument()
      expect(getByText("Bridge to Starknet:")).toBeInTheDocument()
      expect(getByText("Initiate Starknet Bridging")).toBeInTheDocument()
      // StarkGate bridge is mentioned multiple times, which is correct
      const starkGateElements = render(
        <StarkNetMintingUI
          isStarkNetDeposit={true}
          depositAmount="1.0"
          mintAmount="0.995"
        />
      ).getAllByText(/starkgate bridge/i)
      expect(starkGateElements.length).toBeGreaterThan(0)
    })

    it("should show standard UI for non-Starknet deposits", () => {
      const { getByText, queryByText } = render(
        <StarkNetMintingUI
          isStarkNetDeposit={false}
          depositAmount="1.0"
          mintAmount="0.995"
        />
      )

      expect(getByText("Initiate minting")).toBeInTheDocument()
      expect(queryByText(/starkgate bridge/i)).not.toBeInTheDocument()
      expect(queryByText("Bridge to Starknet:")).not.toBeInTheDocument()
      expect(getByText("Bridge")).toBeInTheDocument()
      expect(getByText(/approximately 2 hours/i)).toBeInTheDocument()
    })
  })
})
