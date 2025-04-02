import { FC } from "react"
import { AccountSuccessAlert, WalletInitializeAlert } from "./index"
import WalletRejectedAlert from "./WalletRejectedAlert"
import { isSupportedNetwork } from "../../../../networks/utils"
import IncorrectNetwork from "./IncorrectNetwork"
import { useIsActive } from "../../../../hooks/useIsActive"

const WalletConnectStatusAlert: FC<{
  connectionRejected?: boolean
  active?: boolean
}> = ({ connectionRejected, active }) => {
  const { chainId } = useIsActive()
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
