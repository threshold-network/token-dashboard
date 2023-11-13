import {
  createContext,
  FC,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useCallback,
  useState,
} from "react"
import { useWeb3React } from "@web3-react/core"
import {
  getDefaultThresholdLibProvider,
  threshold,
} from "../utils/getThresholdLib"
import { providers, Signer } from "ethers"
import { TBTC as SDK } from "tbtc-sdk-v2"

const ThresholdContext = createContext(
  Object.assign(threshold, {
    sdkStatus: {
      initialized: false,
      initializing: false,
      initializedWithSigner: false,
      setInitializing: (() => {}) as Dispatch<SetStateAction<boolean>>,
    },
  })
)

export const useThreshold = () => {
  return useContext(ThresholdContext)
}

export const ThresholdProvider: FC = ({ children }) => {
  const { library, active, account } = useWeb3React()
  const hasThresholdLibConfigBeenUpdated = useRef(false)
  const [sdk, setSdk] = useState<SDK | undefined>(undefined)
  const [isSdkInitializing, setIsSdkInitializing] = useState(false)
  const [isSdkInitialized, setIsSdkInitialized] = useState(false)
  const [isSdkInitializedWithSigner, setIsSdkInitializedWithSigner] =
    useState(false)
  const threshold = useThreshold()

  const initializeSdk = useCallback(
    async (providerOrSigner: providers.Provider | Signer, account?: string) => {
      if (!isSdkInitializing) {
        setIsSdkInitializing(true)
        const sdk = await threshold.tbtc.initializeSdk(
          providerOrSigner,
          account
        )
        setSdk(sdk)
        setIsSdkInitializing(false)
        setIsSdkInitialized(true)
        const isInitializedWithSigner = account ? true : false
        setIsSdkInitializedWithSigner(isInitializedWithSigner)
      }
    },
    [
      threshold,
      setSdk,
      setIsSdkInitializing,
      setIsSdkInitialized,
      setIsSdkInitializedWithSigner,
    ]
  )

  useEffect(() => {
    if (active && library && account) {
      threshold.updateConfig({
        ethereum: {
          ...threshold.config.ethereum,
          providerOrSigner: library,
          account,
        },
        bitcoin: threshold.config.bitcoin,
      })
      hasThresholdLibConfigBeenUpdated.current = true
      initializeSdk(threshold.config.ethereum.providerOrSigner, account)
    }

    if (!active && !account && hasThresholdLibConfigBeenUpdated.current) {
      threshold.updateConfig({
        ethereum: {
          ...threshold.config.ethereum,
          providerOrSigner: getDefaultThresholdLibProvider(),
        },
        bitcoin: threshold.config.bitcoin,
      })
      hasThresholdLibConfigBeenUpdated.current = false
      initializeSdk(threshold.config.ethereum.providerOrSigner)
    }

    if (!sdk && !isSdkInitializing && !isSdkInitialized) {
      initializeSdk(threshold.config.ethereum.providerOrSigner)
    }
  }, [library, active, account])

  return (
    <ThresholdContext.Provider
      value={Object.assign(threshold, {
        sdkStatus: {
          initialized: isSdkInitialized,
          initializing: isSdkInitializing,
          initializedWithSigner: isSdkInitializedWithSigner,
          setInitializing: setIsSdkInitializing,
        },
      })}
    >
      {children}
    </ThresholdContext.Provider>
  )
}
