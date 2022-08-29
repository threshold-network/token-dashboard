import { createContext, FC, useContext, useMemo } from "react"
import { useWeb3React } from "@web3-react/core"
import { JsonRpcProvider, Provider } from "@ethersproject/providers"
import { Threshold } from "../threshold-ts"
import { EnvVariable } from "../enums"
import { getEnvVariable, supportedChainId } from "../utils/getEnvVariable"

const getThresholdLib = (providerOrSigner?: Provider) => {
  return new Threshold({
    ethereum: {
      chainId: supportedChainId,
      providerOrSigner:
        providerOrSigner ||
        new JsonRpcProvider(getEnvVariable(EnvVariable.ETH_HOSTNAME_HTTP)),
    },
  })
}

const ThresholdContext = createContext(getThresholdLib())

export const useThreshold = () => {
  return useContext(ThresholdContext)
}

export const ThresholdProvider: FC = ({ children }) => {
  const { library, active } = useWeb3React()

  const threshold = useMemo(() => {
    return getThresholdLib(active ? library : undefined)
  }, [library, active])

  return (
    <ThresholdContext.Provider value={threshold}>
      {children}
    </ThresholdContext.Provider>
  )
}
