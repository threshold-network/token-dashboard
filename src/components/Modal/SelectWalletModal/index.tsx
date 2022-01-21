import { ModalCloseButton, ModalHeader } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import { MetaMaskIcon } from "../../../static/icons/MetaMask"
import { WalletConnectIcon } from "../../../static/icons/WalletConect"
import injected from "../../../web3/connectors/injected"
import InitialWalletSelection from "./InitialSelection"
import { FC, useState } from "react"
import ConnectMetamask from "./ConnectMetamask"
import withBaseModal from "../withBaseModal"
import { walletconnect } from "../../../web3/connectors/walletConnect"
import ConnectWalletConnect from "./ConnectWalletConnect"
import { WalletType } from "../../../enums"
import { H5 } from "../../Typography"
import { WalletOption } from "../../../types"

const SelectWalletModal: FC<{ closeModal: () => void }> = ({ closeModal }) => {
  const { activate, deactivate } = useWeb3React()

  const walletOptions: WalletOption[] = [
    {
      id: WalletType.Metamask,
      title: "MetaMask",
      icon: MetaMaskIcon,
      onClick: () => {
        activate(injected)
        setWalletToConnect(WalletType.Metamask)
      },
    },
    // {
    //   id: WalletType.Ledger,
    //   title: "Ledger",
    //   icon: useColorModeValue(Ledger, LedgerWhite),
    //   onClick: async () => {
    //     setWalletToConnect(WalletType.Ledger)
    //   },
    // },
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
    // {
    //   id: WalletType.Trezor,
    //   title: "Trezor",
    //   icon: useColorModeValue(Trezor, TrezorLight),
    //   onClick: () => {
    //     setWalletToConnect(WalletType.Trezor)
    //   },
    // },
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
        <H5>Connect a Wallet</H5>
      </ModalHeader>
      <ModalCloseButton />
      {walletToConnect === null && (
        <InitialWalletSelection walletOptions={walletOptions} />
      )}
      {walletToConnect === WalletType.Metamask && (
        <ConnectMetamask goBack={goBack} closeModal={closeModal} />
      )}
      {/* {walletToConnect === WalletType.Ledger && ( */}
      {/*   <ConnectLedger goBack={goBack} closeModal={closeModal} /> */}
      {/* )} */}
      {walletToConnect === WalletType.WalletConnect && (
        <ConnectWalletConnect goBack={goBack} closeModal={closeModal} />
      )}
      {/* {walletToConnect === WalletType.Trezor && ( */}
      {/*   <ConnectTrezor goBack={goBack} closeModal={closeModal} /> */}
      {/* )} */}
    </>
  )
}
export default withBaseModal(SelectWalletModal)
