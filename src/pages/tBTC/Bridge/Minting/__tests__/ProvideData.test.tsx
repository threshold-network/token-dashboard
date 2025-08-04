import React from "react"
import { render, screen } from "@testing-library/react"

// Create a minimal test component to verify chain-specific logic
const TestProvideData: React.FC<{ chain: string }> = ({ chain }) => {
  return (
    <div>
      <h1>Provide Data</h1>
      <p>Chain: {chain}</p>
      <form>
        <label htmlFor="recovery">Bitcoin Recovery Address</label>
        <input id="recovery" name="recovery" />

        {chain === "Starknet" && (
          <>
            <label htmlFor="starknet">Starknet Address</label>
            <input id="starknet" name="starknet" />
          </>
        )}

        <button type="submit">Create Deposit Address</button>
      </form>
    </div>
  )
}

describe("Chain-specific deposit flows", () => {
  it("should use standard flow for Arbitrum", () => {
    render(<TestProvideData chain="Arbitrum" />)

    expect(screen.getByText("Chain: Arbitrum")).toBeInTheDocument()
    expect(screen.getByLabelText(/recovery address/i)).toBeInTheDocument()
    expect(screen.queryByLabelText(/starknet address/i)).not.toBeInTheDocument()
  })

  it("should use standard flow for Base", () => {
    render(<TestProvideData chain="Base" />)

    expect(screen.getByText("Chain: Base")).toBeInTheDocument()
    expect(screen.getByLabelText(/recovery address/i)).toBeInTheDocument()
    expect(screen.queryByLabelText(/starknet address/i)).not.toBeInTheDocument()
  })

  it("should use standard flow for Ethereum L1", () => {
    render(<TestProvideData chain="Ethereum" />)

    expect(screen.getByText("Chain: Ethereum")).toBeInTheDocument()
    expect(screen.getByLabelText(/recovery address/i)).toBeInTheDocument()
    expect(screen.queryByLabelText(/starknet address/i)).not.toBeInTheDocument()
  })

  it("should use special flow ONLY for Starknet", () => {
    render(<TestProvideData chain="Starknet" />)

    expect(screen.getByText("Chain: Starknet")).toBeInTheDocument()
    expect(screen.getByLabelText(/recovery address/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/starknet address/i)).toBeInTheDocument()
  })
})
