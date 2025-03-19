import { DepositReceipt } from "@keep-network/tbtc-v2.ts"
import axios from "axios"
import { BitcoinNetwork } from "../threshold-ts/types"

export interface VerificationOutcome {
  status: "valid" | "invalid" | "error"
  response: unknown
}

export const verifyDepositAddress = async (
  deposit: DepositReceipt,
  depositAddress: string,
  network: BitcoinNetwork
): Promise<VerificationOutcome> => {
  const endpointURL = `https://us-central1-keep-prd-210b.cloudfunctions.net/verify-deposit-address`
  const { depositor, blindingFactor, refundPublicKeyHash, refundLocktime } =
    deposit

  const hasExtraData = deposit.extraData !== undefined

  const url = hasExtraData
    ? `${endpointURL}/json-extradata/${network}/latest/${depositor.identifierHex}/${blindingFactor}/${refundPublicKeyHash}/${refundLocktime}/${deposit.extraData}`
    : `${endpointURL}/json/${network}/latest/${depositor.identifierHex}/${blindingFactor}/${refundPublicKeyHash}/${refundLocktime}`

  try {
    const response = await axios.get(url, { timeout: 10000 }) // 10s timeout

    const match = response.data.address === depositAddress

    const result: VerificationOutcome = {
      status: match ? "valid" : "invalid",
      response: response.data,
    }

    return result
  } catch (err) {
    const errorResult: VerificationOutcome = {
      status: "error",
      response: err,
    }

    return errorResult
  }
}
