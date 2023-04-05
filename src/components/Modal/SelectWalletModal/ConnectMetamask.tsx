import { FC } from "react"
import { MetaMaskIcon } from "../../../static/icons/MetaMask"
import { useWeb3React } from "@web3-react/core"
import {
  InjectedProviderIsNotMetaMaskError,
  metamask,
} from "../../../web3/connectors"
import { MetamaskStatusAlert, WalletConnectionModalBase } from "./components"
import { ConnectionError } from "../../../enums"
import doesErrorInclude from "../../../web3/utils/doesErrorInclude"

const ConnectMetamask: FC<{ goBack: () => void; closeModal: () => void }> = ({
  goBack,
  closeModal,
}) => {
  const { activate, error } = useWeb3React()

  const metamaskNotInstalled = doesErrorInclude(
    error,
    ConnectionError.MetamaskNotInstalled
  )

  const connectionRejected = doesErrorInclude(
    error,
    ConnectionError.RejectedMetamaskConnection
  )

  const isMetaMask = !(error instanceof InjectedProviderIsNotMetaMaskError)

  return (
    <WalletConnectionModalBase
      connector={metamask}
      goBack={goBack}
      closeModal={closeModal}
      WalletIcon={MetaMaskIcon}
      title="MetaMask"
      subTitle={
        !error ? "The MetaMask extension will open in an external window." : ""
      }
      tryAgain={connectionRejected ? () => activate(metamask) : undefined}
    >
      <MetamaskStatusAlert
        metamaskNotInstalled={metamaskNotInstalled}
        isMetaMask={isMetaMask}
        connectionRejected={connectionRejected}
      />
    </WalletConnectionModalBase>
  )
}

export default ConnectMetamask
