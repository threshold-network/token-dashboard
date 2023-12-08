import { FC, useEffect } from "react"
import { useModal } from "../../hooks/useModal"
import NavbarComponent from "./NavbarComponent"
import { ModalType } from "../../enums"
import { useAppDispatch } from "../../hooks/store"
import { useIsEmbed } from "../../hooks/useIsEmbed"
import { walletConnected } from "../../store/account"
import { useRequestEthereumAccount } from "../../hooks/ledger-live-app"
import { useIsActive } from "../../hooks/useIsActive"

const Navbar: FC = () => {
  const { openModal } = useModal()
  const { isActive, account, chainId, deactivate } = useIsActive()
  const { isEmbed } = useIsEmbed()
  const dispatch = useAppDispatch()

  const { account: ledgerLiveAccount, requestAccount } =
    useRequestEthereumAccount()
  const ledgerLiveAccountAddress = ledgerLiveAccount?.address

  const openWalletModal = () => {
    if (isEmbed) {
      requestAccount()
    } else {
      openModal(ModalType.SelectWallet)
    }
  }

  useEffect(() => {
    if (ledgerLiveAccountAddress) {
      dispatch(walletConnected(ledgerLiveAccountAddress || ""))
    }
  }, [ledgerLiveAccountAddress])

  return (
    <NavbarComponent
      {...{
        active: isActive,
        account,
        chainId,
        openWalletModal,
        deactivate,
      }}
    />
  )
}

export default Navbar
