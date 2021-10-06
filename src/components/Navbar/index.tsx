import { FC, useState } from "react"
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
  CloseButton,
  Container,
} from "@chakra-ui/react"
import { BiWalletAlt } from "react-icons/all"
import { useModal } from "../../hooks/useModal"
import { ModalType } from "../../enums"
import { useWeb3React } from "@web3-react/core"
import shortenAddress from "../../utils/shortenAddress"
import chainIdToNetworkName from "../../utils/chainIdToNetworkName"
import { Ethereum } from "../../static/icons/Ethereum"

const Navbar: FC = () => {
  const { openModal } = useModal()
  const { account, active, chainId } = useWeb3React()
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

export default Navbar
