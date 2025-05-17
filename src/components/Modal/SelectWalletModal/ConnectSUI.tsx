import { FC, useEffect, useState } from "react"
import {
  Box,
  Stack,
  Center,
  Text,
  Alert,
  AlertIcon,
  Link,
  useColorModeValue,
} from "@chakra-ui/react"
import { ConnectButton, useWallet, ErrorCode } from "@suiet/wallet-kit"
import { WalletConnectionModalBase } from "./components"
import { SUIIcon } from "../../../static/icons/SUI"

const ConnectSUI: FC<{
  goBack: () => void
  closeModal: () => void
}> = ({ goBack, closeModal }) => {
  const wallet = useWallet()
  const [displayError, setDisplayError] = useState<string | null>(null)

  useEffect(() => {
    if (wallet.connected && wallet.account) {
      closeModal()
    }
  }, [wallet.connected, wallet.account, closeModal])

  const handleKitConnectError = (error: any) => {
    console.error("ConnectSUI - @suiet/wallet-kit ConnectButton Error:", error)
    let message = "SUI Wallet connection failed."
    if (error.code === ErrorCode.WALLET__CONNECT_ERROR__USER_REJECTED) {
      message = "Connection request rejected by user."
    } else if (error.message) {
      message = error.message
    } else if (typeof error === "string") {
      message = error
    }
    setDisplayError(message)
  }

  const handleKitConnectSuccess = (walletName: string) => {
    console.log(
      `ConnectSUI - @suiet/wallet-kit ConnectButton Success: Connected to ${walletName}`
    )
    setDisplayError(null)
  }

  const KitConnectionStatus: FC = () => {
    if (wallet.connecting) {
      return (
        <Alert status="info" borderRadius="md" mt={4}>
          <AlertIcon />
          <Text>Connecting with SUI Wallet Kit... Check wallet extension.</Text>
        </Alert>
      )
    }
    if (wallet.connected && wallet.account?.address) {
      const addr = wallet.account.address
      const displayAddr =
        addr.length > 10
          ? `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`
          : addr
      return (
        <Alert status="success" borderRadius="md" mt={4}>
          <AlertIcon />
          <Text>
            Kit Connected: {displayAddr} ({wallet.adapter?.name})
          </Text>
        </Alert>
      )
    }
    return null
  }

  return (
    <WalletConnectionModalBase
      goBack={goBack}
      closeModal={closeModal}
      WalletIcon={SUIIcon}
      title="Connect SUI Wallet"
      subTitle="Use the button below to select your SUI wallet."
      shouldForceCloseModal={false}
    >
      <Box mt={4} width="100%">
        <Center>
          <Stack spacing={4} width="100%" maxWidth="320px">
            <Center>
              <ConnectButton
                onConnectSuccess={handleKitConnectSuccess}
                onConnectError={handleKitConnectError}
                style={{
                  width: "100%",
                  padding: "10px 16px",
                  borderRadius: "8px",
                  fontWeight: "600",
                  backgroundColor: "#3182ce",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                }}
              />
            </Center>

            <KitConnectionStatus />

            {displayError && (
              <Alert status="error" borderRadius="md" mt={4}>
                <AlertIcon />
                <Text>{displayError}</Text>
              </Alert>
            )}

            <Box
              borderRadius="md"
              p={3}
              backgroundColor={useColorModeValue("gray.100", "gray.700")}
              mt={4}
            >
              <Text fontSize="sm" fontWeight="medium" mb={2}>
                Detected SUI Wallets (by @suiet/wallet-kit):
              </Text>
              {wallet.allAvailableWallets &&
              wallet.allAvailableWallets.length > 0 ? (
                <Stack>
                  {wallet.allAvailableWallets.map((w) => (
                    <Text key={w.name} fontSize="sm">
                      {w.name} {w.installed ? "(Installed)" : "(Not Installed)"}
                    </Text>
                  ))}
                </Stack>
              ) : (
                <Text fontSize="sm" color="gray.500">
                  No SUI wallets detected. Ensure your extension is active.
                </Text>
              )}
            </Box>
            <Text fontSize="xs" color="gray.500" textAlign="center" mt={2}>
              The SUI wallet selection modal should appear from the button
              above.
            </Text>
          </Stack>
        </Center>
      </Box>
    </WalletConnectionModalBase>
  )
}

export default ConnectSUI
