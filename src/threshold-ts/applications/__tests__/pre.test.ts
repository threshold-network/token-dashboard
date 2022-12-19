import { BigNumber, ethers } from "ethers"
import { EthereumConfig } from "../../types"
import { IPRE, PRE, PRE_ADDRESSESS } from "../pre"
import SimplePREApplicationABI from "../pre/abi.json"
import { AddressZero, getContract, isAddressZero } from "../../utils"

jest.mock("../../utils", () => ({
  ...(jest.requireActual("../../utils") as {}),
  getContract: jest.fn(),
}))

describe("PRE application wrapper test", () => {
  let pre: IPRE
  let config: EthereumConfig

  const account = "0xaC1933A3Ee78A26E16030801273fBa250631eD5f"

  let mockPREContract: {
    address: string
    stakingProviderInfo: jest.MockedFn<any>
  }

  beforeEach(() => {
    config = {
      providerOrSigner: {} as ethers.providers.Provider,
      chainId: 1,
      account,
    }
    mockPREContract = {
      address: PRE_ADDRESSESS[config.chainId],
      stakingProviderInfo: jest.fn(),
    }
    ;(getContract as jest.Mock).mockImplementation(() => mockPREContract)
    pre = new PRE(config)
  })

  test("should create the PRE instance correctly", () => {
    expect(getContract).toHaveBeenCalledWith(
      PRE_ADDRESSESS[config.chainId],
      SimplePREApplicationABI,
      config.providerOrSigner,
      config.account
    )
    expect(pre).toBeInstanceOf(PRE)
    expect(pre.getStakingProviderAppInfo).toBeDefined()
    expect(pre.contract).toBe(mockPREContract)
    expect(pre.address).toBe(mockPREContract.address)
  })

  test("should throw an error if pass unsupported chain id to constructor", () => {
    expect(() => {
      new PRE({ chainId: 123456, providerOrSigner: config.providerOrSigner })
    }).toThrowError("Unsupported chain id")
  })

  test.each`
    operatorAddress | operatorConfirmed | testMessage
    ${AddressZero}  | ${false}          | ${"not set"}
    ${account}      | ${true}           | ${"set"}
  `(
    "should return the staking provider app info if an operator is $testMessage",
    async ({ operatorAddress, operatorConfirmed }) => {
      const mockContractResult = {
        operator: operatorAddress,
        operatorConfirmed: operatorConfirmed,
        operatorStartTimestamp: BigNumber.from(123),
      }
      mockPREContract.stakingProviderInfo.mockResolvedValue(mockContractResult)

      const result = await pre.getStakingProviderAppInfo(account)

      expect(mockPREContract.stakingProviderInfo).toHaveBeenCalledWith(account)
      expect(result).toEqual({
        operator: mockContractResult.operator,
        isOperatorConfirmed: mockContractResult.operatorConfirmed,
        operatorStartTimestamp:
          mockContractResult.operatorStartTimestamp.toString(),
        isOperatorMapped:
          !isAddressZero(mockContractResult.operator) &&
          mockContractResult.operatorConfirmed,
      })
    }
  )
})
