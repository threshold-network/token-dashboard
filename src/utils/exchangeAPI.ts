import axios from "axios"
import { CoingeckoID, ApiUrl, endpointUrl } from "../enums"

const fetchCryptoCurrencyPriceUSD = async (id: CoingeckoID) => {
  const response = await axios.get(
    `${ApiUrl.COINGECKO}${endpointUrl.COINGECKO_SIMPLE_PRICE}?ids=${id}&${endpointUrl.COINGECKO_VS_CURRENCY}=usd`
  )
  return response.data[id].usd
}

export const exchangeAPI = {
  fetchCryptoCurrencyPriceUSD,
}
