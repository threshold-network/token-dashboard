import {
  createContext,
  FC,
  useContext,
  useEffect,
  useRef,
  useState,
  useMemo,
} from "react"
import { getThresholdLibProvider, threshold } from "../utils/getThresholdLib"
import { useLedgerLiveApp } from "./LedgerLiveAppContext"
import { useIsActive } from "../hooks/useIsActive"
import { useIsEmbed } from "../hooks/useIsEmbed"
import { getDefaultProviderChainId } from "../utils/getEnvVariable"
import { useWeb3React } from "@web3-react/core"
import { useStarknetConnection } from "../hooks/useStarknetConnection"
import { useNonEVMConnection } from "../hooks/useNonEVMConnection"
import { ChainName } from "../threshold-ts/types"
import { isL2Network } from "../networks/utils/connectedNetwork"
import {
  isStarkNetInitialized,
  isStarknetNetwork,
} from "../utils/tbtcStarknetHelpers"

// Chain name mapping for SDK compatibility
const CHAIN_NAME_MAPPING: Record<string, ChainName> = {
  Starknet: ChainName.Starknet,
  StarkNet: ChainName.Starknet,
  Solana: ChainName.Solana,
}

const ThresholdContext = createContext(threshold)

export const useThreshold = () => {
  return useContext(ThresholdContext)
}

/**
 * Helper hook to get the connected address for a specific chain.
 * This allows components to retrieve the appropriate address based on the chain context.
 * @param {ChainName} chainName - The chain to get the address for
 * @return {string|null} The connected address for the specified chain, or null if not connected
 */
export const useConnectedAddress = (chainName?: ChainName) => {
  const { account } = useWeb3React()
  const { nonEVMChainName, nonEVMPublicKey } = useNonEVMConnection()

  // If no chain specified, return the active chain's address
  if (!chainName) {
    return nonEVMPublicKey || account || null
  }

  // Return address based on specific chain
  switch (chainName) {
    case ChainName.Ethereum:
      return account || null
    case ChainName.Starknet:
      return nonEVMChainName === ChainName.Starknet ? nonEVMPublicKey : null
    case ChainName.Solana:
      return nonEVMChainName === ChainName.Solana ? nonEVMPublicKey : null
    default:
      return null
  }
}

// StarkNet state management interface
export interface StarkNetContextState {
  isCrossChainInitializing: boolean
  crossChainError: string | null
  isStarkNetReady: boolean
  retryInitialization: () => void
}

// Create a separate context for StarkNet status
const StarkNetStatusContext = createContext<StarkNetContextState>({
  isCrossChainInitializing: false,
  crossChainError: null,
  isStarkNetReady: false,
  retryInitialization: () => {},
})

// StarkNet status hook
export const useStarkNetStatus = (): StarkNetContextState => {
  return useContext(StarkNetStatusContext)
}

