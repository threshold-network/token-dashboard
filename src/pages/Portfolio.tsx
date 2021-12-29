import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { useFetchTvl } from "../hooks/useFetchTvl"
import { useETHData } from "../hooks/useETHData"
import { fetchETHPriceUSD } from "../store/eth"

const PortfolioPage = () => {
  const [data, fetchtTvlData] = useFetchTvl()
  console.log("Test fetching tvl data", data)

  // TODO: fetch eth price in the root component.
  const { usdPrice } = useETHData()
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(fetchETHPriceUSD())
  }, [dispatch])

  useEffect(() => {
    fetchtTvlData()
  }, [fetchtTvlData])

  return <div>Portfolio Page</div>
}

export default PortfolioPage
