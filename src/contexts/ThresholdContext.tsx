import { createContext, FC, useContext, useEffect, useMemo } from "react"
import { useWeb3React } from "@web3-react/core"
import { threshold } from "../utils/getThresholdLib"

const ThresholdContext = createContext(threshold)

export const useThreshold = () => {
  return useContext(ThresholdContext)
}

export const ThresholdProvider: FC = ({ children }) => {
  const { library, active } = useWeb3React()

  useEffect(() => {
    // TODO: update the signer or provider in threshold instance when user connects to a wallet.
  }, [])

  return (
    <ThresholdContext.Provider value={threshold}>
      {children}
    </ThresholdContext.Provider>
  )
}