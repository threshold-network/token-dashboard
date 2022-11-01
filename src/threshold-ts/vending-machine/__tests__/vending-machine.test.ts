import { BigNumber, providers } from "ethers"
import { IVendingMachine, VendingMachine } from ".."
import { EthereumConfig } from "../../types"
import { getContract, ZERO } from "../../utils"

jest.mock("../../utils", () => ({
  ...(jest.requireActual("../../utils") as {}),
  getContract: jest.fn(),
}))

describe("Vending machine test", () => {
  let vendingMachine: IVendingMachine
  let config: EthereumConfig
  let artifact: { abi: any; address: string }
  const ratio = BigNumber.from("4783188631255016")
  const mockVendingMachineContract = {
    ratio: jest.fn(),
  }

  beforeEach(() => {
    config = {
      chainId: 1,
      providerOrSigner: {} as providers.Provider,
      account: "0x6B2896f915122660163e3a17f54BC244312212FD",
    }
    artifact = {
      abi: [],
      address: "0x2D8E01C35426780f2BCc859fC386eDEf61831386",
    }
    ;(getContract as jest.Mock).mockImplementation(
      () => mockVendingMachineContract
    )
    vendingMachine = new VendingMachine(config, artifact)
  })

  test("should create the vending machine instance correctly", () => {
    expect(getContract).toHaveBeenCalledWith(
      artifact.address,
      artifact.abi,
      config.providerOrSigner,
      config.account
    )
    expect(vendingMachine.contract).toEqual(mockVendingMachineContract)
  })

  describe("fetching ratio test", () => {
    beforeEach(() => {
      mockVendingMachineContract.ratio.mockResolvedValue(ratio)
    })

    test("should fetch the ratio from chain", async () => {
      const result = await vendingMachine.ratio()

      expect(mockVendingMachineContract.ratio).toHaveBeenCalled()
      expect(result).toEqual(ratio)
    })

    test("should return a cached ratio value if the ratio has already been fetched", async () => {
      const result1 = await vendingMachine.ratio()
      const result2 = await vendingMachine.ratio()

      expect(mockVendingMachineContract.ratio).toHaveBeenCalledTimes(1)
      expect(result1).toEqual(ratio)
      expect(result2).toEqual(ratio)
      expect(result1).toEqual(result2)
    })
  })

  describe("conversion to T test", () => {
    let spyOnRatio: jest.SpyInstance<Promise<BigNumber>>

    beforeEach(() => {
      spyOnRatio = jest
        .spyOn(vendingMachine, "ratio")
        .mockResolvedValueOnce(ratio)
    })

    test("should convert wrapped token amount correctly", async () => {
      const wrappedTokenAmount = "1000000000000000000" // 1
      const expectedTValue = BigNumber.from("4783188631255016000")

      const result = await vendingMachine.convertToT(wrappedTokenAmount)

      expect(spyOnRatio).toHaveBeenCalled()
      expect(result).toEqual({
        tAmount: expectedTValue,
        wrappedRemainder: ZERO,
      })
    })

    test("should convert wrapped token amount only to 3 decimals precision", async () => {
      const wrappedTokenAmount = "442210061406893004115226"
      const expectedTValue = BigNumber.from("2115174136401787131915976")
      const wrappedRemainder = BigNumber.from(wrappedTokenAmount).mod(
        vendingMachine.FLOATING_POINT_DIVISOR
      )

      const result = await vendingMachine.convertToT(wrappedTokenAmount)
      expect(spyOnRatio).toHaveBeenCalled()
      expect(result).toEqual({
        tAmount: expectedTValue,
        wrappedRemainder,
      })
    })
  })
})
