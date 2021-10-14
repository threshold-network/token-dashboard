import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react"
import { FC } from "react"
import shortenAddress from "../../utils/shortenAddress"
import Identicon from "../Identicon"

const AccountButton: FC<{
  openWalletModal: () => void
  account?: string | null
  deactivate: () => void
}> = ({ openWalletModal, account, deactivate }) => {
  const variant = useBreakpointValue({ base: "secondary", md: "primary" })

  if (account) {
    return (
      <Menu>
        <MenuButton
          as={Button}
          leftIcon={<Identicon address={account} />}
          variant={variant}
          color={{ base: "white", md: useColorModeValue("white", "gray.900") }}
        >
          {shortenAddress(account)}
        </MenuButton>
        <MenuList>
          <MenuItem onClick={deactivate}>Disconnect</MenuItem>
        </MenuList>
      </Menu>
    )
  }

  return (
    <Button
      variant={variant}
      onClick={openWalletModal}
      color={{ base: "white", md: useColorModeValue("white", "gray.900") }}
    >
      Connect Wallet
    </Button>
  )
}

export default AccountButton
