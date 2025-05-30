import axios from "axios"
import { TrmPayload } from "../types"
import { ApiUrl, endpointUrl } from "../enums"

interface WalletScreeningRequest {
  address: string
  chainId: number
  networkName?: string
}

export async function fetchWalletScreening({
  address,
  chainId,
  networkName,
}: WalletScreeningRequest): Promise<TrmPayload> {
  const requestBody = {
    address,
    chainId,
    networkName,
  }

  try {
    const response = await axios.post(
      `${ApiUrl.TBTC_EXPLORER}${endpointUrl.TRM_WALLET_SCREENING}`,
      requestBody
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
