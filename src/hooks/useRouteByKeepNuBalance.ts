import { useWeb3React } from "@web3-react/core"
import { BigNumber } from "ethers"
import { useTokenState } from "./useTokenState"
import { useLocation, useNavigate } from "react-router-dom"
import { useEffect, useRef } from "react"

// routes between /upgrade/keep when the user connects their wallet
const useRouteByKeepNuBalance = () => {
  const { keep, nu } = useTokenState()
  const { active } = useWeb3React()
  const navigate = useNavigate()
  const location = useLocation()

  // prevents an infinite render by only navigating if the route is different from the current location
  const safeNavigate = (route: string) => {
    if (route !== location.pathname) {
      navigate(route)
    }
  }

  // do not route on initial render to prevent the page with a lesser balance from always re-routing to higher balance
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
    }

    if (active && !isFirstRender.current) {
      const keepBalanceBn = BigNumber.from(keep.balance)
      const nuBalanceBn = BigNumber.from(nu.balance)

      if (keepBalanceBn.gt(nuBalanceBn)) {
        safeNavigate("/upgrade/keep")
      } else {
        safeNavigate("/upgrade/nu")
      }
    }
  }, [active, keep.balance, nu.balance])
}

export default useRouteByKeepNuBalance
