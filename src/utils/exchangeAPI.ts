import axios from "axios"
import { CoingeckoID } from "../enums"

const fetchCryptoCurrencyPriceUSD = async (id: CoingeckoID) => {
  const response = await axios.get(
    `https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd`
  )
  return response.data[id].usd
}

export const exchangeAPI = {
  fetchCryptoCurrencyPriceUSD,
}
