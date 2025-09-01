import {
  createContext,
  FC,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react"
import { getThresholdLibProvider, threshold } from "../utils/getThresholdLib"
import { useLedgerLiveApp } from "./LedgerLiveAppContext"
import { useIsActive } from "../hooks/useIsActive"
import { useIsEmbed } from "../hooks/useIsEmbed"
import { getEthereumDefaultProviderChainId } from "../utils/getEnvVariable"
import { useWeb3React } from "@web3-react/core"
import { ChainName } from "../threshold-ts/types"
import {
  getEthereumNetworkNameFromChainId,
  isL2Network,
} from "../networks/utils"
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
  const [thresholdState, setThresholdState] = useState(threshold)
  const { library } = useWeb3React()
  const hasThresholdLibConfigBeenUpdated = useRef(false)
  const { ledgerLiveAppEthereumSigner } = useLedgerLiveApp()
  const { account, isActive, chainId } = useIsActive()
  const { isNonEVMActive, nonEVMChainName, nonEVMProvider } =
    useNonEVMConnection()
  const { isEmbed } = useIsEmbed()

  useEffect(() => {
    const unsubscribe = threshold.subscribe(() =>
      setThresholdState(Object.create(threshold))
    )
    return unsubscribe
  }, [])

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
          chainName: getEthereumNetworkNameFromChainId(chainId) as ChainName,
          isCrossChain: isL2Network(chainId),
        },
      })
      hasThresholdLibConfigBeenUpdated.current = true
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

    if (!isActive && hasThresholdLibConfigBeenUpdated.current) {
      threshold.updateConfig({
        ethereum: {
          ...threshold.config.ethereum,
          ethereumProviderOrSigner: getThresholdLibProvider(),
          account: undefined,
          chainId: undefined,
        },
        bitcoin: threshold.config.bitcoin,
        crossChain: {
          ...defaultCrossChainConfig,
        },
      })
      hasThresholdLibConfigBeenUpdated.current = false
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
    <ThresholdContext.Provider value={thresholdState}>
      {children}
    </ThresholdContext.Provider>
  )
}
