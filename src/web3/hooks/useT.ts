import { useErc20TokenContract } from "./useERC20"
import { useWeb3React } from "@web3-react/core"
import { useCallback, useEffect } from "react"
import { useReduxToken } from "../../hooks/useReduxToken"
import { Token } from "../../enums"

// TODO grab these from env?
const T_MAINNET = "0x4fe83213d56308330ec302a8bd641f1d0113a4cc"
const UNI_ROPSTEN = "0x71d82Eb6A5051CfF99582F4CDf2aE9cD402A4882"

export const useT = () => {
  const { account, chainId } = useWeb3React()
  const { setTokenLoading, setTokenBalance } = useReduxToken()

  const contractAddress = chainId === 3 ? UNI_ROPSTEN : T_MAINNET
  const tContract = useErc20TokenContract(contractAddress)

  const fetchBalance = useCallback(async () => {
    if (account && tContract) {
      try {
        setTokenLoading(Token.T, true)
        const rawWalletBalance = await tContract.balanceOf(account as string)
        // TODO do not hard code decimals
        const balance = rawWalletBalance / 10 ** (await tContract.decimals())
        setTokenBalance(Token.T, balance)
        setTokenLoading(Token.T, false)
      } catch (error) {
        setTokenLoading(Token.T, false)
        console.log(`Error: Fetching T balance failed for ${account}`, error)
      }
    }

    return 0
  }, [account, tContract])

  useEffect(() => {
    if (account && tContract) {
      fetchBalance()
    }
  }, [account, tContract])

  return {
    fetchBalance,
  }
}
