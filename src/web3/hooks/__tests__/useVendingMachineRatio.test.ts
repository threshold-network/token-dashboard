import { renderHook } from "@testing-library/react-hooks"
import { AddressZero } from "@ethersproject/constants"
import { useVendingMachineContract } from "../useVendingMachineContract"
import { useLocalStorage } from "../../../hooks/useLocalStorage"
import { useVendingMachineRatio } from "../useVendingMachineRatio"
import { Token } from "../../../enums"

jest.mock("../useVendingMachineContract", () => ({
  useVendingMachineContract: jest.fn(),
}))

jest.mock("../../../hooks/useLocalStorage", () => ({
  useLocalStorage: jest.fn(),
}))

describe("Test `useVendingMachineRatio` hook", () => {
  const token = Token.Keep
  const mockedContract = {
    address: "0x71C3792B30154E2e13f532AF29BC96742810dc06",
    ratio: jest.fn(),
  }
  const mockedRatioValue = "500000000000000000"
  const localStorageDefaultValue = { value: "0", contractAddress: AddressZero }
  let mockedLocalStorageValue = localStorageDefaultValue
  const mockedSetRatio = jest.fn()
  let renderHookResult

  beforeEach(() => {
    ;(useVendingMachineContract as jest.Mock).mockReturnValue(mockedContract)

    mockedLocalStorageValue = localStorageDefaultValue
    mockedSetRatio.mockImplementation((value) => {
      mockedLocalStorageValue = value
    })
    ;(useLocalStorage as jest.Mock).mockReturnValue([
      mockedLocalStorageValue,
      mockedSetRatio,
    ])

    mockedContract.ratio.mockResolvedValue(mockedRatioValue)
    renderHookResult = renderHook(() => useVendingMachineRatio(token))
  })

  test("should fetch ratio from chain and save in local storage", async () => {
    expect(useVendingMachineContract).toHaveBeenCalledWith(token)
    expect(useLocalStorage).toHaveBeenCalledWith(
      `${token}-to-T-ratio`,
      localStorageDefaultValue
    )

    expect(mockedContract.ratio).toHaveBeenCalled()

    expect(mockedSetRatio).toHaveBeenCalled()
  })

  test("should not fetch ratio from chain if the value is in the local storage", async () => {
    const mockedLocalStorageValue = {
      value: mockedRatioValue,
      contractAddress: mockedContract.address,
    }
    ;(useLocalStorage as jest.Mock).mockReturnValue([
      mockedLocalStorageValue,
      mockedSetRatio,
    ])

    const { result } = renderHook(() => useVendingMachineRatio(token))

    expect(useVendingMachineContract).toHaveBeenCalledWith(token)
    expect(useLocalStorage).toHaveBeenCalledWith(
      `${token}-to-T-ratio`,
      localStorageDefaultValue
    )

    expect(mockedContract.ratio).not.toHaveBeenCalled()
    expect(result.current).toEqual(mockedLocalStorageValue.value)
  })
})
