import React, { FC, ReactNode } from "react"
import {
  WalletProvider as SuietKitWalletProvider,
  Chain,
} from "@suiet/wallet-kit"
import { getEnvVariable } from "../utils/getEnvVariable"
import { EnvVariable } from "../enums"
import { isMainnetChainId } from "../networks/utils"

// This file will now primarily just set up the official Suiet WalletProvider.
// Our custom context and bridge are removed to simplify and give direct control to the kit.

interface SUIWalletProviderProps {
  children: ReactNode
}

const SUIWalletProvider: FC<SUIWalletProviderProps> = ({ children }) => {
  const defaultEthereumChainId = getEnvVariable(
    EnvVariable.DEFAULT_PROVIDER_CHAIN_ID
  )
  const networkName = isMainnetChainId(defaultEthereumChainId)
    ? "mainnet"
    : "testnet"

  const suiChain: Chain = {
    id: `sui:${networkName}`,
    name: `Sui ${networkName.charAt(0).toUpperCase() + networkName.slice(1)}`,
    rpcUrl: `https://fullnode.${networkName}.sui.io/`,
  }

  // To use the standard wallet selection modal from @suiet/wallet-kit,
  // we just need to wrap the application (or relevant part) with their WalletProvider.
  // The ConnectButton component, when used within this provider, will trigger the kit's modal.
  return (
    <SuietKitWalletProvider
      chains={[suiChain]}
      autoConnect={false} // It's generally better to let users initiate connection
      // To customize the modal or available wallets, refer to @suiet/wallet-kit docs
      // for props like `defaultWallets` or theme overrides if available.
    >
      {children}
    </SuietKitWalletProvider>
  )
}

export default SUIWalletProvider
