import { BigNumber } from "ethers"
import { RewardsJSONData } from "../interim"
import { StakingBonusRewards } from "../staking-bonus"

const stakingProvider = "0xd6560ED093f8427fAEf6FeBe8e188c5D0adeEb19"
const stakingProvider2 = "0x15aFd6D5D020dc386e7021B83970edB934C19b3C"
export const stakingProvider3 = "0x76F30EcF7627036A6347982E9D77DDFfAcae16a3"
export const stakingProvider4 = "0x0a05bDE28BcA51Cb3F9eDB0cd01777d4c5aB29a5"

export const stakingProviders = [stakingProvider, stakingProvider2]

export const merkleData: RewardsJSONData = {
  totalAmount: "1000000000000000000000",
  merkleRoot: "0x123",
  claims: {
    [stakingProvider]: {
      amount: "300000000000000000000",
      proof: ["0x1", "0x2"],
      beneficiary: "0xfA6a07755d1ef81E4B94C905d1447C858caFe68D",
    },
    [stakingProvider2]: {
      amount: "300000000000000000000",
      proof: ["0x3", "0x4"],
      beneficiary: "0xC920C73ff72b5c093221634bBBf8cd6Db2fa54ed",
    },
    [stakingProvider3]: {
      amount: "400000000000000000000",
      proof: ["0x5", "0x6"],
      beneficiary: "0xA9b9171D61FB2aA779716A3257e6A26A6fAcb325",
    },
  },
}

export const claimedEvents = [
  {
    args: {
      stakingProvider,
      amount: "300000000000000000000",
      merkleRoot: merkleData.merkleRoot,
    },
  },
  {
    args: {
      stakingProvider: stakingProvider2,
      amount: "200000000000000000000",
      merkleRoot: "0x456",
    },
  },
]

// STAKING BONUS

const createEligibleStakingProvider = (
  eligibleStakingProviderAddress: string
) => ({
  address: eligibleStakingProviderAddress,
  stakedEvent: {
    args: {
      stakingProvider: eligibleStakingProviderAddress,
      amount: BigNumber.from("200"),
    },
    blockNumber: StakingBonusRewards.BONUS_DEADLINE_BLOCK_NUMBER - 1,
    transactionHash: "0x1",
  },
  operatorConfirmedEvent: {
    args: {
      stakingProvider: eligibleStakingProviderAddress,
      operator: "0x07590F466B42238Db86DaEd24de2BDcd0897E4bb",
    },
    blockNumber: StakingBonusRewards.BONUS_DEADLINE_BLOCK_NUMBER,
    transactionHash: "0x2",
  },
  toppedUpEvents: [
    {
      args: {
        amount: BigNumber.from("100"),
        stakingProvider: eligibleStakingProviderAddress,
      },
      blockNumber: StakingBonusRewards.BONUS_DEADLINE_BLOCK_NUMBER - 1,
    },
    {
      args: {
        amount: BigNumber.from("100"),
        stakingProvider: eligibleStakingProviderAddress,
      },
      blockNumber: StakingBonusRewards.BONUS_DEADLINE_BLOCK_NUMBER,
    },
    {
      args: {
        amount: BigNumber.from("100"),
        stakingProvider: eligibleStakingProviderAddress,
      },
      blockNumber: StakingBonusRewards.BONUS_DEADLINE_BLOCK_NUMBER + 1,
    },
    {
      args: {
        amount: BigNumber.from("100"),
        stakingProvider: eligibleStakingProviderAddress,
      },
      blockNumber: StakingBonusRewards.BONUS_DEADLINE_BLOCK_NUMBER + 2,
    },
  ],
  unstakedEvents: [
    {
      args: {
        amount: BigNumber.from("100"),
        stakingProvider: eligibleStakingProviderAddress,
      },
      blockNumber: StakingBonusRewards.BONUS_DEADLINE_BLOCK_NUMBER - 1,
    },
  ],
  claimedEvents: [],
})

const eligibleStakingProvider = createEligibleStakingProvider(
  "0xd2b2b82b7d153c0d1d9b15a3edb43e9ea338f92d"
)

const eligibleStakingProviderAndClaimedRewards = {
  ...createEligibleStakingProvider(
    "0x54b101b2fcc5d8492756AD3C262E865e8D18Bfb6"
  ),
  claimedEvents: [
    { args: { stakingProvider: "0x54b101b2fcc5d8492756AD3C262E865e8D18Bfb6" } },
  ],
}

