import TBTCToken from "@keep-network/tbtc/artifacts/TBTCToken.json"
import { useErc20TokenContract } from "./useERC20"
import { getContractAddressFromTruffleArtifact } from "../../utils/getContract"

export const useTBTCTokenContract = () => {
  return useErc20TokenContract(getContractAddressFromTruffleArtifact(TBTCToken))
}
