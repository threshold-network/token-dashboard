import { FC } from "react"
import { useWeb3React } from "@web3-react/core"
import { useModal } from "../../hooks/useModal"
import NavbarComponent from "./NavbarComponent"
import { ModalType } from "../../enums"

const Navbar: FC = () => {
  const { openModal } = useModal()
  const { account, active, chainId, deactivate } = useWeb3React()
  const openWalletModal = () => openModal(ModalType.SelectWallet)

  return (
    <NavbarComponent
      {...{
        active,
        account,
        chainId,
        openWalletModal,
        deactivate,
      }}
    />
  )
}

export default Navbar
