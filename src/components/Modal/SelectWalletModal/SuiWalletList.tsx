import { useWallet } from "@suiet/wallet-kit"
import { FC, useMemo } from "react"
import { VStack, Button, Image, Text } from "@chakra-ui/react"
import { BaseModalProps } from "../../../types"

const SuiWalletList: FC<BaseModalProps> = ({ closeModal }) => {
  const { select, configuredWallets, detectedWallets } = useWallet()

  const supportedWallets = useMemo(
    () => [...configuredWallets, ...detectedWallets],
    [configuredWallets, detectedWallets]
  )

  const onSelectWallet = async (wallet: any) => {
    if (!wallet.installed) {
      window.open(wallet.downloadUrl.browserExtension, "_blank")
      return
    }

    try {
      await select(wallet.name)
      closeModal()
    } catch (error) {
      console.error("Failed to connect wallet:", error)
    }
  }

  return (
    <VStack spacing={4} w="full">
      {supportedWallets.map((wallet: any) => {
        return (
          <Button
            key={wallet.name}
            w="full"
            h="auto"
            py={4}
            px={6}
            variant="outline"
            onClick={() => onSelectWallet(wallet)}
            justifyContent="space-between"
          >
            <Text fontSize="lg" fontWeight="bold">
              {wallet.name}
            </Text>
            <Image src={wallet.iconUrl} boxSize="32px" alt={wallet.name} />
          </Button>
        )
      })}
    </VStack>
  )
}

export default SuiWalletList
