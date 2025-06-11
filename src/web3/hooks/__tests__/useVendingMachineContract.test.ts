import { renderHook } from "@testing-library/react-hooks"
import { useVendingMachineContract } from "../useVendingMachineContract"
import { useThreshold } from "../../../contexts/ThresholdContext"
import { Token } from "../../../enums"

jest.mock("../../../contexts/ThresholdContext", () => ({
  useThreshold: jest.fn(),
}))

describe("Test `useVendingMachineContract` hook", () => {
  const keepVendingMachineContract = { address: "0x1" }
  const nuVendingMachineContract = { address: "0x2" }

  beforeEach(() => {
    ;(useThreshold as jest.Mock).mockReturnValue({
      vendingMachines: {
        keep: { contract: keepVendingMachineContract },
        nu: { contract: nuVendingMachineContract },
      },
    })
  })

  test("should return the vending machine contract instance for KEEP token", () => {
    const { result } = renderHook(() => useVendingMachineContract(Token.Keep))
    expect(result.current).toEqual(keepVendingMachineContract)
  })

  test("should return the vending machine contract instance for NU token", () => {
    const { result } = renderHook(() => useVendingMachineContract(Token.Nu))
    expect(result.current).toEqual(nuVendingMachineContract)
  })

  test("should return null if vending machines are not available", () => {
    ;(useThreshold as jest.Mock).mockReturnValue({})
    const { result } = renderHook(() => useVendingMachineContract(Token.Keep))
    expect(result.current).toBeNull()
  })
})
