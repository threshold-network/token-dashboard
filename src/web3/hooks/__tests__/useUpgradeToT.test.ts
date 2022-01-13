import { act, renderHook } from "@testing-library/react-hooks"
import { useUpgradeToT } from "../useUpgradeToT"
import { useToken } from "../../../hooks/useToken"
import { useSendTransaction } from "../useSendTransaction"
import { Token, TransactionStatus } from "../../../enums"
import { useVendingMachineContract } from "../useVendingMachineContract"

jest.mock("../useSendTransaction", () => ({
  useSendTransaction: jest.fn(),
}))

jest.mock("../../../hooks/useToken", () => ({
  useToken: jest.fn(),
}))

jest.mock("../useVendingMachineContract", () => ({
  useVendingMachineContract: jest.fn(),
}))

describe("Test `useUpgradeToT` hook", () => {
  const amount = "10000000000000000000" //10
  const mockedSendTransaction = jest.fn()
  const mockedContract = {}

  beforeEach(() => {
    ;(useSendTransaction as jest.Mock).mockReturnValue({
      status: TransactionStatus.Idle,
      sendTransaction: mockedSendTransaction,
    })
    ;(useToken as jest.Mock).mockReturnValue({ contract: mockedContract })
  })

  test.each`
    token         | contractAddress
    ${Token.Keep} | ${"0x1"}
    ${Token.Nu}   | ${"0x2"}
  `(
    "should trigger `approveAndCall` transaction of $token token",
    ({ token, contractAddress }) => {
      ;(useVendingMachineContract as jest.Mock).mockReturnValue({
        address: contractAddress,
      })
      const { result } = renderHook(() => useUpgradeToT(token))

      expect(useVendingMachineContract).toHaveBeenCalledWith(token)
      expect(useToken).toHaveBeenCalledWith(token)
      expect(useSendTransaction).toHaveBeenCalledWith(
        mockedContract,
        "approveAndCall"
      )
      expect(result.current.status).toEqual(TransactionStatus.Idle)
      act(() => {
        result.current.upgradeToT(amount)
      })
      expect(mockedSendTransaction).toHaveBeenCalledWith(
        contractAddress,
        amount,
        []
      )
    }
  )
})
