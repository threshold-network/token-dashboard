import { renderHook } from "@testing-library/react-hooks"
import { useTConvertedAmount } from "../useTConvertedAmount"
import { useVendingMachineRatio } from "../../web3/hooks/useVendingMachineRatio"
import { Token } from "../../enums"

jest.mock("../../web3/hooks/useVendingMachineRatio", () => ({
  useVendingMachineRatio: jest.fn(),
}))

describe("Test `useTConvertedAmount` hook", () => {
  const token = Token.Nu
  const mockedNuRatio = "4500000000000000" // 0.0045
  const amountToConvert = "1000000000000000000" // 1
  const expectedTAmount = "4500000000000000000" // 4.5
  const expectedformattedAmount = "4.50"

  const amountToConvert2 = 1000000000000000 // 0.001
  const expectedTAmount2 = "4500000000000000" // 0.0045
  const expectedformattedAmount2 = "0.00"

  beforeEach(() => {
    ;(useVendingMachineRatio as jest.Mock).mockReturnValue(mockedNuRatio)
  })

  test.each`
    value               | expectedValue       | formattedValue
    ${amountToConvert}  | ${expectedTAmount}  | ${expectedformattedAmount}
    ${amountToConvert2} | ${expectedTAmount2} | ${expectedformattedAmount2}
  `(
    "should convert $value token amount to T",
    ({
      value,
      expectedValue,
      formattedValue,
    }: {
      value: string | number
      expectedValue: string
      formattedValue: string
    }) => {
      const { result } = renderHook(() => useTConvertedAmount(token, value))

      expect(useVendingMachineRatio).toHaveBeenCalledWith(token)
      expect(result.current.amount).toEqual(expectedValue)
      expect(result.current.formattedAmount).toEqual(formattedValue)
    }
  )

  test.each`
    value
    ${null}
    ${"0"}
    ${undefined}
    ${""}
  `("should return default values if ratio is $value ", ({ value }) => {
    ;(useVendingMachineRatio as jest.Mock).mockReturnValue(value)
    const { result } = renderHook(() =>
      useTConvertedAmount(token, amountToConvert)
    )

    expect(useVendingMachineRatio).toHaveBeenCalledWith(token)
    expect(result.current.amount).toEqual("0")
    expect(result.current.formattedAmount).toEqual("--")
  })

  test("should return default values if an amount is not defined", () => {
    const { result } = renderHook(() => useTConvertedAmount(token, null))

    expect(useVendingMachineRatio).toHaveBeenCalledWith(token)
    expect(result.current.amount).toEqual("0")
    expect(result.current.formattedAmount).toEqual("--")
  })
})
