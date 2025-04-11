import { FC, useEffect } from "react"
import { Box, Stack, Center, Text, Button } from "@chakra-ui/react"
import { WalletConnectionModalBase } from "./components"
import { SUIIcon } from "../../../static/icons/SUI"
import { useWallet } from "../../../contexts/SUIWalletProvider"

const ConnectSUI: FC<{
  goBack: () => void
  closeModal: () => void
}> = ({ goBack, closeModal }) => {
  const { connected, account, select } = useWallet()

  useEffect(() => {
    if (connected && account) {
      closeModal()
    }
  }, [connected, account, closeModal])

  const handleConnect = async () => {
    try {
      await select()
    } catch (error) {
      console.error("Error connecting to SUI wallet:", error)
    }
  }

  return (
    <WalletConnectionModalBase
      goBack={goBack}
      closeModal={closeModal}
      WalletIcon={SUIIcon}
      title="SUI"
      subTitle="Connect SUI by choosing your wallet."
      shouldForceCloseModal={false}
    >
      <Box mt={4} width="100%">
        <Center>
          <Stack spacing={4} width="100%" maxWidth="320px">
            <Button
              colorScheme="blue"
              onClick={handleConnect}
              isDisabled={connected}
              width="100%"
            >
              {connected ? "Connected" : "Connect SUI Wallet"}
            </Button>
            <Text fontSize="sm" color="gray.500" textAlign="center">
              You need a SUI wallet extension installed to connect
            </Text>
          </Stack>
        </Center>
      </Box>
    </WalletConnectionModalBase>
  )
}

export default ConnectSUI
