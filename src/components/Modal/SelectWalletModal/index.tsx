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

export enum WalletOption {
  metamask = "METAMASK",
  ledger = "LEDGER",
  walletConnect = "WALLET_CONNECT",
}

const SelectWalletModal: FC<{ closeModal: () => void }> = ({ closeModal }) => {
  const { activate, deactivate } = useWeb3React()

  const walletOptions = [
    {
      id: WalletOption.metamask,
      title: "MetaMask",
      icon: MetaMaskIcon,
      onClick: () => {
        activate(injected)
        setWalletToConnect(WalletOption.metamask)
      },
    },
    {
      id: WalletOption.ledger,
      title: "Ledger",
      icon: useColorModeValue(Ledger, LedgerWhite),
      onClick: () => {
        activate(injected)
        setWalletToConnect(WalletOption.ledger)
      },
    },
    {
      id: WalletOption.walletConnect,
      title: "WalletConnect",
      icon: WalletConnectIcon,
      onClick: () => {
        activate(injected)
        setWalletToConnect(WalletOption.walletConnect)
      },
    },
  ]

  const [walletToConnect, setWalletToConnect] = useState<WalletOption | null>(
    null
  )

  const goBack = () => {
    deactivate()
    setWalletToConnect(null)
  }

  return (
    <>
      <ModalHeader>
        <Text fontSize="24px">Connect a Wallet</Text>
      </ModalHeader>
      <ModalCloseButton />
      {walletToConnect === null && (
        <InitialWalletSelection walletOptions={walletOptions} />
      )}
      {walletToConnect === WalletOption.metamask && (
        <ConnectMetamask goBack={goBack} closeModal={closeModal} />
      )}
    </>
  )
}
export default withBaseModal(SelectWalletModal)
