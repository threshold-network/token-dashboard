import { ChainName } from "../threshold-ts/types"
import { SupportedChainIds } from "../networks/enums/networks"
import { getEthereumNetworkNameFromChainId } from "../networks/utils"

export type ChainDisplayInfo = {
  chainName: string
  walletAddressTooltip: string
  mintingProcessDescription: string
  recipientLabel: string
}

export function getChainDisplayInfo(
  nonEVMChainName: string | null,
  evmChainId?: SupportedChainIds
): ChainDisplayInfo {
  // Handle non-EVM chains
  if (nonEVMChainName) {
    switch (nonEVMChainName) {
      case ChainName.Sui:
        return {
          chainName: "Sui",
          walletAddressTooltip:
            "The Sui address where you'll receive your tBTC on the Sui network.",
          mintingProcessDescription:
            "Your tBTC will be minted and bridged to the Sui network. This process typically takes 2-3 hours.",
          recipientLabel: "Sui Recipient",
        }

      case ChainName.Starknet:
        return {
          chainName: "StarkNet",
          walletAddressTooltip:
            "The StarkNet address where you'll receive your tBTC on the StarkNet network.",
          mintingProcessDescription:
            "Your tBTC will be minted on Ethereum and then bridged to StarkNet using the StarkGate bridge. This process typically takes 15-30 minutes.",
          recipientLabel: "StarkNet Recipient",
        }

      default:
        // Fallback for unknown non-EVM chains
        return getDefaultChainInfo(nonEVMChainName)
    }
  }

  // Handle EVM chains
  if (evmChainId) {
    const networkName = getEthereumNetworkNameFromChainId(evmChainId)

    // Special handling for specific L2s if needed
    switch (evmChainId) {
      case SupportedChainIds.Arbitrum:
      case SupportedChainIds.Base:
      case SupportedChainIds.Sepolia:
        // case SupportedChainIds.ArbitrumSepolia:
        // case SupportedChainIds.BaseSepolia:
        return {
          chainName: networkName,
          walletAddressTooltip: `The ${networkName} address where you'll receive your tBTC.`,
          mintingProcessDescription: `Your tBTC will be minted and bridged to ${networkName}. This process typically takes 2-3 hours.`,
          recipientLabel: `${networkName} Recipient`,
        }

      default:
        // Default for Ethereum mainnet and other EVM chains
        return {
          chainName: networkName || "Ethereum",
          walletAddressTooltip:
            "The address is prepopulated with your wallet address. This is the address where you'll receive your tBTC.",
          mintingProcessDescription:
            "Receiving tBTC requires a single transaction and takes approximately 2 hours. The bridging can be initiated before you get all your Bitcoin deposit confirmations.",
          recipientLabel: "ETH Address",
        }
    }
  }

  // Default fallback
  return getDefaultChainInfo("Ethereum")
}

function getDefaultChainInfo(chainName: string): ChainDisplayInfo {
  return {
    chainName: chainName,
    walletAddressTooltip: `The ${chainName} address where you'll receive your tBTC.`,
    mintingProcessDescription: `Your tBTC will be minted and sent to your ${chainName} address. This process typically takes 2-3 hours.`,
    recipientLabel: `${chainName} Recipient`,
  }
}

export function getGenericWalletLabel(
  nonEVMChainName: string | null,
  evmChainId?: SupportedChainIds
): string {
  if (nonEVMChainName || evmChainId) {
    return "Wallet Address"
  }
  return "ETH Address"
}
