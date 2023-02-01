import { FC } from "react"
import { MetaMaskIcon } from "../../../static/icons/MetaMask"
import { useWeb3React } from "@web3-react/core"
import { injectedConnector as metaMaskConnector } from "../../../web3/connectors"
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

  return (
    <WalletConnectionModalBase
      connector={metaMaskConnector}
      goBack={goBack}
      closeModal={closeModal}
      WalletIcon={MetaMaskIcon}
      title="MetaMask"
      subTitle={
        metamaskNotInstalled
          ? ""
          : "The MetaMask extension will open in an external window."
      }
      tryAgain={
        connectionRejected ? () => activate(metaMaskConnector) : undefined
      }
    >
      <MetamaskStatusAlert
        metamaskNotInstalled={metamaskNotInstalled}
        connectionRejected={connectionRejected}
      />
    </WalletConnectionModalBase>
  )
}

export default ConnectMetamask
