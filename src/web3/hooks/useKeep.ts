import { useErc20TokenContract } from "./useERC20"
import { useWeb3React } from "@web3-react/core"
import { useCallback, useEffect, useState } from "react"

// const KEEP_ROPSTEN = "0x3725969e788a76fa7b5991decb6a0c27a88973c7"
const KEEP_ROPSTEN = "0xab584929f7e0d994617209d7207527b5ed8da57e"

export const useKeep = () => {
  const { account } = useWeb3React()
  const keepContract = useErc20TokenContract(KEEP_ROPSTEN)
  const [balance, setBalance] = useState(0)
  const [balanceLoading, setBalanceLoading] = useState(false)

  const fetchBalance = useCallback(async () => {
    if (account && keepContract) {
      try {
        setBalanceLoading(true)
        const rawWalletBalance = await keepContract.balanceOf(account as string)
        // TODO do not hard code decimals
        setBalanceLoading(false)
        setBalance(rawWalletBalance / 10 ** 18)
      } catch (error) {
        setBalanceLoading(false)
        console.log(`Error: Fetching KEEP balance failed for ${account}`, error)
      }
    }
  }, [account, keepContract])

  useEffect(() => {
    if (account && keepContract) {
      fetchBalance()
    }
  }, [account, keepContract])

  return {
    fetchBalance,
    balance,
    balanceLoading,
  }
}
