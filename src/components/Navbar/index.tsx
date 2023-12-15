import { FC, useEffect } from "react"
import NavbarComponent from "./NavbarComponent"
import { useAppDispatch } from "../../hooks/store"
import { walletConnected } from "../../store/account"
import { useRequestEthereumAccount } from "../../hooks/ledger-live-app"
import { useIsActive } from "../../hooks/useIsActive"
import { useConnectWallet } from "../../hooks/useConnectWallet"
import { useIsEmbed } from "../../hooks/useIsEmbed"

const Navbar: FC = () => {
  const { isActive, account, chainId, deactivate } = useIsActive()
  const dispatch = useAppDispatch()
  const connectWallet = useConnectWallet()
  const { isEmbed } = useIsEmbed()

  const { account: ledgerLiveAccount, requestAccount } =
    useRequestEthereumAccount()
  const ledgerLiveAccountAddress = ledgerLiveAccount?.address

  const openWalletModal = () => {
    connectWallet()
  }

  useEffect(() => {
    if (ledgerLiveAccountAddress && isEmbed) {
      dispatch(walletConnected(ledgerLiveAccountAddress))
    }
  }, [ledgerLiveAccountAddress, dispatch, isEmbed])

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
