import { createContext, FC, useContext, useEffect, useRef } from "react"
import { useWeb3React } from "@web3-react/core"
import {
  getDefaultThresholdLibProvider,
  threshold,
} from "../utils/getThresholdLib"
import { supportedChainId } from "../utils/getEnvVariable"
import { LedgerLiveAppContext } from "./LedgerLiveAppContext"
import { useIsActive } from "../hooks/useIsActive"
import { useInitializeSdk } from "../hooks/tbtc/useInitializeSdk"

const ThresholdContext = createContext(threshold)

// TODO: We should probably put the `isSdkInitializing` information in
// ThresholdContext, but that would require a lot of change through app, so for
// now we will keep it in a separate context.
const IsSdkInitializingContext = createContext({
  isSdkInitializing: false,
  isSdkInitializedWithSigner: false,
})

export const useThreshold = () => {
  return useContext(ThresholdContext)
}

export const useIsSdkInitializing = () => {
  return useContext(IsSdkInitializingContext)
}

export const ThresholdProvider: FC = ({ children }) => {
  const { library } = useWeb3React()
  const hasThresholdLibConfigBeenUpdated = useRef(false)
  const { ethAccount, btcAccount } = useContext(LedgerLiveAppContext)
  const { account, isActive } = useIsActive()
  const { sdk, initializeSdk, isSdkInitializing, isSdkInitializedWithSigner } =
    useInitializeSdk()

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
      initializeSdk(threshold.config.ethereum.providerOrSigner, account)
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
      initializeSdk(threshold.config.ethereum.providerOrSigner)
    }

    if (!sdk) {
      initializeSdk(threshold.config.ethereum.providerOrSigner)
    }
  }, [library, isActive, account, initializeSdk])

  // TODO: Remove this useEffect
  useEffect(() => {
    console.log("ethAccount: ", ethAccount)
    console.log("btcAccount: ", btcAccount)
  }, [ethAccount?.address, btcAccount?.address])

  return (
    <ThresholdContext.Provider value={threshold}>
      <IsSdkInitializingContext.Provider
        value={{ isSdkInitializing, isSdkInitializedWithSigner }}
      >
        {children}
      </IsSdkInitializingContext.Provider>
    </ThresholdContext.Provider>
  )
}
