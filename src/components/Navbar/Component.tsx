import { Box, Container, Stack } from "@chakra-ui/react"
import { ModalType } from "../../enums"
import { FC } from "react"
import NetworkButton from "./NetworkButton"
import WalletConnectionAlert from "./WalletConnectionAlert"
import WalletButton from "./WalletButton"

interface NavbarComponentProps {
  account?: string | null
  chainId?: number
  openModal: (type: ModalType) => void
}

const NavbarComponent: FC<NavbarComponentProps> = ({
  account,
  chainId,
  openModal,
}) => {
  return (
    <Box p={4}>
      <Container
        display="flex"
        justifyContent="flex-end"
        maxW="6xl"
        position="relative"
      >
        <Stack spacing={4} direction="row">
          <NetworkButton chainId={chainId} />
          <WalletButton
            onClick={() => openModal(ModalType.SelectWallet)}
            account={account}
          />
        </Stack>
        <WalletConnectionAlert {...{ account, chainId }} />
      </Container>
    </Box>
  )
}

export default NavbarComponent
