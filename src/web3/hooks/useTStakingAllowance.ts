import { useEffect, useState } from "react"
import { useToken } from "../../hooks/useToken"
import { Token } from "../../enums"
import { useTStakingContract } from "./useTStakingContract"
import { useWeb3React } from "@web3-react/core"

export const useTStakingAllowance = () => {
  const { account } = useWeb3React()
  const [allowance, setAllowance] = useState(0)
  const { contract: TTokenContract } = useToken(Token.T)
  const tStakingContract = useTStakingContract()

  useEffect(() => {
    const checkAllowance = async () => {
      setAllowance(
        await TTokenContract?.allowance(account, tStakingContract?.address)
      )
    }

    if (TTokenContract?.allowance && account && tStakingContract?.address) {
      checkAllowance()
    }
  }, [account, TTokenContract?.address, tStakingContract])

  return { allowance }
}
