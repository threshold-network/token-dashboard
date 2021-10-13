import { FC } from "react"
import { MetaMaskIcon } from "../../../static/icons/MetaMask"
import { useWeb3React } from "@web3-react/core"
import injected from "../../../web3/connectors/injected"
import { MetamaskStatusAlert, WalletConnectionModalBase } from "./components"
import { ConnectionError } from "../../../enums"

const ConnectMetamask: FC<{ goBack: () => void; closeModal: () => void }> = ({
  goBack,
  closeModal,
}) => {
  const { activate, active, account, error } = useWeb3React()

  const metamaskNotInstalled = error?.message.includes(
    ConnectionError.metamaskNotInstalled
  )

  const connectionRejected = error?.message.includes(
    ConnectionError.rejectedConnection
  )

  return (
    <WalletConnectionModalBase
      goBack={goBack}
      closeModal={closeModal}
      WalletIcon={MetaMaskIcon}
      title="MetaMask"
      subTitle={
        metamaskNotInstalled
          ? ""
          : "The MetaMask extension will open in an external window."
      }
      tryAgain={() => activate(injected)}
    >
      <MetamaskStatusAlert
        metamaskNotInstalled={metamaskNotInstalled}
        connectionRejected={connectionRejected}
        active={active && !!account}
      />
    </WalletConnectionModalBase>
  )
}

export default ConnectMetamask