export const ThresholdProvider: FC = ({ children }) => {
  const { library } = useWeb3React()
  const hasThresholdLibConfigBeenUpdated = useRef(false)
  const { ledgerLiveAppEthereumSigner } = useLedgerLiveApp()
  const { account, isActive, chainId } = useIsActive()
  const { isEmbed } = useIsEmbed()

  // Non-EVM chain connections
  const {
    nonEVMChainName,
    nonEVMPublicKey,
    nonEVMProvider,
    isNonEVMActive,
    nonEVMChainId,
  } = useNonEVMConnection()

  // StarkNet state management
  const [isCrossChainInitializing, setIsCrossChainInitializing] =
    useState(false)
  const [crossChainError, setCrossChainError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  const isStarkNetReady = useMemo(() => {
    if (nonEVMChainName !== ChainName.Starknet || !isNonEVMActive) return false
    // For StarkNet, we're ready if initialization completed without errors
    return !isCrossChainInitializing && !crossChainError
  }, [
    nonEVMChainName,
    isNonEVMActive,
    isCrossChainInitializing,
    crossChainError,
  ])

  const retryInitialization = () => {
    setCrossChainError(null)
    setRetryCount((prev) => prev + 1)
  }

  const starkNetStatus: StarkNetContextState = {
    isCrossChainInitializing,
    crossChainError,
    isStarkNetReady,
    retryInitialization,
  }

  useEffect(() => {
    const updateThresholdConfig = async () => {
      // Update config if either EVM or non-EVM is active
      if ((isActive && chainId) || isNonEVMActive) {
        // For StarkNet-only connections, we need to provide a valid provider
        // even if there's no EVM wallet connected
        const ethereumProvider = isActive
          ? isEmbed
            ? ledgerLiveAppEthereumSigner
            : library
          : getThresholdLibProvider()

        const ethereumChainId = chainId || getDefaultProviderChainId()

        await threshold.updateConfig({
          ethereum: {
            ...threshold.config.ethereum,
            providerOrSigner: ethereumProvider,
            account,
            chainId: ethereumChainId,
          },
          bitcoin: threshold.config.bitcoin,
          crossChain: {
            isCrossChain: isNonEVMActive || isL2Network(ethereumChainId),
            chainName: nonEVMChainName
              ? CHAIN_NAME_MAPPING[nonEVMChainName] || nonEVMChainName
              : nonEVMChainName,
            nonEVMProvider: nonEVMProvider,
          },
        })
        hasThresholdLibConfigBeenUpdated.current = true
      }

      // Reset config only when both are disconnected
      if (
        !isActive &&
        !isNonEVMActive &&
        hasThresholdLibConfigBeenUpdated.current
      ) {
        await threshold.updateConfig({
          ethereum: {
            ...threshold.config.ethereum,
            providerOrSigner: getThresholdLibProvider(),
            account: undefined,
            chainId: getDefaultProviderChainId(),
          },
          bitcoin: threshold.config.bitcoin,
          crossChain: {
            isCrossChain: false,
            chainName: null,
            nonEVMProvider: null,
          },
        })
        hasThresholdLibConfigBeenUpdated.current = false
      }
    }

    updateThresholdConfig()
  }, [
    isActive,
    account,
    isEmbed,
    chainId,
    library,
    isNonEVMActive,
    nonEVMChainName,
    nonEVMProvider,
    retryCount,
  ])

  // Separate effect for StarkNet initialization with address extraction and deposit owner setting
  useEffect(() => {
    const initializeStarkNetCrossChain = async () => {
      if (
        nonEVMChainName !== ChainName.Starknet ||
        !isNonEVMActive ||
        !nonEVMProvider
      ) {
        return
      }

      // Check if the StarkNet network is enabled
      const { isEnabledStarkNetChainId } = await import("../config/starknet")
      if (nonEVMChainId && !isEnabledStarkNetChainId(nonEVMChainId)) {
        console.log(
          `StarkNet network ${nonEVMChainId} is disabled. Skipping cross-chain initialization.`
        )
        setCrossChainError(
          "This StarkNet network is disabled. Please switch to an enabled network."
        )
        return
      }

      setIsCrossChainInitializing(true)
      setCrossChainError(null)

      try {
        // Wait longer for the config update and SDK initialization to complete
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Extract wallet address from provider
        let walletAddress: string | undefined

        if (nonEVMProvider?.account?.address) {
          walletAddress = nonEVMProvider.account.address
        } else if (nonEVMProvider?.address) {
          walletAddress = nonEVMProvider.address
        } else if (nonEVMProvider?.selectedAddress) {
          walletAddress = nonEVMProvider.selectedAddress
        } else if (nonEVMPublicKey) {
          walletAddress = nonEVMPublicKey
        }

        if (!walletAddress) {
          throw new Error("Could not extract StarkNet wallet address")
        }

        // Extract address - StarkNet addresses are already in the correct format
        const extractedAddress = walletAddress

        if (!extractedAddress) {
          throw new Error("Could not extract StarkNet address from wallet")
        }

        // The cross-chain initialization happens in updateConfig, so we just need to wait
        // The actual SDK cross-chain setup will be done when initiating deposits

        setIsCrossChainInitializing(false)
      } catch (error) {
        console.error("StarkNet initialization error:", error)
        setCrossChainError(
          error instanceof Error
            ? error.message
            : "Failed to initialize StarkNet"
        )
        setIsCrossChainInitializing(false)
      }
    }

    initializeStarkNetCrossChain()
  }, [
    nonEVMChainName,
    isNonEVMActive,
    nonEVMProvider,
    nonEVMPublicKey,
    nonEVMChainId,
    chainId,
    retryCount,
  ])

  return (
    <ThresholdContext.Provider value={threshold}>
      <StarkNetStatusContext.Provider value={starkNetStatus}>
        {children}
      </StarkNetStatusContext.Provider>
    </ThresholdContext.Provider>
  )
}
