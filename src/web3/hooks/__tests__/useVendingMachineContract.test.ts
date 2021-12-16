import { renderHook } from "@testing-library/react-hooks"
// @ts-ignore
import VendingMachineKeep from "@threshold-network/solidity-contracts/artifacts/VendingMachineKeep.json"
// @ts-ignore
import VendingMachineNuCypher from "@threshold-network/solidity-contracts/artifacts/VendingMachineNuCypher.json"
import { useVendingMachineContract } from "../useVendingMachineContract"
import { useContract } from "../useContract"
import { Token } from "../../../enums"

jest.mock(
  "@threshold-network/solidity-contracts/artifacts/VendingMachineKeep.json",
  () => ({
    address: "0x1",
    abi: [],
  })
)
jest.mock(
  "@threshold-network/solidity-contracts/artifacts/VendingMachineNuCypher.json",
  () => ({
    address: "0x2",
    abi: [],
  })
)

jest.mock("../useContract", () => ({
  useContract: jest.fn(),
}))

describe("Test `useVendingMachineContract` hook", () => {
  test.each`
    token         | contractArtifact
    ${Token.Keep} | ${VendingMachineKeep}
    ${Token.Nu}   | ${VendingMachineNuCypher}
  `(
    "should return the vending machine contract instance for $token token",
    ({ token, contractArtifact }) => {
      renderHook(() => useVendingMachineContract(token))

      expect(useContract).toHaveBeenCalledWith(
        contractArtifact.address,
        contractArtifact.abi
      )
    }
  )
})
