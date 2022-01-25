import { useWeb3React } from "@web3-react/core"
import { BigNumber } from "ethers"
import { useTokenState } from "./useTokenState"
import { useLocation, useNavigate } from "react-router-dom"
import { useEffect, useRef } from "react"

const useRouteByKeepNuBalance = () => {
  const { keep, nu } = useTokenState()
  const { active } = useWeb3React()
  const navigate = useNavigate()
  const location = useLocation()

  const safeNavigate = (route: string) => {
    if (route !== location.pathname) {
      navigate(route)
    }
  }

  const keepBalanceBn = BigNumber.from(keep.balance)
  const nuBalanceBn = BigNumber.from(nu.balance)

  const isFirstRender = useRef(true)

  useEffect(() => {
    if (active && isFirstRender.current) {
      isFirstRender.current = false

      if (keepBalanceBn.gt(nuBalanceBn)) {
        safeNavigate("/upgrade/keep")
      } else {
        safeNavigate("/upgrade/nu")
      }
    }
  }, [active, keepBalanceBn, nuBalanceBn])
}

export default useRouteByKeepNuBalance
