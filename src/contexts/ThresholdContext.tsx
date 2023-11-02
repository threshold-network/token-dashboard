import { createContext, FC, useContext, useEffect, useRef } from "react"
import { useWeb3React } from "@web3-react/core"
import {
  getDefaultThresholdLibProvider,
  threshold,
} from "../utils/getThresholdLib"
import { supportedChainId } from "../utils/getEnvVariable"
import { LedgerLiveAppContext } from "./LedgerLiveAppContext"

const ThresholdContext = createContext(threshold)

export const useThreshold = () => {
  return useContext(ThresholdContext)
}

export const ThresholdProvider: FC = ({ children }) => {
  const { library, active, account } = useWeb3React()
  const hasThresholdLibConfigBeenUpdated = useRef(false)
  const { ethAccount, btcAccount } = useContext(LedgerLiveAppContext)

  useEffect(() => {
    if (active && library && account) {
      threshold.updateConfig({
        ethereum: {
          chainId: supportedChainId,
          providerOrSigner: library,
          account,
        },
        bitcoin: threshold.config.bitcoin,
      })
      hasThresholdLibConfigBeenUpdated.current = true
    }

    if (!active && !account && hasThresholdLibConfigBeenUpdated.current) {
      threshold.updateConfig({
        ethereum: {
          chainId: supportedChainId,
          providerOrSigner: getDefaultThresholdLibProvider(),
        },
        bitcoin: threshold.config.bitcoin,
      })
      hasThresholdLibConfigBeenUpdated.current = false
    }
  }, [library, active, account])

  // TODO: Remove this useEffect
  useEffect(() => {
    console.log("ethAccount: ", ethAccount)
    console.log("btcAccount: ", btcAccount)
  }, [ethAccount?.address, btcAccount?.address])

  return (
    <ThresholdContext.Provider value={threshold}>
      {children}
    </ThresholdContext.Provider>
  )
}
