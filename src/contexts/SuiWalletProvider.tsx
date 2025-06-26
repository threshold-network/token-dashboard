import {
  SuietWallet,
  SuiWallet,
  MartianWallet,
  NightlyWallet,
  WalletProvider,
  DefaultChains,
  SuiTestnetChain,
  SuiMainnetChain,
} from "@suiet/wallet-kit"
import { FC, ReactNode } from "react"
import { getEthereumDefaultProviderChainId } from "../utils/getEnvVariable"
import { isMainnetChainId } from "../networks/utils"
interface SuiWalletProviderProps {
  children: ReactNode
}

const SuiWalletProvider: FC<SuiWalletProviderProps> = ({ children }) => {
  const defaultWallets = [SuietWallet, SuiWallet, MartianWallet, NightlyWallet]
  const isMainnet = isMainnetChainId(getEthereumDefaultProviderChainId())

  return (
    <WalletProvider
      chains={isMainnet ? [SuiMainnetChain] : [SuiTestnetChain]}
      defaultWallets={defaultWallets}
    >
      {children}
    </WalletProvider>
  )
}

export default SuiWalletProvider
