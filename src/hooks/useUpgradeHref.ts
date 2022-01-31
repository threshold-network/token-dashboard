import { useWeb3React } from "@web3-react/core"
import { BigNumber } from "ethers"
import { useTokenState } from "./useTokenState"
import { useEffect, useState } from "react"

const useUpgradeHref = () => {
  const { keep, nu } = useTokenState()
  const { active } = useWeb3React()

  const [upgradeHref, setUpgradeHref] = useState("/upgrade")

  useEffect(() => {
    const keepBalanceBn = BigNumber.from(keep.balance)
    const nuBalanceBn = BigNumber.from(nu.balance)

    if (active) {
      if (keepBalanceBn.gt(nuBalanceBn)) {
        setUpgradeHref("/upgrade/keep")
      } else {
        setUpgradeHref("/upgrade/nu")
      }
    }
  }, [active, keep.balance, nu.balance])

  return upgradeHref
}

export default useUpgradeHref