const stakingProviderWithUnstakedEvent = {
  ...createEligibleStakingProvider(
    "0x5796E9f416733AC4FDBe85A92633A0F8189e7782"
  ),
  unstakedEvents: [
    {
      args: {
        amount: BigNumber.from("100"),
        stakingProvider: "0x5796E9f416733AC4FDBe85A92633A0F8189e7782",
      },
      blockNumber: StakingBonusRewards.BONUS_DEADLINE_BLOCK_NUMBER + 1,
    },
  ],
}

const stakinngProviderWithStakedEventAfterDeadline = {
  ...createEligibleStakingProvider(
    "0x5E1eA83C07599c4e78ef541Ee93c321C3424D0C0"
  ),
  stakedEvent: {
    args: {
      stakingProvider: "0x5E1eA83C07599c4e78ef541Ee93c321C3424D0C0",
      amount: BigNumber.from("200"),
    },
    blockNumber: StakingBonusRewards.BONUS_DEADLINE_BLOCK_NUMBER + 1,
    transactionHash: "0x1",
  },
}

const stakingProvidetWithoutPRENode = {
  ...createEligibleStakingProvider(
    "0x85EC6578Da29f867416Ca118B5746e61165b3dF2"
  ),
  operatorConfirmedEvent: {
    args: {
      stakingProvider: "0x85ec6578da29f867416ca118b5746e61165b3df2",
      operator: "0x07590F466B42238Db86DaEd24de2BDcd0897E4bb",
    },
    blockNumber: StakingBonusRewards.BONUS_DEADLINE_BLOCK_NUMBER + 1,
    transactionHash: "0x2",
  },
}

export const stakingBonus = {
  providersData: {
    //All requirements are met. Rewards not yet claimed.
    eligibleStakingProvider,
    //All requirements are met but rewards have been already claimed.
    eligibleStakingProviderAndClaimedRewards,
    stakingProviderWithUnstakedEvent,
    stakinngProviderWithStakedEventAfterDeadline,
    stakingProvidetWithoutPRENode,
  },
  stakingProviders: [
    eligibleStakingProvider.address,
    eligibleStakingProviderAndClaimedRewards.address,
    stakingProviderWithUnstakedEvent.address,
    stakinngProviderWithStakedEventAfterDeadline.address,
    stakingProvidetWithoutPRENode.address,
  ],
  calimedEvents: [
    ...eligibleStakingProvider.claimedEvents,
    ...eligibleStakingProviderAndClaimedRewards.claimedEvents,
    ...stakingProviderWithUnstakedEvent.claimedEvents,
    ...stakinngProviderWithStakedEventAfterDeadline.claimedEvents,
    ...stakingProvidetWithoutPRENode.claimedEvents,
  ],
  stakedEvents: [
    eligibleStakingProvider.stakedEvent,
    eligibleStakingProviderAndClaimedRewards.stakedEvent,
    stakingProviderWithUnstakedEvent.stakedEvent,
    stakinngProviderWithStakedEventAfterDeadline.stakedEvent,
    stakingProvidetWithoutPRENode.stakedEvent,
  ],
  toppedUpEvents: [
    ...eligibleStakingProvider.toppedUpEvents,
    ...eligibleStakingProviderAndClaimedRewards.toppedUpEvents,
    ...stakingProviderWithUnstakedEvent.toppedUpEvents,
    ...stakinngProviderWithStakedEventAfterDeadline.toppedUpEvents,
    ...stakingProvidetWithoutPRENode.toppedUpEvents,
  ].sort((a, b) => a.blockNumber - b.blockNumber),
  unstakedEvents: [
    ...eligibleStakingProvider.unstakedEvents,
    ...eligibleStakingProviderAndClaimedRewards.unstakedEvents,
    ...stakingProviderWithUnstakedEvent.unstakedEvents,
    ...stakinngProviderWithStakedEventAfterDeadline.unstakedEvents,
    ...stakingProvidetWithoutPRENode.unstakedEvents,
  ].sort((a, b) => a.blockNumber - b.blockNumber),
  operatorConfirmedEvents: [
    eligibleStakingProvider.operatorConfirmedEvent,
    eligibleStakingProviderAndClaimedRewards.operatorConfirmedEvent,
    stakingProviderWithUnstakedEvent.operatorConfirmedEvent,
    stakinngProviderWithStakedEventAfterDeadline.operatorConfirmedEvent,
    stakingProvidetWithoutPRENode.operatorConfirmedEvent,
  ],
}
