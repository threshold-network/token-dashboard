import { BigNumber, constants } from "ethers"
import { Stake } from "../staking"

export const MAX_UINT64 = BigNumber.from("18446744073709551615") // 2^64 - 1
export const ZERO = constants.Zero
export const ADRESS_ZERO = constants.AddressZero
export const L2_RELAYER_BOT_WALLET =
  "0x45332EEE9b495b1dda896FD53112eaaCC10b2c19"

export const STANDARD_ERC20_DECIMALS = 18

export const EMPTY_STAKE: Stake = {
  owner: ADRESS_ZERO,
  authorizer: ADRESS_ZERO,
  beneficiary: ADRESS_ZERO,
  stakingProvider: ADRESS_ZERO,
  tStake: ZERO,
  keepInTStake: ZERO,
  nuInTStake: ZERO,
  totalInTStake: ZERO,
  possibleKeepTopUpInT: ZERO,
  possibleNuTopUpInT: ZERO,
}
