import { RewardsJSONData } from "../interim"

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
