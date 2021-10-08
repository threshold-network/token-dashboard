import {
  Button,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react"
import { FC } from "react"
import shortenAddress from "../../utils/shortenAddress"
import { FaWallet } from "react-icons/all"

const WalletButton: FC<{
  onClick: () => void
  account?: string | null
  networkIcon: any
  deactivate: () => void
}> = ({ onClick, account, networkIcon, deactivate }) => {
  if (account) {
    return (
      <Menu>
        {/* Mobile */}
        <MenuButton
          as={Button}
          colorScheme="whiteAlpha"
          variant="secondary"
          display={{
            base: "block",
            md: "none",
          }}
          leftIcon={networkIcon}
          color="white"
        >
          {shortenAddress(account)}
        </MenuButton>

        {/* Desktop */}
        <MenuButton
          as={Button}
          display={{
            base: "none",
            md: "block",
          }}
          leftIcon={<FaWallet />}
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
    <>
      {/* Mobile */}
      <IconButton
        variant="unstyled"
        aria-label="connect wallet"
        display={{
          base: "block",
          md: "none",
        }}
        icon={<Icon color="white" as={FaWallet} />}
        onClick={onClick}
      />

      {/* Desktop */}
      <Button
        display={{
          base: "none",
          md: "block",
        }}
        leftIcon={<FaWallet size="12px" />}
        onClick={onClick}
      >
        Connect Wallet
      </Button>
    </>
  )
}

export default WalletButton
