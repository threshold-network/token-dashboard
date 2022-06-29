export interface RewardsJSONData {
  tokenTotal: string
  merkleRoot: string
  claims: { [beneficiary: string]: { amount: string; proof: string[] } }
}
