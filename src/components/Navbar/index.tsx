import { FC } from "react"
import { Box, Button, Container } from "@chakra-ui/react"
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

  return (
    <Box bg="lightgray" p={4}>
      <Container display="flex" justifyContent="flex-end" maxW="6xl">
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
      </Container>
    </Box>
  )
}

export default Navbar
