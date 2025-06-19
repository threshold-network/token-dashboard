import { createContext, FC, useContext, useEffect, useRef } from "react"
import { getThresholdLibProvider, threshold } from "../utils/getThresholdLib"
import { useLedgerLiveApp } from "./LedgerLiveAppContext"
import { useIsActive } from "../hooks/useIsActive"
import { useIsEmbed } from "../hooks/useIsEmbed"
import { getEthereumDefaultProviderChainId } from "../utils/getEnvVariable"
import { useWeb3React } from "@web3-react/core"
import { ChainName } from "../threshold-ts/types"
import { isL2Network } from "../networks/utils"
import { useNonEVMConnection } from "../hooks/useNonEVMConnection"

const defaultCrossChainConfig = {
  isCrossChain: false,
  chainName: ChainName.Ethereum,
  nonEVMProvider: null,
}

const ThresholdContext = createContext(threshold)

export const useThreshold = () => {
  return useContext(ThresholdContext)
}

export const ThresholdProvider: FC = ({ children }) => {
  const { library } = useWeb3React()
  const hasThresholdLibConfigBeenUpdated = useRef(false)
  const { ledgerLiveAppEthereumSigner } = useLedgerLiveApp()
  const { account, isActive, chainId } = useIsActive()
  const { isNonEVMActive, nonEVMChainName, nonEVMProvider } =
    useNonEVMConnection()
  const { isEmbed } = useIsEmbed()

  useEffect(() => {
    if (isActive && chainId) {
      threshold.updateConfig({
        ethereum: {
          ...threshold.config.ethereum,
          ethereumProviderOrSigner: isEmbed
            ? ledgerLiveAppEthereumSigner
            : library,
          account,
          chainId,
        },
        bitcoin: threshold.config.bitcoin,
        crossChain: {
          ...defaultCrossChainConfig,
          chainName: isL2Network(chainId) ? ChainName.Ethereum : null,
          isCrossChain: isL2Network(chainId),
        },
      })
      hasThresholdLibConfigBeenUpdated.current = true
    }

    if (!isActive && hasThresholdLibConfigBeenUpdated.current) {
      threshold.updateConfig({
        ethereum: {
          ...threshold.config.ethereum,
          ethereumProviderOrSigner: getThresholdLibProvider(),
          account: undefined,
          chainId: getEthereumDefaultProviderChainId(),
        },
        bitcoin: threshold.config.bitcoin,
        crossChain: {
          ...threshold.config.crossChain,
        },
      })
      hasThresholdLibConfigBeenUpdated.current = false
    }

    if (isNonEVMActive) {
      threshold.updateConfig({
        ethereum: threshold.config.ethereum,
        bitcoin: threshold.config.bitcoin,
        crossChain: {
          isCrossChain: true,
          chainName: nonEVMChainName as Exclude<ChainName, ChainName.Ethereum>,
          nonEVMProvider: nonEVMProvider,
        },
      })
    }
  }, [
    isActive,
    account,
    isEmbed,
    chainId,
    library,
    nonEVMProvider,
    isNonEVMActive,
  ])

  return (
    <ThresholdContext.Provider value={threshold}>
      {children}
    </ThresholdContext.Provider>
  )
}
