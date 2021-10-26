import { useErc20TokenContract } from "./useERC20"
import { useWeb3React } from "@web3-react/core"
import { useCallback, useEffect } from "react"
import { useReduxToken } from "../../hooks/useReduxToken"
import { Token } from "../../enums"

// TODO grab these from env?
const KEEP_MAINNET = "0x3725969e788a76fa7b5991decb6a0c27a88973c7"
const KEEP_ROPSTEN = "0xab584929f7e0d994617209d7207527b5ed8da57e"

export const useKeep = () => {
  const { account } = useWeb3React()
  const { setTokenLoading, setTokenBalance } = useReduxToken()
  const keepContract = useErc20TokenContract(KEEP_ROPSTEN)

  const fetchBalance = useCallback(async () => {
    if (account && keepContract) {
      try {
        setTokenLoading(Token.Keep, true)
        const rawWalletBalance = await keepContract.balanceOf(account as string)
        // TODO do not hard code decimals
        const balance = rawWalletBalance / 10 ** 18
        setTokenBalance(Token.Keep, balance)
        setTokenLoading(Token.Keep, false)
      } catch (error) {
        setTokenLoading(Token.Keep, false)
        console.log(`Error: Fetching KEEP balance failed for ${account}`, error)
      }
    }

    return 0
  }, [account, keepContract])

  useEffect(() => {
    if (account && keepContract) {
      fetchBalance()
    }
  }, [account, keepContract])

  return {
    fetchBalance,
  }
}
