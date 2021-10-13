import {
  ModalCloseButton,
  ModalHeader,
  Text,
  useColorModeValue,
} from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import { Ledger } from "../../../static/icons/Ledger"
import { MetaMaskIcon } from "../../../static/icons/MetaMask"
import { WalletConnectIcon } from "../../../static/icons/WalletConect"
import injected from "../../../web3/connectors/injected"
import InitialWalletSelection from "./InitialSelection"
import { FC, useState } from "react"
import ConnectMetamask from "./ConnectMetamask"
import withBaseModal from "../withBaseModal"
import { LedgerWhite } from "../../../static/icons/LedgerWhite"
import ConnectLedger from "./ConnectLedger"
import { walletconnect } from "../../../web3/connectors/walletConnect"
import ConnectWalletConnect from "./ConnectWalletConnect"
import { WalletType } from "../../../enums"

const SelectWalletModal: FC<{ closeModal: () => void }> = ({ closeModal }) => {
  const { activate, deactivate } = useWeb3React()

  const walletOptions = [
    {
      id: WalletType.Metamask,
      title: "MetaMask",
      icon: MetaMaskIcon,
      onClick: () => {
        activate(injected)
        setWalletToConnect(WalletType.Metamask)
      },
    },
    {
      id: WalletType.Ledger,
      title: "Ledger",
      icon: useColorModeValue(Ledger, LedgerWhite),
      onClick: async () => {
        // await ledgerLiveConnector.activate()
        // const accounts = await ledgerLiveConnector.getAccounts()
        // activate(ledgerLiveConnector)
        setWalletToConnect(WalletType.Ledger)
      },
    },
    {
      id: WalletType.WalletConnect,
      title: "WalletConnect",
      icon: WalletConnectIcon,
      onClick: () => {
        // if the user has already tried to connect we need to manually reset the connector to allow the QR popup to work again
        walletconnect.walletConnectProvider = undefined
        activate(walletconnect)
        setWalletToConnect(WalletType.WalletConnect)
      },
    },
  ]

  const [walletToConnect, setWalletToConnect] = useState<WalletType | null>(
    null
  )

  const goBack = () => {
    deactivate()
    setWalletToConnect(null)
  }

  return (
    <>
      <ModalHeader>
        <Text as="h5" fontSize="2xl">
          Connect a Wallet
        </Text>
      </ModalHeader>
      <ModalCloseButton />
      {walletToConnect === null && (
        <InitialWalletSelection walletOptions={walletOptions} />
      )}
      {walletToConnect === WalletType.Metamask && (
        <ConnectMetamask goBack={goBack} closeModal={closeModal} />
      )}
      {walletToConnect === WalletType.Ledger && (
        <ConnectLedger goBack={goBack} closeModal={closeModal} />
      )}
      {walletToConnect === WalletType.WalletConnect && (
        <ConnectWalletConnect goBack={goBack} closeModal={closeModal} />
      )}
    </>
  )
}
export default withBaseModal(SelectWalletModal)
