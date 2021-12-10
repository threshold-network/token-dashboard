import { TrezorSubprovider as TrezorSubprovider0x } from "@0x/subproviders/lib/src/subproviders/trezor"
import web3Utils from "web3-utils"
import Common from "ethereumjs-common"
import { Transaction } from "ethereumjs-tx"

/**
 * Builds a Transaction object for a custom chain.
 * @param {*} txData The transaction data
 * @param {number} chainId The custom chain's ID.
 * @return {Transaction} The Ethereum transaction
 */
export const buildTransactionForChain = (txData, chainId) => {
  const common = Common.forCustomChain(
    "mainnet",
    {
      name: "keep-dev",
      chainId: chainId,
    },
    "petersburg",
    ["petersburg"]
  )
  return new Transaction(txData, { common })
}

/**
 * Gets the `chainId` from a signed `v`.
 * @param {string} v Hex string for `v`
 * @return {number} The chain id
 */
export const getChainIdFromSignedV = (v) => {
  // After a transaction is signed, the `v` component of the signature (v,r,s)
  // is set according to this algorithm, specified in EIP155 [1]:
  // v = CHAIN_ID * 2 + 35
  // Reformulating, we can calculate `chainId`:
  // CHAIN_ID = (v - 35) / 2
  // [1] https://github.com/ethereum/EIPs/blob/master/EIPS/eip-155.md
  v = parseInt(v, 16)
  const chainId = Math.floor((v - 35) / 2)
  return chainId < 0 ? 0 : chainId
}

/**
 * Pads a hex string with zeroes, and returns a buffer.
 * @param {string} hexString The hex string, with/without the 0x prefix.
 * @param {number} padLength Length to pad string to, in bytes.
 * @return {Buffer} The padded hex as a Buffer.
 */
export function hexToPaddedBuffer(hexString, padLength) {
  hexString = hexString.startsWith("0x") ? hexString.slice(2) : hexString
  hexString = hexString.padStart(padLength, "0")
  return new Buffer(hexString, "hex")
}

export class TrezorSubprovider extends TrezorSubprovider0x {
  chainId = 1

  constructor({ chainId, trezorConnectClientApi }) {
    super({
      trezorConnectClientApi,
      networkId: chainId,
    })

    this.chainId = 1
  }

  async signTransactionAsync(txData) {
    if (txData.from === undefined || !web3Utils.isAddress(txData.from)) {
      throw new Error("Invalid address")
    }
    txData.value = txData.value || "0x0"
    txData.data = txData.data || "0x"
    txData.gas = txData.gas || "0x0"
    txData.gasPrice = txData.gasPrice || "0x0"

    const initialDerivedKeyInfo = await this._initialDerivedKeyInfoAsync()
    const derivedKeyInfo = this._findDerivedKeyInfoForAddress(
      initialDerivedKeyInfo,
      txData.from
    )
    const fullDerivationPath = derivedKeyInfo.derivationPath

    try {
      const response =
        await this._trezorConnectClientApi.ethereumSignTransaction({
          path: fullDerivationPath,
          transaction: {
            to: txData.to,
            value: txData.value,
            data: txData.data,
            chainId: 1,
            nonce: txData.nonce,
            gasLimit: txData.gas,
            gasPrice: txData.gasPrice,
          },
        })

      if (!response.success) {
        throw new Error(response)
      }

      const {
        payload: { v, r, s },
      } = response

      const tx = buildTransactionForChain(txData, 1)

      // Store signature in transaction.
      // Pad `v` in case the chainId encodes as an odd number of hex digits.
      tx.v = Buffer.from(v.slice(2), "hex") //hexToPaddedBuffer(v, 4)
      tx.r = Buffer.from(r.slice(2), "hex")
      tx.s = Buffer.from(s.slice(2), "hex")

      return `0x${tx.serialize().toString("hex")}`
    } catch (error) {
      console.log("Error signing trezor transcrtion ", error)
    }
  }
}
