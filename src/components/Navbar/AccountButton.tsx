import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react"
import { FC } from "react"
import shortenAddress from "../../utils/shortenAddress"
import Identicon from "../Identicon"

const AccountButton: FC<{
  openWalletModal: () => void
  account?: string | null
  deactivate: () => void
}> = ({ openWalletModal, account, deactivate }) => {
  if (account) {
    return (
      <Menu>
        <MenuButton as={Button} leftIcon={<Identicon address={account} />}>
          {shortenAddress(account)}
        </MenuButton>
        <MenuList>
          <MenuItem onClick={deactivate}>Disconnect</MenuItem>
        </MenuList>
      </Menu>
    )
  }

  return <Button onClick={openWalletModal}>Connect Wallet</Button>
}

export default AccountButton
