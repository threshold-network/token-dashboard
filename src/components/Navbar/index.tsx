import { FC, useEffect } from "react"
import { useWeb3React } from "@web3-react/core"
import { useModal } from "../../hooks/useModal"
import NavbarComponent from "./NavbarComponent"
import { ModalType } from "../../enums"
import { useSelector } from "react-redux"
import { useAppDispatch } from "../../hooks/store"
import { useEmbedFeatureFlag } from "../../hooks/useEmbedFeatureFlag"
import { RootState } from "../../store"
import { walletConnected } from "../../store/account"
import { useRequestEthereumAccount } from "../../hooks/ledger-live-app"
import { useIsActive } from "../../hooks/useIsActive"

const Navbar: FC = () => {
  const { openModal } = useModal()
  // TODO: Determinate if active and deactivate props are necessary for
  // LedgerLive app
  const { isActive, account, chainId, deactivate } = useIsActive()
  const { isEmbed } = useEmbedFeatureFlag()
  const dispatch = useAppDispatch()

  const { account: ledgerLiveAccount, requestAccount } =
    useRequestEthereumAccount()

  const openWalletModal = () => {
    if (isEmbed) {
      // TODO: Use proper currency based on chainID
      requestAccount()
    } else {
      openModal(ModalType.SelectWallet)
    }
  }

  useEffect(() => {
    if (ledgerLiveAccount) {
      dispatch(walletConnected(ledgerLiveAccount.address))
    }
  }, [ledgerLiveAccount])

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
