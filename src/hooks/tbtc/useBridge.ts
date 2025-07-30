import { useState, useEffect, useCallback, useMemo, useRef } from "react"
import { BigNumber } from "ethers"
import { parseUnits } from "@ethersproject/units"
import { useWeb3React } from "@web3-react/core"
import { useThreshold } from "../../contexts/ThresholdContext"
import { BridgeRoute, BridgeQuote } from "../../threshold-ts/bridge"
import { BridgeNetwork } from "../../pages/BobBridge/components/NetworkSelector"
import { SupportedChainIds } from "../../networks/enums/networks"
import { getEthereumDefaultProviderChainId } from "../../utils/getEnvVariable"

export const useBridge = () => {
  const { bridge } = useThreshold()
  const { account } = useWeb3React()

  // Determine default networks based on environment
  const defaultChainId = getEthereumDefaultProviderChainId()
  const isMainnet = defaultChainId === SupportedChainIds.Ethereum

  const defaultFromNetwork = isMainnet
    ? SupportedChainIds.Ethereum
    : SupportedChainIds.Sepolia
  const defaultToNetwork = isMainnet
    ? SupportedChainIds.Bob
    : SupportedChainIds.BobSepolia

  // State
  const [fromNetwork, setFromNetwork] =
    useState<BridgeNetwork>(defaultFromNetwork)
  const [toNetwork, setToNetwork] = useState<BridgeNetwork>(defaultToNetwork)
  const [amount, setAmount] = useState("")
  const [bridgeRoute, setBridgeRoute] = useState<BridgeRoute | null>(null)
  const [quote, setQuote] = useState<BridgeQuote | null>(null)
  const [isLoadingQuote, setIsLoadingQuote] = useState(false)
  const [ccipAllowance, setCcipAllowance] = useState<BigNumber>(
    BigNumber.from(0)
  )
  const [isLoadingAllowance, setIsLoadingAllowance] = useState(false)

  // Swap networks
  const swapNetworks = useCallback(() => {
    setFromNetwork(toNetwork)
    setToNetwork(fromNetwork)
  }, [fromNetwork, toNetwork])

  // Handle network changes
  const handleFromNetworkChange = useCallback((network: BridgeNetwork) => {
    setFromNetwork(network)
    // Auto-update toNetwork to maintain mainnet/testnet consistency
    if (
      network === SupportedChainIds.Ethereum ||
      network === SupportedChainIds.Bob
    ) {
      // Mainnet
      setToNetwork(
        network === SupportedChainIds.Ethereum
          ? SupportedChainIds.Bob
          : SupportedChainIds.Ethereum
      )
    } else {
      // Testnet
      setToNetwork(
        network === SupportedChainIds.Sepolia
          ? SupportedChainIds.BobSepolia
          : SupportedChainIds.Sepolia
      )
    }
  }, [])

  const handleToNetworkChange = useCallback((network: BridgeNetwork) => {
    setToNetwork(network)
    // Auto-update fromNetwork to maintain mainnet/testnet consistency
    if (
      network === SupportedChainIds.Ethereum ||
      network === SupportedChainIds.Bob
    ) {
      // Mainnet
      setFromNetwork(
        network === SupportedChainIds.Ethereum
          ? SupportedChainIds.Bob
          : SupportedChainIds.Ethereum
      )
    } else {
      // Testnet
      setFromNetwork(
        network === SupportedChainIds.Sepolia
          ? SupportedChainIds.BobSepolia
          : SupportedChainIds.Sepolia
      )
    }
  }, [])

  // Simple debounce implementation
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Determine bridge route and quote
  const updateQuote = useCallback(async () => {
    if (!amount || !bridge) {
      setBridgeRoute(null)
      setQuote(null)
      return
    }

    try {
      setIsLoadingQuote(true)
      const amountBN = parseUnits(amount, 18)

      // Determine if this is a deposit or withdrawal
      const isDeposit =
        fromNetwork === SupportedChainIds.Ethereum ||
        fromNetwork === SupportedChainIds.Sepolia

      if (isDeposit) {
        // For deposits, always use CCIP
        setBridgeRoute("ccip")
        const depositQuote = await bridge.quoteFees(amountBN)
        setQuote(depositQuote)
      } else {
        // For withdrawals from Bob, use pickPath
        const route = await bridge.pickPath(amountBN)
        setBridgeRoute(route)
        const withdrawQuote = await bridge.quoteFees(amountBN)
        setQuote(withdrawQuote)
      }
    } catch (error) {
      console.error("Failed to get bridge quote:", error)
      setBridgeRoute(null)
      setQuote(null)
    } finally {
      setIsLoadingQuote(false)
    }
  }, [amount, bridge, fromNetwork])

  // Update CCIP allowance
  const updateCcipAllowance = useCallback(async () => {
    if (!bridge || !account) {
      setCcipAllowance(BigNumber.from(0))
      return
    }

    try {
      setIsLoadingAllowance(true)
      const allowance = await bridge.getCcipAllowance()
      setCcipAllowance(allowance)
    } catch (error) {
      console.error("Failed to get CCIP allowance:", error)
      setCcipAllowance(BigNumber.from(0))
    } finally {
      setIsLoadingAllowance(false)
    }
  }, [bridge, account])

  // Execute bridge transaction
  const executeBridge = useCallback(async () => {
    if (!bridge || !amount || !bridgeRoute) {
      throw new Error("Bridge not ready")
    }

    const amountBN = parseUnits(amount, 18)

    // Determine if this is a deposit or withdrawal
    const isDeposit =
      fromNetwork === SupportedChainIds.Ethereum ||
      fromNetwork === SupportedChainIds.Sepolia

    if (isDeposit) {
      // Execute deposit to Bob
      return await bridge.depositToBob(amountBN)
    } else {
      // Execute withdrawal from Bob
      return await bridge.withdrawFromBob(amountBN)
    }
  }, [bridge, amount, bridgeRoute, fromNetwork])

  // Execute CCIP approval
  const approveCcip = useCallback(async () => {
    if (!bridge || !amount) {
      throw new Error("Bridge not ready")
    }

    const amountBN = parseUnits(amount, 18)
    return await bridge.approveForCcip(amountBN)
  }, [bridge, amount])

  // Debounced quote update
  const debouncedUpdateQuote = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    debounceTimerRef.current = setTimeout(() => {
      updateQuote()
    }, 500)
  }, [updateQuote])

  // Effects
  useEffect(() => {
    debouncedUpdateQuote()
  }, [amount, fromNetwork, toNetwork, bridge])

  useEffect(() => {
    updateCcipAllowance()
  }, [updateCcipAllowance])

  return {
    // Networks
    fromNetwork,
    toNetwork,
    setFromNetwork: handleFromNetworkChange,
    setToNetwork: handleToNetworkChange,
    swapNetworks,

    // Amount
    amount,
    setAmount,

    // Bridge info
    bridgeRoute,
    quote,
    isLoadingQuote,
    ccipAllowance,
    isLoadingAllowance,

    // Actions
    executeBridge,
    approveCcip,
  }
}
