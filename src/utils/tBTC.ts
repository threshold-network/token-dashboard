import { BitcoinNetwork } from "../threshold-ts/types"
import { BridgeProcess } from "../types/tbtc"
import {
  computeHash160,
  createOutputScriptFromAddress,
  prependScriptPubKeyByLength,
} from "../threshold-ts/utils"
import { BigNumberish, BigNumber } from "ethers"

const MINTING_MAINNET_BTC_RECOVERY_ADDRESS_PREFIXES = ["1", "bc1q"] as const
const MINTING_TESTNET_BTC_RECOVERY_ADDRESS_PREFIXES = [
  "m",
  "n",
  "tb1q",
] as const

const UNMINTING_MAINNET_BTC_ADDRESS_PREFIXES = ["1", "bc1q", "3"] as const
const UNMINTING_TESTNET_BTC_ADDRESS_PREFIXES = ["m", "n", "tb1q", "2"] as const

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
      `"`,
      prefix,
      `"`,
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

export const MINT_BITCOIN_MIN_AMOUNT = "1000000" // 0.01 BTC
export const UNMINT_MIN_AMOUNT = "10000000000000000" // 0.01 ETH

export class RedemptionDetailsLinkBuilder {
  private walletPublicKeyHash?: string
  private txHash?: string
  private redeemer?: string
  private redeemerOutputScript?: string
  private chainName?: string

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

  withBitcoinAddress = (btcAddress: string, bitcoinNetwork: BitcoinNetwork) => {
    const redeemerOutputScript = createOutputScriptFromAddress(
      btcAddress,
      bitcoinNetwork
    )
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

  withChainName = (chainName: string) => {
    this.chainName = chainName
    return this
  }

  withTxHash = (txHash: string) => {
    this.txHash = txHash
    return this
  }

  build = () => {
    if (!this.txHash || !this.redeemerOutputScript || !this.redeemer) {
      const missingParams = [
        { label: "transaction hash", value: this.txHash },
        { label: "redeemer output script", value: this.redeemerOutputScript },
        { label: "redeemer", value: this.redeemer },
      ].filter((_) => !_.value)

      throw new Error(
        `Required parameters not set. Set ${missingParams
          .map((_) => _.label)
          .join(", ")}.`
      )
    }

    if (!this.walletPublicKeyHash && !this.chainName) {
      throw new Error(
        "Required parameters not set. Set wallet public key hash or chain name."
      )
    }

    const queryParams = new URLSearchParams()
    queryParams.set("redeemer", this.redeemer)
    if (this.walletPublicKeyHash) {
      queryParams.set("walletPublicKeyHash", this.walletPublicKeyHash)
    }
    if (this.chainName) {
      queryParams.set("chainName", this.chainName)
    }
    queryParams.set("redeemerOutputScript", this.redeemerOutputScript)

    return `/tBTC/unmint/redemption/${this.txHash}?${queryParams.toString()}`
  }
}

export const buildRedemptionDetailsLink = (
  redeemer: string,
  btcAddress: string,
  bitcoinNetwork: BitcoinNetwork,
  txHash?: string,
  walletPublicKey?: string,
  chainName?: string | null
): string => {
  const redemptionDetailsLinkBuilder = new RedemptionDetailsLinkBuilder()

  if (txHash) {
    redemptionDetailsLinkBuilder.withTxHash(txHash)
  }
  if (walletPublicKey) {
    redemptionDetailsLinkBuilder.withWalletPublicKey(walletPublicKey)
  }
  if (chainName) {
    redemptionDetailsLinkBuilder.withChainName(chainName)
  }
  return redemptionDetailsLinkBuilder
    .withRedeemer(redeemer)
    .withBitcoinAddress(btcAddress, bitcoinNetwork)
    .build()
}

/**
 * Calculates the duration in seconds based on the number of confirmations.
 *
 * @param {number} numberOfConfirmations The number of confirmations.
 * @return {number} The duration in minutes.
 */
export const getDurationByNumberOfConfirmations = (
  numberOfConfirmations: number
) => numberOfConfirmations * 10 + 60
