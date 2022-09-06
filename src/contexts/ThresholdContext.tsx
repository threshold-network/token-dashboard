import { createContext, FC, useContext, useEffect, useMemo } from "react"
import { useWeb3React } from "@web3-react/core"
import { threshold } from "../utils/getThresholdLib"
import { supportedChainId } from "../utils/getEnvVariable"

const ThresholdContext = createContext(threshold)

export const useThreshold = () => {
  return useContext(ThresholdContext)
}

export const ThresholdProvider: FC = ({ children }) => {
  const { library, active, account } = useWeb3React()

  useEffect(() => {
    if (active && library && account) {
      threshold.updateConfig({
        ethereum: {
          chainId: supportedChainId,
          providerOrSigner: library,
          account,
        },
      })
    }
  }, [library, active, account])

  return (
    <ThresholdContext.Provider value={threshold}>
      {children}
    </ThresholdContext.Provider>
  )
}
