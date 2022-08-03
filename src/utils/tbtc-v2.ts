import {
  calculateDepositRefundLocktime,
  DepositScriptParameters,
} from "@keep-network/tbtc-v2.ts/dist/deposit"
//@ts-ignore
import * as CryptoJS from "crypto-js"
import {
  Network,
  validate as isValidBtcAddress,
} from "bitcoin-address-validation"
import { unprefixedAndUncheckedAddress } from "../web3/utils"

// TODO: this could be moved to tbtc-v2.ts lib
export const createDepositScriptParameters = (
  ethAddress: string,
  btcRecoveryAddress: string
): DepositScriptParameters => {
  // TODO: check network
  if (isValidBtcAddress(btcRecoveryAddress, Network.testnet)) {
    throw new Error(
      "Wrong bitcoin address passed to createDepositScriptParameters function"
    )
  }

  const currentTimestamp = Math.floor(new Date().getTime() / 1000)
  const blindingFactor = CryptoJS.lib.WordArray.random(8).toString(
    CryptoJS.enc.Hex
  )
  const walletPublicKey =
    "03989d253b17a6a0f41838b84ff0d20e8898f9d7b1a98f2564da4cc29dcf8581d9"
  const refundLocktime = calculateDepositRefundLocktime(currentTimestamp)
  const identifierHex = unprefixedAndUncheckedAddress(ethAddress)

  const depositScriptParameters: DepositScriptParameters = {
    depositor: {
      identifierHex,
    },
    blindingFactor,
    walletPublicKey:
      "0300d6f28a2f6bf9836f57fcda5d284c9a8f849316119779f0d6090830d97763a9",
    refundPublicKey:
      "0300d6f28a2f6bf9836f57fcda5d284c9a8f849316119779f0d6090830d97763a9",
    refundLocktime,
  }

  return depositScriptParameters
}
