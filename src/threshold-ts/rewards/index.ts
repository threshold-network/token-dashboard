export interface IRewards<RewardsDataType> {
  calculateRewards: (
    stakingProviders: string[]
  ) => Promise<{ [stakingProvider: string]: RewardsDataType }>
}
