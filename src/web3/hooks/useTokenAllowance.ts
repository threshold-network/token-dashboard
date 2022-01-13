import { useEffect, useState } from "react"
import { useWeb3React } from "@web3-react/core"
import { Contract } from "@ethersproject/contracts"

export const useTokenAllowance = (
  tokenContract?: Contract,
  spender?: string
) => {
  const { account } = useWeb3React()
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
