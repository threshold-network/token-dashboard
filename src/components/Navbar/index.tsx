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

const Navbar: FC = () => {
  const { openModal } = useModal()
  // TODO: Determinate if active and deactivate props are necessary for
  // LedgerLive app
  const { active, chainId: web3ReactChainId, deactivate } = useWeb3React()
  const { isEmbed } = useEmbedFeatureFlag()
  const dispatch = useAppDispatch()
  const { address } = useSelector((state: RootState) => state.account)

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

  const account = address
  // TODO: Use proper chainId here for ledger live app
  const chainId = isEmbed ? 5 : web3ReactChainId

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
