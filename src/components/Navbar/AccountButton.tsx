import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react"
import { FC } from "react"
import { useCapture } from "../../hooks/posthog"
import { useAppDispatch } from "../../hooks/store"
import { resetStoreAction } from "../../store"
import { PosthogEvent } from "../../types/posthog"
import shortenAddress from "../../utils/shortenAddress"
import Identicon from "../Identicon"

const AccountButton: FC<{
  openWalletModal: () => void
  account?: string | null
  deactivate: () => void
}> = ({ openWalletModal, account, deactivate }) => {
  const dispatch = useAppDispatch()
  const captureWalletDisconnected = useCapture(PosthogEvent.WalletDisconnected)

  const onDisconnectClick = () => {
    captureWalletDisconnected()
    dispatch(resetStoreAction())
    deactivate()
  }

  if (account) {
    return (
      <Menu>
        <MenuButton as={Button} leftIcon={<Identicon address={account} />}>
          {shortenAddress(account)}
        </MenuButton>
        <MenuList>
          <MenuItem onClick={onDisconnectClick}>Disconnect</MenuItem>
        </MenuList>
      </Menu>
    )
  }

  return <Button onClick={openWalletModal}>Connect Wallet</Button>
}

export default AccountButton
