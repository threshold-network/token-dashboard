import { useEffect, useState } from "react"
import { Contract } from "@ethersproject/contracts"
import { useIsActive } from "../../hooks/useIsActive"

export const useTokenAllowance = (
  tokenContract?: Contract,
  spender?: string
) => {
  const { account } = useIsActive()
  const [allowance, setAllowance] = useState(0)

  useEffect(() => {
    const checkAllowance = async () => {
      setAllowance(await tokenContract?.allowance(account, spender))
    }

    if (tokenContract?.allowance && account && spender) {
      checkAllowance()
    }
  }, [account, tokenContract, spender])

  return allowance
}
