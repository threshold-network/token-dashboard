import { FC, useEffect } from "react"
import { MetaMaskIcon } from "../../../static/icons/MetaMask"
import { useWeb3React } from "@web3-react/core"
import { ledgerLive } from "../../../web3/connectors"
import { WalletConnectionModalBase } from "./components"
import { ConnectionError, WalletType } from "../../../enums"
import doesErrorInclude from "../../../web3/utils/doesErrorInclude"
import { useCapture } from "../../../hooks/posthog"
import { PosthogEvent } from "../../../types/posthog"

const ConnectLedgerLive: FC<{ goBack: () => void; closeModal: () => void }> = ({
  goBack,
  closeModal,
}) => {
  const { activate, error } = useWeb3React()

  const connectionRejected = doesErrorInclude(
    error,
    ConnectionError.RejectedMetamaskConnection
  )

  const connector = ledgerLive
  const walletType = WalletType.LedgerLive
  const captureWalletConnected = useCapture(PosthogEvent.WalletConnected)

  const onError = (error: unknown) => {
    console.log("error:", error)
  }
  useEffect(() => {
    if (!connector) return

    captureWalletConnected({ walletType })
    activate(connector, onError)
    closeModal()
  }, [activate, connector, captureWalletConnected, walletType])

  return (
    <WalletConnectionModalBase
      connector={ledgerLive}
      goBack={goBack}
      closeModal={closeModal}
      WalletIcon={MetaMaskIcon}
      title="Ledger Live"
      subTitle={
        !error
          ? "The Ledger Live extension will open in an external window."
          : ""
      }
      tryAgain={connectionRejected ? () => activate(ledgerLive) : undefined}
      walletType={walletType}
    ></WalletConnectionModalBase>
  )
}

export default ConnectLedgerLive
