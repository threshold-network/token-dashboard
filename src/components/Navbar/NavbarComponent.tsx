import {
  Box,
  Button,
  Circle,
  Container,
  HStack,
  Icon,
  IconButton,
  Stack,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react"
import { ModalType } from "../../enums"
import { FC, ReactElement, useMemo } from "react"
import WalletConnectionAlert from "./WalletConnectionAlert"
import WalletButton from "./WalletButton"
import { HamburgerIcon, MoonIcon, SunIcon } from "@chakra-ui/icons"
import { BsQuestionCircleFill } from "react-icons/all"
import { ChainID } from "../../types"
import { Ethereum } from "../../static/icons/Ethereum"
import chainIdToNetworkName from "../../utils/chainIdToNetworkName"

interface NavbarComponentProps {
  account?: string | null
  chainId?: number
  openModal: (type: ModalType) => void
  deactivate: () => void
}

interface NetworkIconMap {
  [chainId: number]: ReactElement
}

const networkIconMap: NetworkIconMap = {
  [ChainID.Ethereum]: <Ethereum />,
  [ChainID.Ropsten]: <Circle size="12px" bg="green.500" />,
}

const NavbarComponent: FC<NavbarComponentProps> = ({
  account,
  chainId,
  deactivate,
  openModal,
}) => {
  const networkIcon = useMemo(
    () =>
      networkIconMap[chainId || 0] || (
        <Icon as={BsQuestionCircleFill} color="red.600" h="12px" w="12px" />
      ),
    [chainId]
  )

  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <Box
      py={4}
      px={{ base: 0, md: 4 }}
      bg={{ base: "gray.800", md: useColorModeValue("white", "gray.800") }}
    >
      <Container
        display="flex"
        justifyContent="space-between"
        maxW="6xl"
        position="relative"
      >
        <HStack>
          {/* Dark/Light mode switcher */}
          <IconButton
            variant="ghost"
            aria-label="color mode"
            onClick={toggleColorMode}
            _hover={{
              bg: useColorModeValue("white", "gray.800"),
            }}
            icon={
              colorMode === "light" ? (
                <MoonIcon
                  color={{
                    base: "white",
                    md: useColorModeValue("gray.800", "white"),
                  }}
                />
              ) : (
                <SunIcon
                  color={{
                    base: "white",
                    md: useColorModeValue("gray.800", "white"),
                  }}
                />
              )
            }
          />

          {/* SideDrawer Hamburger Button for mobile only */}
          <IconButton
            variant="unstyled"
            display={{ base: "block", md: "none" }}
            aria-label="open navigation"
            icon={<Icon as={HamburgerIcon} color="white" />}
          />
        </HStack>

        <Stack spacing={4} direction="row">
          {/* Network Button */}
          {chainId && (
            <Button
              display={{
                base: "none",
                md: "block",
              }}
              variant="secondary"
              leftIcon={networkIcon}
            >
              {chainIdToNetworkName(chainId)}
            </Button>
          )}
          <WalletButton
            onClick={() => openModal(ModalType.SelectWallet)}
            {...{ account, networkIcon, deactivate }}
          />
        </Stack>
        <WalletConnectionAlert {...{ account, chainId }} />
      </Container>
    </Box>
  )
}

export default NavbarComponent
