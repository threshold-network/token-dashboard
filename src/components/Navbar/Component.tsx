import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
  CloseButton,
  Container,
  Stack,
} from "@chakra-ui/react"
import shortenAddress from "../../utils/shortenAddress"
import { ModalType } from "../../enums"
import { BiWalletAlt } from "react-icons/all"
import { FC, useState } from "react"
import NetworkButton from "./NetworkButton"

interface NavbarComponentProps {
  active?: boolean
  account?: string | null
  chainId?: number
  openModal: (type: ModalType) => void
}

const NavbarComponent: FC<NavbarComponentProps> = ({
  active,
  account,
  chainId,
  openModal,
}) => {
  const [hideAlert, setHideAlert] = useState(false)

  return (
    <Box p={4}>
      <Container
        display="flex"
        justifyContent="flex-end"
        maxW="6xl"
        position="relative"
      >
        {active && account ? (
          <Stack spacing={4} direction="row">
            <NetworkButton chainId={chainId} />
            <Button>{shortenAddress(account)}</Button>
          </Stack>
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
