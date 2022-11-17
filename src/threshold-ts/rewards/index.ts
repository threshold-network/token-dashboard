import { ContractTransaction } from "ethers"
import { IPRE } from "../applications/pre"
import { IStaking } from "../staking"
import { EthereumConfig } from "../types"
import {
  InterimStakingRewards,
  Rewards as InterimStakingRewardsType,
} from "./interim"
import { MerkleDropContract } from "./merkle-drop-contract"
import {
  StakingBonusRewards,
  Rewards as StakingBonusRewardsType,
} from "./staking-bonus"

export interface IRewards<RewardsDataType> {
  calculateRewards: (
    stakingProviders: string[]
  ) => Promise<{ [stakingProvider: string]: RewardsDataType }>

  claim?: (stakingProviders: string[]) => Promise<ContractTransaction>
}

export class Rewards {
  public readonly merkleDropContract: MerkleDropContract
  public readonly stakingBonus: IRewards<StakingBonusRewardsType>
  public readonly interim: IRewards<InterimStakingRewardsType>

  constructor(config: EthereumConfig, staking: IStaking, pre: IPRE) {
    this.merkleDropContract = new MerkleDropContract(config)
    this.stakingBonus = new StakingBonusRewards(
      this.merkleDropContract,
      staking,
      pre
    )
    this.interim = new InterimStakingRewards(this.merkleDropContract)
  }
}
