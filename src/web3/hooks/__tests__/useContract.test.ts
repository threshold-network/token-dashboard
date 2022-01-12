import { renderHook } from "@testing-library/react-hooks"
import { useWeb3React } from "@web3-react/core"
import { useContract } from "../useContract"
import { getContract } from "../../../utils/getContract"

jest.mock("../../../utils/getContract", () => ({
  ...(jest.requireActual("../../../utils/getContract") as {}),
  getContract: jest.fn(() => {}),
}))

jest.mock("@web3-react/core", () => ({
  ...(jest.requireActual("@web3-react/core") as {}),
  useWeb3React: jest.fn(),
}))

describe("Test the `useContract` hook", () => {
  const address = "0x3aA3D0Bb15FAdDB154141c92DAaaA9022b2A346d"
  const abi = ["function balanceOf(address owner) view returns (uint256)"]
  const mockedLibrary = {}

  describe("when web3 react context is not active", () => {
    beforeEach(() => {
      ;(useWeb3React as jest.Mock).mockReturnValue({
        chainId: null,
        library: null,
      })
    })

    test("should not create a contract instance if an address is not defined", () => {
      const { result } = renderHook(() => useContract(null, abi))

      expect(result.current).toBeNull()
    })

    test("should not create a contract instance if an abi is not defined", () => {
      const { result } = renderHook(() => useContract(address, null))

      expect(result.current).toBeNull()
    })

    test("should not create a contract instance if web3 react provider is not active", () => {
      const { result } = renderHook(() => useContract(address, abi))

      expect(result.current).toBeNull()
    })
  })

  describe("when web3 context provider is active", () => {
    const mockedContract = {}
    const account = "0x086813525A7dC7dafFf015Cdf03896Fd276eab60"

    beforeEach(() => {
      ;(useWeb3React as jest.Mock).mockReturnValue({
        account,
        chainId: 1,
        library: mockedLibrary,
      })
      ;(getContract as jest.Mock).mockReturnValue(mockedContract)
    })

    test("should create contract instance", () => {
      const { result } = renderHook(() => useContract(address, abi))

      expect(getContract).toHaveBeenCalledWith(
        address,
        abi,
        mockedLibrary,
        account
      )
      expect(result.current).toEqual(mockedContract)
    })

    test("should create contract instance w/o signer", () => {
      const { result } = renderHook(() => useContract(address, abi, false))

      expect(getContract).toHaveBeenCalledWith(
        address,
        abi,
        mockedLibrary,
        undefined
      )
      expect(result.current).toEqual(mockedContract)
    })
  })
})
