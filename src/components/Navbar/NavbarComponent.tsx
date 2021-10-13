import {
  Box,
  Button,
  Circle,
  Container,
  HStack,
  Icon,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react"
import { ModalType, ChainID } from "../../enums"
import { FC, ReactElement, useMemo } from "react"
import WalletConnectionAlert from "./WalletConnectionAlert"
import WalletButton from "./WalletButton"
import { BsQuestionCircleFill } from "react-icons/all"
import { Ethereum } from "../../static/icons/Ethereum"
import chainIdToNetworkName from "../../utils/chainIdToNetworkName"
import HamburgerButton from "../HamburgerButton"
import DarkModeSwitcher from "../DarkModeSwitcher"

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
  openModal,
  deactivate,
}) => {
  const networkIcon = useMemo(
    () =>
      networkIconMap[chainId || 0] || (
        <Icon as={BsQuestionCircleFill} color="red.600" h="12px" w="12px" />
      ),
    [chainId]
  )

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
          <DarkModeSwitcher />
          <HamburgerButton display={{ base: "block", md: "none" }} />
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
