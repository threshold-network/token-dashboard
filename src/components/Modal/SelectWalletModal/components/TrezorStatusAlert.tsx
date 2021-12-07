import { FC } from "react"
import { useWeb3React } from "@web3-react/core"
import {
  AccountSuccessAlert,
  WalletInitializeAlert,
  WalletRejectedAlert,
} from "."

const TrezorStatusAlert: FC<{
  connectionRejected?: boolean
  active?: boolean
}> = ({ connectionRejected }) => {
  const { active } = useWeb3React()
  if (connectionRejected) {
    return <WalletRejectedAlert />
  }
  if (active) {
    return <AccountSuccessAlert message="Your Trezor wallet is connected" />
  }
  return <WalletInitializeAlert />
}

export default TrezorStatusAlert
