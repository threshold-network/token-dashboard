import { BigNumber } from "ethers"
import { useTokenState } from "./useTokenState"
import { useEffect, useState } from "react"
import { useIsActive } from "./useIsActive"

const useUpgradeHref = () => {
  const { keep, nu } = useTokenState()
  const { isActive } = useIsActive()

  const [upgradeHref, setUpgradeHref] = useState("/upgrade")

  useEffect(() => {
    const keepBalanceBn = BigNumber.from(keep.balance)
    const nuBalanceBn = BigNumber.from(nu.balance)

    if (isActive) {
      if (keepBalanceBn.gt(nuBalanceBn)) {
        setUpgradeHref("/upgrade/keep")
      } else {
        setUpgradeHref("/upgrade/nu")
      }
    }
  }, [isActive, keep.balance, nu.balance])

  return upgradeHref
}

export default useUpgradeHref
