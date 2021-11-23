import { useErc20TokenContract } from "./useERC20"
import { useWeb3React } from "@web3-react/core"
import { useCallback } from "react"
import { useReduxToken } from "../../hooks/useReduxToken"
import { Token } from "../../enums"

// TODO grab these from env?
const KEEP_MAINNET = "0x85eee30c52b0b379b046fb0f85f4f3dc3009afec"
const KEEP_ROPSTEN = "0xab584929f7e0d994617209d7207527b5ed8da57e"

export const useKeep = () => {
  const { account, chainId } = useWeb3React()
  const { setTokenLoading, setTokenBalance } = useReduxToken()

  // check for ropsten, otherwise use mainnet
  // TODO: we could map this better to future proof when we need additional chainId's instead of defaulting immediately to mainnet
  const contractAddress = chainId === 3 ? KEEP_ROPSTEN : KEEP_MAINNET
  const keepContract = useErc20TokenContract(contractAddress)

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
        console.log(error)
        setTokenLoading(Token.Keep, false)
        console.log(`Error: Fetching KEEP balance failed for ${account}`, error)
      }
    }

    return 0
  }, [account, keepContract])

  return {
    fetchBalance,
  }
}
