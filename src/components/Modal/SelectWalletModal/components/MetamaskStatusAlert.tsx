import { FC } from "react"
import { useWeb3React } from "@web3-react/core"
import {
  AccountSuccessAlert,
  MetamaskNotInstalledAlert,
  WalletInitializeAlert,
  WalletRejectedAlert,
} from "."

const MetamaskStatusAlert: FC<{
  metamaskNotInstalled?: boolean
  connectionRejected?: boolean
  active?: boolean
}> = ({ metamaskNotInstalled, connectionRejected }) => {
  const { active } = useWeb3React()
  if (metamaskNotInstalled) {
    return <MetamaskNotInstalledAlert />
  }
  if (connectionRejected) {
    return <WalletRejectedAlert />
  }
  if (active) {
    return <AccountSuccessAlert message="Your MetaMask wallet is connected" />
  }
  return <WalletInitializeAlert />
}

export default MetamaskStatusAlert
