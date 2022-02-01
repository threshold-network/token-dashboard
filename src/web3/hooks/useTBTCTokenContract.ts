import TBTCToken from "@keep-network/tbtc/artifacts/TBTCToken.json"
import { useErc20TokenContract } from "./useERC20"
import { supportedChainId } from "../../utils/getEnvVariable"

export const useTBTCTokenContract = () => {
  return useErc20TokenContract(
    TBTCToken.networks[supportedChainId as keyof typeof TBTCToken.networks]
      ?.address
  )
}
