import { useWeb3React } from "@web3-react/core"
import { providers, Signer } from "ethers"
import {
  createContext,
  FC,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from "react"
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

const useInitializeTbtcSdk = () => {
  const threshold = useThreshold()

  const initializeSdk = useCallback(
    async (providerOrSigner: providers.Provider | Signer, account?: string) => {
      threshold.tbtc.initializeSdk(providerOrSigner, account)
    },
    [threshold]
  )

  return {
    initializeSdk,
  }
}

export const ThresholdProvider: FC = ({ children }) => {
  const { library } = useWeb3React()
  const hasThresholdLibConfigBeenUpdated = useRef(false)
  const { initializeSdk } = useInitializeTbtcSdk()
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
  }, [library, isActive, account, initializeSdk, isEmbed])

  return (
    <ThresholdContext.Provider value={threshold}>
      {children}
    </ThresholdContext.Provider>
  )
}
