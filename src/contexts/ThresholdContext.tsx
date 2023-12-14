import { TBTC as SDK } from "@keep-network/tbtc-v2.ts"
import { useWeb3React } from "@web3-react/core"
import { providers, Signer } from "ethers"
import {
  createContext,
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react"
import {
  getDefaultThresholdLibProvider,
  threshold,
} from "../utils/getThresholdLib"
import { useLedgerLiveApp } from "./LedgerLiveAppContext"
import { useIsActive } from "../hooks/useIsActive"
import { useIsEmbed } from "../hooks/useIsEmbed"

const ThresholdContext = createContext(threshold)

// TODO: We should probably put those values information in ThresholdContext,
// but that would require a lot of change through app, so for now we will keep
// it in a separate context.
const IsSdkInitializingContext = createContext({
  isSdkInitializing: false,
  isSdkInitialized: false,
  isSdkInitializedWithSigner: false,
  setIsSdkInitializing: (() => {}) as Dispatch<SetStateAction<boolean>>,
})

export const useThreshold = () => {
  return useContext(ThresholdContext)
}

export const useIsTbtcSdkInitializing = () => {
  return useContext(IsSdkInitializingContext)
}

const useInitializeTbtcSdk = () => {
  const [sdk, setSdk] = useState<SDK | undefined>(undefined)
  const [isInitializing, setIsInitializing] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const [isInitializedWithSigner, setIsInitializedWithSigner] = useState(false)
  const threshold = useThreshold()

  const initializeSdk = useCallback(
    async (providerOrSigner: providers.Provider | Signer, account?: string) => {
      if (!isInitializing) {
        setIsInitializing(true)
        const sdk = await threshold.tbtc.initializeSdk(
          providerOrSigner,
          account
        )
        setSdk(sdk)
        setIsInitialized(true)
        const isInitializedWithSigner = account ? true : false
        setIsInitializedWithSigner(isInitializedWithSigner)
        setIsInitializing(false)
      }
    },
    [
      threshold,
      setSdk,
      setIsInitializing,
      setIsInitialized,
      setIsInitializedWithSigner,
    ]
  )

  return {
    sdk,
    isSdkInitializing: isInitializing,
    isSdkInitialized: isInitialized,
    isSdkInitializedWithSigner: isInitializedWithSigner,
    setIsSdkInitializing: setIsInitializing,
    initializeSdk,
  }
}

export const ThresholdProvider: FC = ({ children }) => {
  const { library } = useWeb3React()
  const hasThresholdLibConfigBeenUpdated = useRef(false)
  const {
    sdk,
    initializeSdk,
    isSdkInitializing,
    isSdkInitialized,
    isSdkInitializedWithSigner,
    setIsSdkInitializing,
  } = useInitializeTbtcSdk()
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
      initializeSdk(threshold.config.ethereum.providerOrSigner, account)
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
      initializeSdk(threshold.config.ethereum.providerOrSigner)
    }

    if (!sdk && !isSdkInitializing && !isSdkInitialized) {
      initializeSdk(threshold.config.ethereum.providerOrSigner)
    }
  }, [library, isActive, account, initializeSdk, isEmbed])

  return (
    <ThresholdContext.Provider value={threshold}>
      <IsSdkInitializingContext.Provider
        value={{
          isSdkInitializing,
          isSdkInitialized,
          isSdkInitializedWithSigner,
          setIsSdkInitializing,
        }}
      >
        {children}
      </IsSdkInitializingContext.Provider>
    </ThresholdContext.Provider>
  )
}
