import { createContext, FC, useContext, useEffect, useRef } from "react"
import { useWeb3React } from "@web3-react/core"
import {
  getDefaultThresholdLibProvider,
  threshold,
} from "../utils/getThresholdLib"
import { supportedChainId } from "../utils/getEnvVariable"
import { LedgerLiveAppContext } from "./LedgerLiveAppContext"
import { useIsActive } from "../hooks/useIsActive"

const ThresholdContext = createContext(threshold)

export const useThreshold = () => {
  return useContext(ThresholdContext)
}

export const ThresholdProvider: FC = ({ children }) => {
  const { library } = useWeb3React()
  const hasThresholdLibConfigBeenUpdated = useRef(false)
  const { ethAccount, btcAccount } = useContext(LedgerLiveAppContext)
  const { account, isActive } = useIsActive()

  useEffect(() => {
    if (isActive) {
      // TODO: Maybe we could pass ledgerLiveAppEthereumSigner as
      // `providerOrSigner`? This would require some testing.
      threshold.updateConfig({
        ethereum: {
          chainId: supportedChainId,
          providerOrSigner: library || getDefaultThresholdLibProvider(),
          account,
          ledgerLiveAppEthereumSigner:
            threshold.config.ethereum.ledgerLiveAppEthereumSigner,
        },
        bitcoin: threshold.config.bitcoin,
      })
      hasThresholdLibConfigBeenUpdated.current = true
    }

    if (!isActive && hasThresholdLibConfigBeenUpdated.current) {
      threshold.updateConfig({
        ethereum: {
          chainId: supportedChainId,
          providerOrSigner: getDefaultThresholdLibProvider(),
          ledgerLiveAppEthereumSigner:
            threshold.config.ethereum.ledgerLiveAppEthereumSigner,
        },
        bitcoin: threshold.config.bitcoin,
      })
      hasThresholdLibConfigBeenUpdated.current = false
    }
  }, [library, isActive, account])

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
