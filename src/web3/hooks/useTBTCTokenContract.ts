import TBTCToken from "@keep-network/tbtc/artifacts/TBTCToken.json"
import { useErc20TokenContract } from "./useERC20"

export const useTBTCTokenContract = () => {
  // TODO get chainId from env
  return useErc20TokenContract(TBTCToken.networks["1337"].address)
}
