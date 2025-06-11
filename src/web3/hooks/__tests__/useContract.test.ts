// Mock modules before imports
jest.mock("../../../utils/getThresholdLib", () => ({
  getThresholdLib: jest.fn(),
  getThresholdLibProvider: jest.fn(() => ({})),
  threshold: {},
}))

jest.mock("../../../utils/getContract", () => ({
  getContract: jest.fn(() => {}),
}))

jest.mock("../../../utils/getEnvVariable", () => ({
  getEnvVariable: jest.fn(),
}))

jest.mock("@web3-react/core", () => ({
  useWeb3React: jest.fn(),
}))

jest.mock("@ethersproject/providers", () => ({
  JsonRpcProvider: jest.fn(),
  Web3Provider: jest.fn(),
}))

import { renderHook } from "@testing-library/react-hooks"
import { useWeb3React } from "@web3-react/core"
import { JsonRpcProvider, Web3Provider } from "@ethersproject/providers"
import { useContract } from "../useContract"
import { getContract } from "../../../utils/getContract"
import { getEnvVariable } from "../../../utils/getEnvVariable"
import { getRpcUrl } from "../../../networks/utils"
import {
  getThresholdLib,
  getThresholdLibProvider,
} from "../../../utils/getThresholdLib"

describe("Test the `useContract` hook", () => {
  const address = "0x3aA3D0Bb15FAdDB154141c92DAaaA9022b2A346d"
  const abi = ["function balanceOf(address owner) view returns (uint256)"]
  const mockedLibrary = {}
  const mockedJsonRpcProvider = {}
  const mockedEthNodeUrl = "http://localhost:8545"
  const mockedContract = {}

  beforeEach(() => {
    // @ts-ignore
    ;(getThresholdLib as jest.Mock).mockReturnValue({
      ethers: {
        // @ts-ignore
        provider: new Web3Provider(jest.fn()),
      },
    })
  })

  describe("when web3 react context is not active", () => {
    beforeEach(() => {
      ;(useWeb3React as jest.Mock).mockReturnValue({
        chainId: null,
        library: null,
      })
      // @ts-ignore
      ;(JsonRpcProvider as jest.Mock).mockReturnValue(mockedJsonRpcProvider)
      ;(getEnvVariable as jest.Mock).mockReturnValue(mockedEthNodeUrl)
    })

    test("should not create a contract instance if an address is not defined", () => {
      const { result } = renderHook(() => useContract(null, abi))

      expect(result.current).toBeNull()
    })

    test("should not create a contract instance if an abi is not defined", () => {
      const { result } = renderHook(() => useContract(address, null))

      expect(result.current).toBeNull()
    })

    test("should create a contract instance with a default provider if web3 react provider is not active", () => {
      ;(getContract as jest.Mock).mockReturnValue(mockedContract)
      ;(getThresholdLibProvider as jest.Mock).mockReturnValue(
        mockedJsonRpcProvider
      )

      const { result } = renderHook(() => useContract(address, abi))

      expect(getThresholdLibProvider).toHaveBeenCalled()
      expect(getContract).toHaveBeenCalledWith(
        address,
        abi,
        mockedJsonRpcProvider,
        undefined
      )
      expect(result.current).toEqual(mockedContract)
    })
  })

  describe("when web3 context provider is active", () => {
    const account = "0x086813525A7dC7dafFf015Cdf03896Fd276eab60"

    beforeEach(() => {
      ;(useWeb3React as jest.Mock).mockReturnValue({
        account,
        active: true,
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
