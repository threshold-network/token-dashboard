import { FC } from "react"
import { AccountSuccessAlert, WalletInitializeAlert } from "./index"
import WalletRejectedAlert from "./WalletRejectedAlert"
import isSupportedNetwork from "../../../../utils/isSupportedNetwork"
import { useWeb3React } from "@web3-react/core"
import IncorrectNetwork from "./IncorrectNetwork"

const WalletConnectStatusAlert: FC<{
  connectionRejected?: boolean
  active?: boolean
}> = ({ connectionRejected, active }) => {
  const { chainId } = useWeb3React()
  const networkOK = isSupportedNetwork(chainId)

  if (connectionRejected) {
    return <WalletRejectedAlert />
  }

  if (active && !networkOK) {
    return <IncorrectNetwork />
  }

  if (active) {
    return (
      <AccountSuccessAlert message="Your Walletconnect wallet is connected" />
    )
  }

  return <WalletInitializeAlert />
}

export default WalletConnectStatusAlert
