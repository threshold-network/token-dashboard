import React, { createContext } from "react"
import { useWeb3React } from "@web3-react/core"
import { useKeep } from "../web3/hooks/useKeep"
import { useNu } from "../web3/hooks/useNu"

const TokenContext = createContext({})

// Context that handles data fetching when a user connects their wallet or switches their network
export const TokenContextProvider: React.FC = ({ children }) => {
  const { fetchBalance: fetchKeepBalance } = useKeep()
  const { fetchBalance: fetchNuBalance } = useNu()

  const { active, account, chainId } = useWeb3React()

  React.useEffect(() => {
    if (active && account) {
      fetchKeepBalance()
      fetchNuBalance()
    }
  }, [active, chainId])

  return <TokenContext.Provider value={{}}>{children}</TokenContext.Provider>
}
