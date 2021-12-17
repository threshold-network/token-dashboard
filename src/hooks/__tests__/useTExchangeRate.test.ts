import { renderHook } from "@testing-library/react-hooks"
import { WeiPerEther } from "@ethersproject/constants"
import { useTExchangeRate } from "../useTExchangeRate"
import { useTConvertedAmount } from "../useTConvertedAmount"
import { Token } from "../../enums"

jest.mock("../useTConvertedAmount", () => ({
  useTConvertedAmount: jest.fn(),
}))

describe("Test `useTExchangeRate` hook", () => {
  const token = Token.Keep
  const mockedExchangeRate = {
    amount: "4500000000000000000",
    formattedAmount: "4.5",
  }

  beforeEach(() => {
    ;(useTConvertedAmount as jest.Mock).mockReturnValue(mockedExchangeRate)
  })

  test("should return correct exchange rate", () => {
    const { result } = renderHook(() => useTExchangeRate(token))

    expect(useTConvertedAmount).toHaveBeenCalledWith(
      token,
      WeiPerEther.toString()
    )
    expect(result.current).toEqual(mockedExchangeRate)
  })
})
