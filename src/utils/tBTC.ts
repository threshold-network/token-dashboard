import { BitcoinNetwork } from "../threshold-ts/types"
import { BridgeProcess } from "../types/tbtc"
import {
  computeHash160,
  createOutputScriptFromAddress,
  prependScriptPubKeyByLength,
} from "../threshold-ts/utils"
import { BigNumberish, BigNumber } from "ethers"

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
  btcAddress: string,
  bitcoinNetwork: BitcoinNetwork
): string => {
  return RedemptionDetailsLinkBuilder.createFromTxHash(txHash)
    .withRedeemer(redeemer)
    .withWalletPublicKey(walletPublicKey)
    .withBitcoinAddress(btcAddress, bitcoinNetwork)
    .build()
}

/**
 * Calculates the number of confirmations required based on the amount of tBTC.
 *
 * @param {BigNumberish} amount - The amount of tBTC.
 * @return {number} The number of confirmations required.
 */
export const getNumberOfConfirmationsByAmount = (
  amount: BigNumberish
): number => {
  const safeAmount = Number.isSafeInteger(amount)
    ? amount
    : Math.floor((amount as number) * 1e8)
  // Only safe integers (not floating-point numbers) can be transformed to BigNumber.
  // Converting the given amount to a safe integer if it is not already a safe integer.
  // If the amount is already a safe integer, it is returned as is.
  const amountInBN = BigNumber.from(safeAmount)

  if (amountInBN.lt(10000000) /* 0.1 BTC */) {
    return 1
  }
  if (amountInBN.lt(100000000) /* 1 BTC */) {
    return 3
  }
  return 6
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
