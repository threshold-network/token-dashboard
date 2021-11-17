import { FC } from "react"
import { WalletConnectIcon } from "../../../static/icons/WalletConect"
import { useWeb3React } from "@web3-react/core"
import { walletconnect } from "../../../web3/connectors/walletConnect"
import {
  WalletConnectionModalBase,
  WalletConnectStatusAlert,
} from "./components"
import { ConnectionError } from "../../../enums"

const ConnectWalletConnect: FC<{ goBack: () => void; closeModal: () => void }> =
  ({ goBack, closeModal }) => {
    const { error, activate, active, account } = useWeb3React()

    const connectionRejected = error?.message.includes(
      ConnectionError.rejectedConnection
    )

    return (
      <WalletConnectionModalBase
        goBack={goBack}
        closeModal={closeModal}
        WalletIcon={WalletConnectIcon}
        title="WalletConnect"
        subTitle={
          active ? "" : "Connect WalletConnect via the generated QR code."
        }
        tryAgain={() => {
          // the user has already tried to connect, so we manually reset the connector to allow the QR popup to work again
          walletconnect.walletConnectProvider = undefined
          activate(walletconnect)
        }}
      >
        <WalletConnectStatusAlert
          connectionRejected={connectionRejected}
          active={active && !!account}
        />
      </WalletConnectionModalBase>
    )
  }

export default ConnectWalletConnect
