import { useErc20TokenContract } from "./useERC20"
import { Token, TransactionType } from "../../enums"
import { useContext } from "react"
import { FeatureFlagsContext } from "../../contexts/FeatureFlagContext"
import { FeatureFlag } from "../../feature-flags/featureFlags"
import TBTC from "@keep-network/tbtc-v2/artifacts/TBTC.json"

export const useTBTCv2TokenContract: any = () => {
  const featureFlagsContext = useContext(FeatureFlagsContext)
  if (featureFlagsContext[FeatureFlag.TBTCV2].isActive) {
    const { balanceOf, approve, contract } = useErc20TokenContract(
      TBTC.address,
      undefined,
      TBTC.abi
    )

    // TODO:
    const approveTBTCV2 = () => {}

    const fetchTBTCV2Balance = () => {
      balanceOf(Token.TBTCV2)
    }

    return {
      fetchTBTCV2Balance,
      approveTBTCV2,
      contract,
    }
  }

  return undefined
}
