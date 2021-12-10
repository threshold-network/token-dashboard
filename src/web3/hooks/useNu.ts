import { useErc20TokenContract } from "./useERC20"
import { useWeb3React } from "@web3-react/core"
import { useCallback, useEffect } from "react"
import { useReduxToken } from "../../hooks/useReduxToken"
import { Token } from "../../enums"

// TODO grab these from env?
const NU_MAINNET = "0x4fe83213d56308330ec302a8bd641f1d0113a4cc"
const NU_GOERLI = "0x02B50E38E5872068F325B1A7ca94D90ce2bfff63"
const DAI_ROPSTEN = "0xc2118d4d90b274016cB7a54c03EF52E6c537D957"

export const useNu = () => {
  const { account, chainId } = useWeb3React()
  const { setTokenLoading, setTokenBalance } = useReduxToken()

  // Checking for goerli Nu specifically
  const contractAddress = chainId === 3 ? DAI_ROPSTEN : NU_MAINNET
  const nuContract = useErc20TokenContract(contractAddress)

  const fetchBalance = useCallback(async () => {
    if (account && nuContract) {
      try {
        setTokenLoading(Token.Nu, true)
        const rawWalletBalance = await nuContract.balanceOf(account as string)
        // TODO do not hard code decimals
        const balance = rawWalletBalance / 10 ** (await nuContract.decimals())
        setTokenBalance(Token.Nu, balance)
        setTokenLoading(Token.Nu, false)
      } catch (error) {
        setTokenLoading(Token.Nu, false)
        console.log(`Error: Fetching NU balance failed for ${account}`, error)
      }
    }

    return 0
  }, [account, nuContract])

  useEffect(() => {
    if (account && nuContract) {
      fetchBalance()
    }
  }, [account, nuContract])

  return {
    fetchBalance,
  }
}
