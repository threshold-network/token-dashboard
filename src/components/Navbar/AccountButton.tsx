import {
  Button,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react"
import { FC } from "react"
import { useCapture } from "../../hooks/posthog"
import { useAppDispatch } from "../../hooks/store"
import { resetStoreAction } from "../../store"
import { PosthogEvent } from "../../types/posthog"
import shortenAddress from "../../utils/shortenAddress"
import Identicon from "../Identicon"
import { useNonEVMConnection } from "../../hooks/useNonEVMConnection"

const AccountButton: FC<{
  openWalletModal: () => void
  account?: string | null
  deactivate: () => void
}> = ({ openWalletModal, account, deactivate }) => {
  const { nonEVMPublicKey, connectedWalletIcon, disconnectNonEVM } =
    useNonEVMConnection()
  const dispatch = useAppDispatch()
  const captureWalletDisconnectedEvent = useCapture(
    PosthogEvent.WalletDisconnected
  )

  const onDisconnectClick = () => {
    captureWalletDisconnectedEvent()
    dispatch(resetStoreAction())
    deactivate()
    disconnectNonEVM()
  }

  if (account || nonEVMPublicKey) {
    return (
      <Menu>
        <MenuButton
          as={Button}
          leftIcon={
            nonEVMPublicKey ? (
              <Image
                src={connectedWalletIcon}
                alt="wallet icon"
                boxSize="22px"
              />
            ) : account ? (
              <Identicon address={account} />
            ) : undefined
          }
        >
          {shortenAddress(nonEVMPublicKey || account)}
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
