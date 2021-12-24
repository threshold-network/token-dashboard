import { useEffect } from "react"
import { useFetchTvl } from "../hooks/useFetchTvl"

const PortfolioPage = () => {
  const fetchtTvlData = useFetchTvl()

  useEffect(() => {
    fetchtTvlData()
      .then(([ethInKeepBonding, tbtcTokenTotalSupply, coveragePoolTvl]) =>
        // TODO: convert to USD and display on page.
        console.log(
          "ethInKeepBonding, tbtcTokenTotalSupply, coveragePoolTvl",
          ethInKeepBonding.toString(),
          tbtcTokenTotalSupply.toString(),
          coveragePoolTvl.toString()
        )
      )
      .catch((error) => console.log("error", error))
  }, [fetchtTvlData])
  return <div>Portfolio Page</div>
}

export default PortfolioPage
