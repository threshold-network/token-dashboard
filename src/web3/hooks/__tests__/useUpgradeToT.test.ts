import { act, renderHook } from "@testing-library/react-hooks"
// @ts-ignore
import VendingMachineKeep from "@threshold-network/solidity-contracts/artifacts/VendingMachineKeep.json"
// @ts-ignore
import VendingMachineNuCypher from "@threshold-network/solidity-contracts/artifacts/VendingMachineNuCypher.json"
import { useUpgradeToT } from "../useUpgradeToT"
import { getContract } from "../../../utils/getContract"
import { useToken } from "../../../hooks/useToken"
import { useSendTransaction } from "../useSendTransaction"
import { Token, TransactionStatus } from "../../../enums"

jest.mock("../useSendTransaction", () => ({
  useSendTransaction: jest.fn(),
}))

jest.mock("../../../hooks/useToken", () => ({
  useToken: jest.fn(),
}))

jest.mock(
  "@threshold-network/solidity-contracts/artifacts/VendingMachineKeep.json",
  () => ({
    address: "0x1",
  })
)
jest.mock(
  "@threshold-network/solidity-contracts/artifacts/VendingMachineNuCypher.json",
  () => ({
    address: "0x2",
  })
)

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
    token         | contractArtifact
    ${Token.Keep} | ${VendingMachineKeep}
    ${Token.Nu}   | ${VendingMachineNuCypher}
  `(
    "should trigger `approveAndCall` transaction of $token token",
    ({ token, contractArtifact }) => {
      const { result } = renderHook(() => useUpgradeToT(token))

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
        contractArtifact.address,
        amount,
        []
      )
    }
  )
})
