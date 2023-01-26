import { useTBTCv2TokenContract } from "../web3/hooks/useTBTCv2TokenContract"

export const useTBTCTokenAddress = () => {
  const tbtcContract = useTBTCv2TokenContract()

  return tbtcContract.address
}
