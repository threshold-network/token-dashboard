import { BigNumber, ContractTransaction, ethers } from "ethers"
import {
  BaseERC20Token,
  ERC20TokenWithApproveAndCall,
  IERC20,
  IERC20WithApproveAndCall,
} from ".."
import { EthereumConfig } from "../../../types"
import { getContract } from "../../../utils"

jest.mock("../../../utils", () => ({
  ...(jest.requireActual("../../../utils") as {}),
  getContract: jest.fn(),
}))

describe("ERC20 token test", () => {
  let config: EthereumConfig
  let artifact: { abi: any; address: string }

  const account = "0xaC1933A3Ee78A26E16030801273fBa250631eD5f"
  const spender = "0x6c7960687253e43e98A0d3d602dD5085d2443e75"
  const amount = BigNumber.from("100000000")

  beforeEach(() => {
    artifact = {
      abi: [],
      address: "0xC49C8567DE3Cd9aA28c36b88dFb2A0EfF3BE41cE",
    }

    config = {
      providerOrSigner: {} as ethers.providers.Provider,
      chainId: 1,
      account,
    }
  })

  describe("Base ERC20 token test", () => {
    let erc20: IERC20
    let mockErc20TokenContract: {
      balanceOf: jest.MockedFn<any>
      allowance: jest.MockedFn<any>
      totalSupply: jest.MockedFn<any>
    }

    beforeEach(() => {
      mockErc20TokenContract = {
        balanceOf: jest.fn(),
        allowance: jest.fn(),
        totalSupply: jest.fn(),
      }
      ;(getContract as jest.Mock).mockImplementation(
        () => mockErc20TokenContract
      )

      erc20 = new BaseERC20Token(config, artifact)
    })

    test("should create the base erc20 token instance", () => {
      expect(getContract).toHaveBeenCalledWith(
        artifact.address,
        artifact.abi,
        config.providerOrSigner,
        config.account
      )
      expect(erc20.contract).toEqual(mockErc20TokenContract)
    })

    test("should return balance of a given address", async () => {
      mockErc20TokenContract.balanceOf.mockResolvedValue(amount)

      const result = await erc20.balanceOf(account)

      expect(mockErc20TokenContract.balanceOf).toHaveBeenCalledWith(account)
      expect(result).toEqual(amount)
    })
    test("should return allowed amount of tokens that spender will be allowed to spend on behalf of owner", async () => {
      mockErc20TokenContract.allowance.mockResolvedValue(amount)

      const result = await erc20.allowance(account, spender)

      expect(mockErc20TokenContract.allowance).toHaveBeenCalledWith(
        account,
        spender
      )
      expect(result).toEqual(amount)
    })

    test("should return the total supply of token", async () => {
      mockErc20TokenContract.totalSupply.mockResolvedValue(amount)

      const result = await erc20.totalSupply()

      expect(mockErc20TokenContract.totalSupply).toHaveBeenCalled()
      expect(result).toEqual(amount)
    })
  })

  describe("ERC20 with approve and call pattern test", () => {
    let erc20withApproveAndCall: IERC20WithApproveAndCall
    let mockErc20TokenContract: {
      balanceOf: jest.MockedFn<any>
      allowance: jest.MockedFn<any>
      totalSupply: jest.MockedFn<any>
      approveAndCall: jest.MockedFn<any>
    }

    beforeEach(() => {
      mockErc20TokenContract = {
        balanceOf: jest.fn(),
        allowance: jest.fn(),
        totalSupply: jest.fn(),
        approveAndCall: jest.fn(),
      }
      ;(getContract as jest.Mock).mockImplementation(
        () => mockErc20TokenContract
      )

      erc20withApproveAndCall = new ERC20TokenWithApproveAndCall(
        config,
        artifact
      )
    })

    test("should call the approve and call correctly", async () => {
      const extraData = "0x123456789"
      const mockTx = {} as ContractTransaction
      mockErc20TokenContract.approveAndCall.mockResolvedValue(mockTx)

      const result = await erc20withApproveAndCall.approveAndCall(
        spender,
        amount.toString(),
        extraData
      )

      expect(mockErc20TokenContract.approveAndCall).toHaveBeenCalledWith(
        spender,
        amount.toString(),
        extraData
      )
      expect(result).toEqual(mockTx)
    })
  })
})
