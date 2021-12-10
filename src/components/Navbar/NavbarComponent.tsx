import {
  Box,
  Container,
  Flex,
  Icon,
  IconButton,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react"
import { Link } from "react-router-dom"
import { FC } from "react"
import WalletConnectionAlert from "./WalletConnectionAlert"
import HamburgerButton from "./HamburgerButton"
import DarkModeSwitcher from "./DarkModeSwitcher"
import AccountButton from "./AccountButton"
import NetworkButton from "./NetworkButton"
import ThresholdPurple from "../../static/icons/ThresholdPurple"
import ThresholdWhite from "../../static/icons/ThresholdWhite"
import useChakraBreakpoint from "../../hooks/useChakraBreakpoint"

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
  const isMobile = useChakraBreakpoint("sm")
  return (
    <Box
      py={4}
      px={{ base: 0, sm: 4 }}
      borderBottom={{ base: "1px", sm: "none" }}
      borderColor="gray.100"
    >
      <Container
        display="flex"
        justifyContent="space-between"
        maxW="6xl"
        position="relative"
      >
        <Flex>
          <HamburgerButton display={{ base: "block", sm: "none" }} />
          {isMobile && (
            <Link to="/">
              <IconButton
                variant="ghost"
                aria-label="home"
                icon={
                  <Icon
                    mt="5px"
                    boxSize="22px"
                    as={useColorModeValue(ThresholdPurple, ThresholdWhite)}
                  />
                }
              />
            </Link>
          )}
        </Flex>

        <Stack spacing={4} direction="row">
          <DarkModeSwitcher />
          {chainId && <NetworkButton chainId={chainId} />}
          <AccountButton {...{ openWalletModal, deactivate, account }} />
        </Stack>
        <WalletConnectionAlert {...{ account, chainId }} />
      </Container>
    </Box>
  )
}

export default NavbarComponent
