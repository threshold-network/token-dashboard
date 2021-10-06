import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
  CloseButton,
  Container,
} from "@chakra-ui/react"
import { Ethereum } from "../../static/icons/Ethereum"
import chainIdToNetworkName from "../../utils/chainIdToNetworkName"
import shortenAddress from "../../utils/shortenAddress"
import { ModalType } from "../../enums"
import { BiWalletAlt } from "react-icons/all"
import { FC } from "react"

interface NavbarComponentProps {
  active?: boolean
  account?: string | null
  chainId?: number
  openModal: (type: ModalType) => void
  hideAlert: boolean
  setHideAlert: (hide: boolean) => void
}

const NavbarComponent: FC<NavbarComponentProps> = ({
  active,
  account,
  chainId,
  openModal,
  hideAlert,
  setHideAlert,
}) => {
  return (
    <Box p={4}>
      <Container
        display="flex"
        justifyContent="flex-end"
        maxW="6xl"
        position="relative"
      >
        {active && account ? (
          <>
            <Button mr={4} variant="secondary" leftIcon={<Ethereum />}>
              {chainIdToNetworkName(chainId)}
            </Button>
            <Button>{shortenAddress(account)}</Button>
          </>
        ) : (
          <Button
            onClick={() => openModal(ModalType.SelectWallet)}
            leftIcon={<BiWalletAlt />}
          >
            Connect Wallet
          </Button>
        )}
        {!active && !hideAlert && (
          <Alert
            status="warning"
            position="absolute"
            w="400px"
            top="55px"
            right="16px"
            boxShadow="md"
          >
            <AlertIcon />
            <AlertDescription>Connect your wallet</AlertDescription>
            <CloseButton
              position="absolute"
              right="8px"
              top="8px"
              onClick={() => setHideAlert(true)}
            />
          </Alert>
        )}
      </Container>
    </Box>
  )
}

export default NavbarComponent
