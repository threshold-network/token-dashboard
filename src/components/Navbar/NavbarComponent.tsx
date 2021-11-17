import {
  Box,
  Container,
  HStack,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react"
import { FC } from "react"
import WalletConnectionAlert from "./WalletConnectionAlert"
import HamburgerButton from "./HamburgerButton"
import DarkModeSwitcher from "./DarkModeSwitcher"
import AccountButton from "./AccountButton"
import NetworkButton from "./NetworkButton"

interface NavbarComponentProps {
  account?: string | null
  chainId?: number
  openWalletModal: () => void
  deactivate: () => void
}

const NavbarComponent: FC<NavbarComponentProps> = ({
  account,
  chainId,
  openWalletModal,
  deactivate,
}) => {
  return (
    <Box
      py={4}
      px={{ base: 0, md: 4 }}
      borderBottom={{ base: "1px", md: "none" }}
      borderColor="gray.100"
    >
      <Container
        display="flex"
        justifyContent="space-between"
        maxW="6xl"
        position="relative"
      >
        <HStack>
          <DarkModeSwitcher />
          <HamburgerButton display={{ base: "block", md: "none" }} />
        </HStack>
        <Stack spacing={4} direction="row">
          {chainId && <NetworkButton chainId={chainId} />}
          <AccountButton {...{ openWalletModal, deactivate, account }} />
        </Stack>
        <WalletConnectionAlert {...{ account, chainId }} />
      </Container>
    </Box>
  )
}

export default NavbarComponent
