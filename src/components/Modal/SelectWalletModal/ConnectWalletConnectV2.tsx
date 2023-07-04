import { FC } from "react"
import { WalletConnectIcon } from "../../../static/icons/WalletConect"
import { useWeb3React } from "@web3-react/core"
import {
  WalletConnectionModalBase,
  WalletConnectStatusAlert,
} from "./components"
import { ConnectionError, WalletType } from "../../../enums"
import doesErrorInclude from "../../../web3/utils/doesErrorInclude"
import { WalletConnectConnectorV2 } from "../../../web3/connectors/walletConnectV2"

const ConnectWalletConnectV2: FC<{
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
      connector={WalletConnectConnectorV2}
      goBack={goBack}
      closeModal={closeModal}
      WalletIcon={WalletConnectIcon}
      title="WalletConnect"
      subTitle={
        active ? "" : "Connect WalletConnect via the generated QR code."
      }
      tryAgain={() => {
        // the user has already tried to connect, so we manually reset the connector to allow the QR popup to work again
        WalletConnectConnectorV2.provider = undefined
        activate(WalletConnectConnectorV2)
      }}
      walletType={WalletType.WalletConnectV2}
    >
      <WalletConnectStatusAlert
        connectionRejected={connectionRejected}
        active={active && !!account}
      />
    </WalletConnectionModalBase>
  )
}

export default ConnectWalletConnectV2
