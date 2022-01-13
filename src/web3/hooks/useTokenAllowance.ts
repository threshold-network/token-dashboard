import { useEffect, useState } from "react"
import { useWeb3React } from "@web3-react/core"

export const useTokenAllowance = (contract?: any, spender?: string) => {
  const { account } = useWeb3React()
  const [allowance, setAllowance] = useState(0)

  useEffect(() => {
    const checkAllowance = async () => {
      setAllowance(await contract?.allowance(account, spender))
    }

    if (contract?.allowance && account && spender) {
      checkAllowance()
    }
  }, [account, contract, spender])

  return allowance
}
