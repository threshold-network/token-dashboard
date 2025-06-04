import { createContext, FC, useContext, useEffect, useRef } from "react"
import { getThresholdLibProvider, threshold } from "../utils/getThresholdLib"
import { useLedgerLiveApp } from "./LedgerLiveAppContext"
import { useIsActive } from "../hooks/useIsActive"
import { useIsEmbed } from "../hooks/useIsEmbed"
import { getDefaultProviderChainId } from "../utils/getEnvVariable"
import { useWeb3React } from "@web3-react/core"
import { useStarknetConnection } from "../hooks/useStarknetConnection"
import { useNonEVMConnection } from "../hooks/useNonEVMConnection"
import { ChainName } from "../threshold-ts/types"

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

export const ThresholdProvider: FC = ({ children }) => {
  const { library } = useWeb3React()
  const hasThresholdLibConfigBeenUpdated = useRef(false)
  const { ledgerLiveAppEthereumSigner } = useLedgerLiveApp()
  const { account, isActive, chainId } = useIsActive()
  const { isEmbed } = useIsEmbed()

  // Non-EVM chain connections
  const { nonEVMChainName, nonEVMPublicKey, nonEVMProvider, isNonEVMActive } =
    useNonEVMConnection()

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
            chainName: nonEVMChainName,
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
  ])

  return (
    <ThresholdContext.Provider value={threshold}>
      {children}
    </ThresholdContext.Provider>
  )
}
