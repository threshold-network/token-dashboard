import {
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react"
import { useModal } from "../../../store/modal"
import { LedgerIcon } from "../../../static/icons/LedgerIcon"
import { MetaMaskIcon } from "../../../static/icons/MetaMask"
import { WalletConnectIcon } from "../../../static/icons/WalletConect"
import { useWeb3React } from "@web3-react/core"
import injected from "../../../web3/connectors/injected"
import InitialWalletSelection from "./InitialSelection"
import { useState } from "react"
import ConnectMetamask from "./ConnectMetamask"

export enum WalletOption {
  metamask = "METAMASK",
  ledger = "LEDGER",
  walletConnect = "WALLET_CONNECT",
}

const SelectWalletModal = () => {
  const { closeModal } = useModal()
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
      icon: LedgerIcon,
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
    <Modal isOpen onClose={closeModal} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Text fontSize="24px">Connect a Wallet</Text>
        </ModalHeader>
        <ModalCloseButton />
        {walletToConnect === null && (
          <InitialWalletSelection walletOptions={walletOptions} />
        )}
        {walletToConnect === WalletOption.metamask && (
          <ConnectMetamask goBack={goBack} />
        )}
      </ModalContent>
    </Modal>
  )
}
export default SelectWalletModal
