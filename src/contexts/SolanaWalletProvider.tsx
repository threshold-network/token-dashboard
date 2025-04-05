import React, { FC, ReactNode, useMemo } from "react"
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react"
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui"
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base"
import {
  UnsafeBurnerWalletAdapter,
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  CoinbaseWalletAdapter,
} from "@solana/wallet-adapter-wallets"
import { clusterApiUrl } from "@solana/web3.js"
import { getEnvVariable } from "../utils/getEnvVariable"
import { EnvVariable } from "../enums"
import { isMainnetChainId } from "../networks/utils"

// Default Solana wallet adapter styles
require("@solana/wallet-adapter-react-ui/styles.css")

interface SolanaWalletProviderProps {
  children: ReactNode
}

const SolanaWalletProvider: FC<SolanaWalletProviderProps> = ({ children }) => {
  const defaultEthereumChainId = getEnvVariable(
    EnvVariable.DEFAULT_PROVIDER_CHAIN_ID
  )

  const solanaNetwork = isMainnetChainId(defaultEthereumChainId)
    ? WalletAdapterNetwork.Mainnet
    : WalletAdapterNetwork.Devnet

  const endpoint = useMemo(() => clusterApiUrl(solanaNetwork), [solanaNetwork])
  const wallets = useMemo(
    () => [
      new UnsafeBurnerWalletAdapter(),
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new CoinbaseWalletAdapter(),
    ],
    [solanaNetwork]
  )

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}

export default SolanaWalletProvider
