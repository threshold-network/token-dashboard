import { providers, Contract } from "ethers"
import { Interface } from "@ethersproject/abi"
import {
  ContractCall,
  IMulticall,
  Multicall,
  MULTICALL_ABI,
  MULTICALL_ADDRESSESS,
} from ".."
import { getContract } from "../../utils"

jest.mock("../../utils", () => ({
  ...(jest.requireActual("../../utils") as {}),
  getContract: jest.fn(),
}))

describe("Multicall test", () => {
  let multicall: IMulticall
  const mockMulticallContract = {
    aggregate: jest.fn(),
    interface: {},
    address: "0xE775aE21E40d34f01A5C0E1Db9FB3e637D768596",
  }
  const mockProvider = {} as providers.Provider
  const config = {
    chainId: 1,
    providerOrSigner: mockProvider,
    account: "0xE775aE21E40d34f01A5C0E1Db9FB3e637D768596",
  }

  beforeEach(() => {
    ;(getContract as jest.Mock).mockImplementation(() => mockMulticallContract)
    multicall = new Multicall(config)
  })

  test("should create the instance correctly", () => {
    expect(getContract).toHaveBeenCalledWith(
      MULTICALL_ADDRESSESS[config.chainId],
      MULTICALL_ABI,
      config.providerOrSigner,
      config.account
    )
    expect(multicall).toBeInstanceOf(Multicall)
    expect(multicall.aggregate).toBeDefined()
  })

  test("should throw an error if pass unsupported chain id to constructor", () => {
    expect(() => {
      new Multicall({ chainId: 123456, providerOrSigner: mockProvider })
    }).toThrowError("Unsupported chain id")
  })

  test("should agregate contract calls into a single result", async () => {
    const call1EncodeData = "0x123"
    const call2EncodeData = "0x456"
    const call1DecodeResult = "1"
    const call2DecodeResult = "2"

    const call1 = {
      address: "0x312Ff8703EA5aA51384061b8649651E1264D7BD8",
      interface: {
        encodeFunctionData: jest.fn().mockReturnValue(call1EncodeData),
        decodeFunctionResult: jest.fn().mockReturnValue(call1DecodeResult),
      } as unknown as Interface,
      method: "test1",
      args: ["a", 1],
    }
    const call2 = {
      address: "0x312Ff8703EA5aA51384061b8649651E1264D7BD8",
      interface: {
        encodeFunctionData: jest.fn().mockReturnValue(call2EncodeData),
        decodeFunctionResult: jest.fn().mockReturnValue(call2DecodeResult),
      } as unknown as Interface,
      method: "test2",
      args: [],
    }
    const calls: ContractCall[] = [call1, call2]
    const mockResult = ["0x0", "0x1"]

    const spyOnAggregate = jest
      .spyOn(mockMulticallContract, "aggregate")
      .mockResolvedValue([, mockResult])

    const result = await multicall.aggregate(calls)

    expect(call1.interface.encodeFunctionData).toHaveBeenCalledWith(
      call1.method,
      call1.args
    )
    expect(call2.interface.encodeFunctionData).toHaveBeenCalledWith(
      call2.method,
      call2.args
    )
    const expectedCallRequests = [
      [call1.address, call1EncodeData],
      [call2.address, call2EncodeData],
    ]
    expect(spyOnAggregate).toHaveBeenCalledWith(expectedCallRequests)
    expect(call1.interface.decodeFunctionResult).toHaveBeenCalledWith(
      call1.method,
      mockResult[0]
    )
    expect(call2.interface.decodeFunctionResult).toHaveBeenCalledWith(
      call2.method,
      mockResult[1]
    )

    expect(result).toEqual([call1DecodeResult, call2DecodeResult])
  })

  test("should return the contract call object for `getCurrentBlockTimestamp` function", () => {
    const result = multicall.getCurrentBlockTimestampCallObj()

    expect(result).toEqual({
      interface: mockMulticallContract.interface,
      address: mockMulticallContract.address,
      method: "getCurrentBlockTimestamp",
    })
  })
})
