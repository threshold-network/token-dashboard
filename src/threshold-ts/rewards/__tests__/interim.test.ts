import { BigNumber, ContractTransaction } from "ethers"
import { InterimStakingRewards } from "../interim"
import { MerkleDropContract } from "../merkle-drop-contract"
import {
  merkleData,
  stakingProviders,
  claimedEvents,
  stakingProvider3,
  stakingProvider4,
} from "../__mocks__/data"
import rewards from "../interim/rewards.json"
import { getAddress, getContractPastEvents } from "../../utils"

jest.mock(
  "../interim/rewards.json",
  () => {
    const { merkleData } = require("../__mocks__/data")

    return merkleData
  },
  { virtual: true }
)

jest.mock("../../utils", () => ({
  ...(jest.requireActual("../../utils") as {}),
  getContractPastEvents: jest.fn(),
  getAddress: jest.fn(),
}))

describe("Interim staking rewards test", () => {
  let interimStakingRewards: InterimStakingRewards
  let merkleDropContract: MerkleDropContract

  beforeEach(() => {
    merkleDropContract = {
      address: "0xBB7aD35819C11E37115FADEBb12524669182fB0D",
      deploymentBlock: 123,
      instance: {
        batchClaim: jest.fn(),
      },
    } as unknown as MerkleDropContract

    interimStakingRewards = new InterimStakingRewards(merkleDropContract)
  })

  test("should create an instance correctly", () => {
    expect(interimStakingRewards.calculateRewards).toBeDefined()
    expect(interimStakingRewards.claim).toBeDefined()
  })

  describe("calculating rewards test", () => {
    beforeEach(async () => {
      ;(getContractPastEvents as jest.Mock).mockResolvedValue(claimedEvents)
      ;(getAddress as jest.Mock).mockImplementation((address) => address)
    })

    test("should calculate rewards correctly", async () => {
      const stkaingProvidersToCheck = [
        ...stakingProviders,
        stakingProvider3,
        stakingProvider4,
      ]
      const result = await interimStakingRewards.calculateRewards(
        stkaingProvidersToCheck
      )

      expect(getContractPastEvents).toHaveBeenCalledWith(
        merkleDropContract.instance,
        {
          eventName: "Claimed",
          fromBlock: merkleDropContract.deploymentBlock,
          filterParams: [stkaingProvidersToCheck],
        }
      )

      expect(getAddress).toHaveBeenNthCalledWith(
        1,
        claimedEvents[0].args.stakingProvider
      )
      expect(getAddress).toHaveBeenNthCalledWith(
        2,
        claimedEvents[1].args.stakingProvider
      )

      // To filter out the claimed events in the current merkle root hash.
      expect(getAddress).toHaveBeenNthCalledWith(
        3,
        claimedEvents[0].args.stakingProvider
      )
      expect(result).toEqual({
        [stkaingProvidersToCheck[1]]: BigNumber.from(
          merkleData.claims[stkaingProvidersToCheck[1]].amount
        )
          .sub(claimedEvents[1].args.amount)
          .toString(),
        [stkaingProvidersToCheck[2]]:
          merkleData.claims[stkaingProvidersToCheck[2]].amount,
      })
    })
  })

  describe("claiming test", () => {
    let spyOnClaim: jest.SpyInstance<Promise<ContractTransaction>>

    beforeEach(() => {
      spyOnClaim = jest.spyOn(merkleDropContract.instance, "batchClaim")
    })

    test("should throw an error if the staking providers are not passed", () => {
      expect(() => {
        interimStakingRewards.claim([])
      }).toThrowError("Staking providers not found.")
      expect(spyOnClaim).not.toHaveBeenCalled()
    })

    test("should throw an error if rewards don't exist for staking providers", () => {
      expect(() => {
        interimStakingRewards.claim([
          "0xd37e1c8ef90898bcf5acac025768f0fef67dbd74",
        ])
      }).toThrowError("No rewards to claim.")
      expect(spyOnClaim).not.toHaveBeenCalled()
    })

    test("should calim rewards correctly", async () => {
      const mockedResult = {} as ContractTransaction
      spyOnClaim.mockResolvedValue(mockedResult)
      const rewardToClaim = merkleData.claims[stakingProviders[0]]
      const rewardToClaim2 = merkleData.claims[stakingProviders[1]]

      const rewardsToClaim = [
        [
          stakingProviders[0],
          rewardToClaim.beneficiary,
          rewardToClaim.amount,
          rewardToClaim.proof,
        ],
        [
          stakingProviders[1],
          rewardToClaim2.beneficiary,
          rewardToClaim2.amount,
          rewardToClaim2.proof,
        ],
      ]

      const result = await interimStakingRewards.claim(stakingProviders)
      expect(spyOnClaim).toHaveBeenCalledWith(
        rewards.merkleRoot,
        rewardsToClaim
      )
      expect(result).toEqual(mockedResult)
    })
  })
})
