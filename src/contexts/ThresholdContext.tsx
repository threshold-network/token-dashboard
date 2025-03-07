import { createContext, FC, useContext, useEffect, useRef } from "react"
import { getThresholdLibProvider, threshold } from "../utils/getThresholdLib"
import { useLedgerLiveApp } from "./LedgerLiveAppContext"
import { useIsActive } from "../hooks/useIsActive"
import { useIsEmbed } from "../hooks/useIsEmbed"
import { getDefaultProviderChainId } from "../utils/getEnvVariable"
import { useWeb3React } from "@web3-react/core"

const ThresholdContext = createContext(threshold)

export const useThreshold = () => {
  return useContext(ThresholdContext)
}

export const ThresholdProvider: FC = ({ children }) => {
  const { library } = useWeb3React()
  const hasThresholdLibConfigBeenUpdated = useRef(false)
  const { ledgerLiveAppEthereumSigner } = useLedgerLiveApp()
  const { account, isActive, chainId } = useIsActive()
  const { isEmbed } = useIsEmbed()

  useEffect(() => {
    if (isActive && chainId) {
      threshold.updateConfig({
        ethereum: {
          ...threshold.config.ethereum,
          providerOrSigner: isEmbed ? ledgerLiveAppEthereumSigner : library,
          account,
          chainId,
        },
        bitcoin: threshold.config.bitcoin,
      })
      hasThresholdLibConfigBeenUpdated.current = true
    }

    if (!isActive && hasThresholdLibConfigBeenUpdated.current) {
      threshold.updateConfig({
        ethereum: {
          ...threshold.config.ethereum,
          providerOrSigner: getThresholdLibProvider(),
          account: undefined,
          chainId: getDefaultProviderChainId(),
        },
        bitcoin: threshold.config.bitcoin,
      })
      hasThresholdLibConfigBeenUpdated.current = false
    }
  }, [isActive, account, isEmbed, chainId, library])

  return (
    <ThresholdContext.Provider value={threshold}>
      {children}
    </ThresholdContext.Provider>
  )
}
