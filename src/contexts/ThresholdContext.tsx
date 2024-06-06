import { useWeb3React } from "@web3-react/core"
import { createContext, FC, useContext, useEffect, useRef } from "react"
import {
  getDefaultThresholdLibProvider,
  threshold,
} from "../utils/getThresholdLib"
import { useLedgerLiveApp } from "./LedgerLiveAppContext"
import { useIsActive } from "../hooks/useIsActive"
import { useIsEmbed } from "../hooks/useIsEmbed"

const ThresholdContext = createContext(threshold)

export const useThreshold = () => {
  return useContext(ThresholdContext)
}

export const ThresholdProvider: FC = ({ children }) => {
  const { library } = useWeb3React()
  const hasThresholdLibConfigBeenUpdated = useRef(false)
  const { ledgerLiveAppEthereumSigner } = useLedgerLiveApp()
  const { account, isActive } = useIsActive()
  const { isEmbed } = useIsEmbed()

  useEffect(() => {
    if (isActive) {
      threshold.updateConfig({
        ethereum: {
          ...threshold.config.ethereum,
          providerOrSigner: isEmbed ? ledgerLiveAppEthereumSigner : library,
          account,
        },
        bitcoin: threshold.config.bitcoin,
      })
      hasThresholdLibConfigBeenUpdated.current = true
    }

    if (!isActive && hasThresholdLibConfigBeenUpdated.current) {
      threshold.updateConfig({
        ethereum: {
          ...threshold.config.ethereum,
          providerOrSigner: getDefaultThresholdLibProvider(),
          account: undefined,
        },
        bitcoin: threshold.config.bitcoin,
      })
      hasThresholdLibConfigBeenUpdated.current = false
    }
  }, [library, isActive, account, isEmbed])

  return (
    <ThresholdContext.Provider value={threshold}>
      {children}
    </ThresholdContext.Provider>
  )
}
