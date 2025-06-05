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
import {
  isStarkNetInitialized,
  isStarknetNetwork,
} from "../utils/tbtcStarknetHelpers"
import { featureFlags } from "../constants"

// Chain name mapping for SDK compatibility
const CHAIN_NAME_MAPPING: Record<string, ChainName> = {
  Starknet: ChainName.Starknet, // UI uses "Starknet", SDK expects "StarkNet"
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
  const { nonEVMChainName, nonEVMPublicKey, nonEVMProvider, isNonEVMActive } =
    useNonEVMConnection()

  // StarkNet state management
  const [isCrossChainInitializing, setIsCrossChainInitializing] =
    useState(false)
  const [crossChainError, setCrossChainError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  const isStarkNetReady = useMemo(() => {
    if (nonEVMChainName !== ChainName.Starknet || !isNonEVMActive) return false
    return (
      isStarkNetInitialized(threshold.tbtc, chainId) &&
      !isCrossChainInitializing &&
      !crossChainError
    )
  }, [
    chainId,
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
      if (isActive && chainId) {
        await threshold.updateConfig({
          ethereum: {
            ...threshold.config.ethereum,
            providerOrSigner: isEmbed ? ledgerLiveAppEthereumSigner : library,
            account,
            chainId,
          },
          bitcoin: threshold.config.bitcoin,
          crossChain: {
            isCrossChain: isNonEVMActive,
            chainName: nonEVMChainName
              ? CHAIN_NAME_MAPPING[nonEVMChainName] || nonEVMChainName
              : nonEVMChainName,
            nonEVMProvider: nonEVMProvider,
          },
        })
        hasThresholdLibConfigBeenUpdated.current = true
      }

      if (!isActive && hasThresholdLibConfigBeenUpdated.current) {
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
      // Check feature flag first
      if (!featureFlags.STARKNET_ENABLED) {
        return
      }

      if (
        nonEVMChainName !== ChainName.Starknet ||
        !isNonEVMActive ||
        !nonEVMProvider
      ) {
        return
      }

      if (!isStarknetNetwork(chainId)) {
        return
      }

      setIsCrossChainInitializing(true)
      setCrossChainError(null)

      try {
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

        // Verify StarkNet is initialized using our helper function
        // Note: Deposit owner will be set later in initializeStarkNetDeposit helper
        if (!isStarkNetInitialized(threshold.tbtc, chainId)) {
          throw new Error("StarkNet depositor not initialized")
        }

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
