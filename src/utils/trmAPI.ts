import axios from "axios"
import { getEnvVariable } from "./getEnvVariable"
import { EnvVariable } from "../enums"
import chainIdToTrmNetworkName from "./chainIdToTrmNetworkName"
import { TrmAccountDetails } from "../types"

interface WalletScreeningRequest {
  address: string
  chainId: number
}

export async function fetchWalletScreening({
  address,
  chainId,
}: WalletScreeningRequest): Promise<TrmAccountDetails[]> {
  const network = chainIdToTrmNetworkName(chainId)
  if (!network) return []

  const apiKey = getEnvVariable(EnvVariable.TRM_API_KEY)
  const auth = Buffer.from(`${apiKey}:${apiKey}`).toString("base64")
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Basic ${auth}`,
  }

  const requestBody = [
    {
      address,
      chain: network,
    },
  ]

  try {
    const response = await axios.post(
      "https://api.trmlabs.com/public/v2/screening/addresses",
      requestBody,
      { headers: headers }
    )
    return response.data
  } catch (error) {
    const errorMsg = "Failed to fetch data from TRM Wallet Screening"
    console.error(errorMsg, error)
    throw new Error(errorMsg)
  }
}

export const trmAPI = {
  fetchWalletScreening,
}
