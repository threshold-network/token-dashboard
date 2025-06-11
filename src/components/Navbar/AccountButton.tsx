import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  HStack,
  Text,
} from "@chakra-ui/react"
import { FC } from "react"
import { useCapture } from "../../hooks/posthog"
import { useAppDispatch } from "../../hooks/store"
import { resetStoreAction } from "../../store"
import { PosthogEvent } from "../../types/posthog"
import shortenAddress from "../../utils/shortenAddress"
import Identicon from "../Identicon"
import { useNonEVMConnection } from "../../hooks/useNonEVMConnection"
import { ChainName } from "../../threshold-ts/types"

const AccountButton: FC<{
  openWalletModal: () => void
  account?: string | null
  deactivate: () => void
}> = ({ openWalletModal, account, deactivate }) => {
  const dispatch = useAppDispatch()
  const captureWalletDisconnectedEvent = useCapture(
    PosthogEvent.WalletDisconnected
  )

  // Get non-EVM wallet info
  const {
    isNonEVMActive,
    nonEVMPublicKey,
    nonEVMChainName,
    disconnectNonEVMWallet,
  } = useNonEVMConnection()

  const onDisconnectClick = () => {
    captureWalletDisconnectedEvent()
    dispatch(resetStoreAction())
    deactivate()
  }

  const onDisconnectNonEVM = () => {
    captureWalletDisconnectedEvent()
    disconnectNonEVMWallet()
  }

  // Show both wallets if connected
  const showEVM = !!account
  const showNonEVM = isNonEVMActive && !!nonEVMPublicKey

  if (showEVM || showNonEVM) {
    return (
      <HStack spacing={2}>
        {showEVM && (
          <Menu>
            <MenuButton as={Button} leftIcon={<Identicon address={account} />}>
              {shortenAddress(account)}
            </MenuButton>
            <MenuList>
              <MenuItem onClick={onDisconnectClick}>Disconnect</MenuItem>
            </MenuList>
          </Menu>
        )}
        {showNonEVM && (
          <Menu>
            <MenuButton as={Button} variant="outline">
              <HStack spacing={1}>
                <Text fontSize="xs" color="gray.500">
                  {nonEVMChainName}:
                </Text>
                <Text>{shortenAddress(nonEVMPublicKey!)}</Text>
              </HStack>
            </MenuButton>
            <MenuList>
              <MenuItem onClick={onDisconnectNonEVM}>Disconnect</MenuItem>
            </MenuList>
          </Menu>
        )}
      </HStack>
    )
  }

  return <Button onClick={openWalletModal}>Connect Wallet</Button>
}

export default AccountButton
