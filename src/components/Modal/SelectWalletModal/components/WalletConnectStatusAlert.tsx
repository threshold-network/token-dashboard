import { FC } from "react"
import { AccountSuccessAlert, WalletInitializeAlert } from "./index"
import WalletRejectedAlert from "./WalletRejectedAlert"

const WalletConnectStatusAlert: FC<{
  connectionRejected?: boolean
  active?: boolean
}> = ({ connectionRejected, active }) => {
  if (connectionRejected) {
    return <WalletRejectedAlert />
  }

  if (active) {
    return (
      <AccountSuccessAlert message="Your Walletconnect wallet is connected" />
    )
  }

  return <WalletInitializeAlert />
}

export default WalletConnectStatusAlert
