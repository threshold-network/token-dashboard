import axios from "axios"
import { DepositScriptParameters } from "@keep-network/tbtc-v2.ts/dist/src/deposit"
import { BitcoinNetwork } from "../threshold-ts/types"

export interface VerificationOutcome {
  status: "valid" | "invalid" | "error"
  response: unknown
}

export const verifyDepositAddress = async (
  deposit: DepositScriptParameters,
  depositAddress: string,
  network: BitcoinNetwork
): Promise<VerificationOutcome> => {
  const endpoint = `https://us-central1-keep-prd-210b.cloudfunctions.net/verify-deposit-address`

  const { depositor, blindingFactor, refundPublicKeyHash, refundLocktime } =
    deposit

  try {
    const response = await axios.get(
      `${endpoint}/json/${network}/latest/${depositor.identifierHex}/${blindingFactor}/${refundPublicKeyHash}/${refundLocktime}`,
      { timeout: 10000 } // 10s
    )

    const match = response.data.address === depositAddress

    return {
      status: match ? "valid" : "invalid",
      response: response.data,
    }
  } catch (err) {
    return {
      status: "error",
      response: err,
    }
  }
}
