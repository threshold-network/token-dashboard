import { BitcoinNetwork } from "../threshold-ts/types"
import { BridgeProcess } from "../types/tbtc"
import {
  computeHash160,
  createOutputScriptFromAddress,
  prependScriptPubKeyByLength,
} from "../threshold-ts/utils"

const MINTING_MAINNET_BTC_RECOVERY_ADDRESS_PREFIXES = ["1", "bc1"] as const
const MINTING_TESTNET_BTC_RECOVERY_ADDRESS_PREFIXES = ["m", "n", "tb1"] as const

const UNMINTING_MAINNET_BTC_ADDRESS_PREFIXES = ["1", "bc1", "3"] as const
const UNMINTING_TESTNET_BTC_ADDRESS_PREFIXES = ["m", "n", "tb1", "2"] as const

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

const getSupportedAddressPrefixesText = (
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
    mainnet: getSupportedAddressPrefixesText("mint", BitcoinNetwork.Mainnet),
    testnet: getSupportedAddressPrefixesText("mint", BitcoinNetwork.Testnet),
  },
  unmint: {
    mainnet: getSupportedAddressPrefixesText("unmint", BitcoinNetwork.Mainnet),
    testnet: getSupportedAddressPrefixesText("unmint", BitcoinNetwork.Testnet),
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

export const UNMINT_MIN_AMOUNT = "10000000000000000" // 0.01

export class RedemptionDetailsLinkBuilder {
  private walletPublicKeyHash?: string
  private txHash?: string
  private redeemer?: string
  private redeemerOutputScript?: string

  static createFromTxHash = (txHash: string) => {
    const builder = new RedemptionDetailsLinkBuilder()

    return builder.withTxHash(txHash)
  }

  withWalletPublicKey = (walletPublicKey: string) => {
    this.walletPublicKeyHash = `0x${computeHash160(walletPublicKey)}`
    return this
  }

  withWalletPublicKeyHash = (walletPublicKeyHash: string) => {
    this.walletPublicKeyHash = walletPublicKeyHash
    return this
  }

  withBitcoinAddress = (btcAddress: string) => {
    const redeemerOutputScript = createOutputScriptFromAddress(btcAddress)
    this.redeemerOutputScript = prependScriptPubKeyByLength(
      redeemerOutputScript.toString()
    )
    return this
  }

  withRedeemerOutputScript = (redeemerOutputScript: string) => {
    this.redeemerOutputScript = redeemerOutputScript
    return this
  }

  withRedeemer = (redeemer: string) => {
    this.redeemer = redeemer
    return this
  }

  withTxHash = (txHash: string) => {
    this.txHash = txHash
    return this
  }

  build = () => {
    const params = [
      { label: "transaction hash", value: this.txHash },
      { label: "wallet public key hash", value: this.walletPublicKeyHash },
      { label: "redeemer output script", value: this.redeemerOutputScript },
      { label: "redeemer", value: this.redeemer },
    ]

    if (
      !this.txHash ||
      !this.walletPublicKeyHash ||
      !this.redeemerOutputScript ||
      !this.redeemer
    ) {
      const missingParams = params.filter((_) => !_.value)

      throw new Error(
        `Required parameters not set. Set ${missingParams
          .map((_) => _.label)
          .join(", ")}.`
      )
    }

    const queryParams = new URLSearchParams()
    queryParams.set("redeemer", this.redeemer)
    queryParams.set("walletPublicKeyHash", this.walletPublicKeyHash)
    queryParams.set("redeemerOutputScript", this.redeemerOutputScript)

    return `/tBTC/unmint/redemption/${this.txHash}?${queryParams.toString()}`
  }
}

export const buildRedemptionDetailsLink = (
  txHash: string,
  redeemer: string,
  walletPublicKey: string,
  btcAddress: string
): string => {
  return RedemptionDetailsLinkBuilder.createFromTxHash(txHash)
    .withRedeemer(redeemer)
    .withWalletPublicKey(walletPublicKey)
    .withBitcoinAddress(btcAddress)
    .build()
}
