import { FC } from "react"
import { WalletConnectIcon } from "../../../static/icons/WalletConect"
import { useWeb3React } from "@web3-react/core"
import {
  WalletConnectionModalBase,
  WalletConnectStatusAlert,
} from "./components"
import { ConnectionError, WalletType } from "../../../enums"
import doesErrorInclude from "../../../web3/utils/doesErrorInclude"
import { walletConnect } from "../../../web3/connectors/walletConnect"

const ConnectWalletConnect: FC<{
  goBack: () => void
  closeModal: () => void
}> = ({ goBack, closeModal }) => {
  const { error, activate, active, account } = useWeb3React()

  const connectionRejected = doesErrorInclude(
    error,
    ConnectionError.RejectedMetamaskConnection
  )

  return (
    <WalletConnectionModalBase
      connector={walletConnect}
      goBack={goBack}
      closeModal={closeModal}
      WalletIcon={WalletConnectIcon}
      title="WalletConnect"
      subTitle={
        active ? "" : "Connect WalletConnect via the generated QR code."
      }
      tryAgain={() => {
        // the user has already tried to connect, so we manually reset the connector to allow the QR popup to work again
        walletConnect.provider = undefined
        activate(walletConnect)
      }}
      walletType={WalletType.WalletConnect}
      shouldForceCloseModal
    >
      <WalletConnectStatusAlert
        connectionRejected={connectionRejected}
        active={active && !!account}
      />
    </WalletConnectionModalBase>
  )
}

export default ConnectWalletConnect
