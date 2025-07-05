import {
  Alert,
  AlertDescription,
  AlertIcon,
  CloseButton,
} from "@chakra-ui/react"
import { FC, useEffect, useState } from "react"
import { useWallet } from "@suiet/wallet-kit"
import { getEthereumDefaultProviderChainId } from "../../utils/getEnvVariable"
import { isMainnetChainId } from "../../networks/utils"

const SuiNetworkAlert: FC = () => {
  const { connected, chain, chains, name: walletName } = useWallet()
  const [hideAlert, setHideAlert] = useState(true)
  const [alertDescription, setAlertDescription] = useState("")

  const isMainnet = isMainnetChainId(getEthereumDefaultProviderChainId())
  const targetChainId = isMainnet ? "sui:mainnet" : "sui:testnet"
  const targetChainName = isMainnet ? "Mainnet" : "Testnet"

  useEffect(() => {
    // Debug logging
    if (connected && chain) {
      console.log("[SuiNetworkAlert] Connected to SUI wallet:", {
        walletName,
        currentChainId: chain.id,
        currentChainName: chain.name,
        targetChainId,
        targetChainName,
        availableChains: chains.map((c) => ({ id: c.id, name: c.name })),
      })
    }

    if (!connected || !chain) {
      setHideAlert(true)
      return
    }

    // Check if it's the unknown network case
    if (chain.id === "unknown:unknown") {
      console.warn("[SuiNetworkAlert] SUI wallet on unknown network")
      setAlertDescription(
        `Unable to detect your SUI wallet network. Please ensure ${
          walletName || "your wallet"
        } is connected to ${targetChainName}.`
      )
      setHideAlert(false)
      return
    }

    // Check if on wrong network
    const isCorrectChain = chain.id === targetChainId
    if (!isCorrectChain) {
      console.warn("[SuiNetworkAlert] SUI wallet on wrong network", {
        current: chain.id,
        expected: targetChainId,
      })
      setAlertDescription(
        `Your SUI wallet is connected to ${
          chain.name || "an incorrect"
        } network. Please switch to ${targetChainName} in your ${
          walletName || "wallet"
        } settings.`
      )
      setHideAlert(false)
      return
    }

    // Connected to correct network
    console.log("[SuiNetworkAlert] SUI wallet on correct network")
    setHideAlert(true)
  }, [connected, chain, chains, targetChainId, targetChainName, walletName])

  const resetAlert = () => {
    setHideAlert(true)
    setAlertDescription("")
  }

  if (hideAlert || !connected) {
    return null
  }

  return (
    <Alert status="warning" variant="solid" w="fit-content" maxW="500px">
      <AlertIcon alignSelf="center" />
      <AlertDescription fontSize="sm">{alertDescription}</AlertDescription>
      <CloseButton onClick={resetAlert} ml={2} />
    </Alert>
  )
}

export default SuiNetworkAlert
