import { BitcoinNetwork } from "../threshold-ts/types"
import { BridgeProcess } from "../types/tbtc"

const MINTING_MAINNET_BTC_RECOVERY_ADDRESS_PREFIXES = ["1", "bc1"] as const
const MINTING_TESTNET_BTC_RECOVERY_ADDRESS_PREFIXES = ["m", "n", "tb1"] as const

const UNMINTING_MAINNET_BTC_ADDRESS_PREFIXES = ["1", "bc1", "3"] as const
const UNMINTING_TESTNET_BTC_ADDRESS_PREFIXES = ["m", "n", "tb1", "3"] as const

type SupportedBitcoinNetworks = Exclude<BitcoinNetwork, "unknown">

const supportedAddressPrefixes: Record<
  BridgeProcess,
  Record<SupportedBitcoinNetworks, ReadonlyArray<string>>
> = {
  mint: {
    mainnet: MINTING_MAINNET_BTC_RECOVERY_ADDRESS_PREFIXES,
    testnet: MINTING_TESTNET_BTC_RECOVERY_ADDRESS_PREFIXES,
  },
  unmint: {
    mainnet: UNMINTING_MAINNET_BTC_ADDRESS_PREFIXES,
    testnet: UNMINTING_TESTNET_BTC_ADDRESS_PREFIXES,
  },
} as const

const getSupportedAddressPrefixes = (
  bridgeProcess: BridgeProcess,
  btcNetwork: SupportedBitcoinNetworks
) => {
  const prefixes = supportedAddressPrefixes[bridgeProcess][btcNetwork]

  const prefixesLength = prefixes.length

  if (prefixesLength === 1) {
    return prefixes[0]
  }

  return prefixes.reduce((reducer, prefix, index) => {
    const isLast = index === prefixesLength - 1
    const isBeforeLast = index === prefixesLength - 2
    const text = reducer.concat(
      `“`,
      prefix,
      `”`,
      isBeforeLast ? " or " : isLast ? "" : ", "
    )

    return text
  }, "")
}

const supportedAddressPrefixesText: Record<
  BridgeProcess,
  Record<SupportedBitcoinNetworks, string>
> = {
  mint: {
    mainnet: getSupportedAddressPrefixes("mint", BitcoinNetwork.Mainnet),
    testnet: getSupportedAddressPrefixes("mint", BitcoinNetwork.Testnet),
  },
  unmint: {
    mainnet: getSupportedAddressPrefixes("unmint", BitcoinNetwork.Mainnet),
    testnet: getSupportedAddressPrefixes("unmint", BitcoinNetwork.Testnet),
  },
} as const

export const getBridgeBTCSupportedAddressPrefixesText = (
  bridgeProcess: BridgeProcess,
  btcNetwork: BitcoinNetwork
) => {
  if (btcNetwork === BitcoinNetwork.Unknown) {
    throw new Error("Unsupported Bitcoin Network")
  }

  return supportedAddressPrefixesText[bridgeProcess][btcNetwork]
}
