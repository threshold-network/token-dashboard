import { useCallback, useMemo } from "react"
import { MaxUint256 } from "@ethersproject/constants"
import { Contract } from "@ethersproject/contracts"
import { useWeb3React } from "@web3-react/core"
import ERC20_ABI from "../abi/ERC20.json"
import { getContract } from "../../utils/getContract"
import { Token } from "../../enums"
import { useReduxToken } from "../../hooks/useReduxToken"
import { Approve, UseErc20Interface } from "../../types/token"
import { useTransaction } from "../../hooks/useTransaction"
import { TransactionStatus } from "../../enums/transactionType"
import { isWalletRejectionError } from "../../utils/isWalletRejectionError"

// import { Erc20 } from "../abis/types"

export function useContract<T extends Contract = Contract>(
  address: string,
  ABI: any,
  withSignerIfPossible = true
): T | null {
  const { library, account, chainId } = useWeb3React()

  return useMemo(() => {
    if (!address || !ABI || !library || !chainId) {
      return null
    }

    return getContract(
      address,
      ABI,
      library,
      withSignerIfPossible && account ? account : undefined
    )
  }, [address, ABI, library, chainId, withSignerIfPossible, account]) as T
}

export const useErc20TokenContract: UseErc20Interface = (
  tokenAddress,
  withSignerIfPossible
) => {
  const { account } = useWeb3React()
  const { setTokenLoading, setTokenBalance } = useReduxToken()
  const { setTransactionStatus } = useTransaction()

  // TODO: Figure out how to type the ERC20 contract
  // return useContract<Erc20>(tokenAddress, ERC20_ABI, withSignerIfPossible)
  const contract = useContract(tokenAddress, ERC20_ABI, withSignerIfPossible)

  const approve: Approve = useCallback(
    async (transactionType) => {
      if (account) {
        try {
          console.log("setting pending status")
          setTransactionStatus(transactionType, TransactionStatus.PendingWallet)
          console.log("firing off tx with contract ", contract)
          const tx = await contract?.approve(
            tokenAddress,
            MaxUint256.toString()
          )
          setTransactionStatus(
            transactionType,
            TransactionStatus.PendingOnChain
          )
          await tx.wait(1)
          setTransactionStatus(transactionType, TransactionStatus.Succeeded)
        } catch (error: any) {
          console.log("error ", error)
          setTransactionStatus(
            transactionType,
            isWalletRejectionError(error)
              ? TransactionStatus.Rejected
              : TransactionStatus.Failed
          )
        }
      }
    },
    [contract, account]
  )

  const balanceOf = useCallback(
    async (token: Token) => {
      if (account) {
        try {
          setTokenLoading(token, true)
          const rawWalletBalance = await contract?.balanceOf(account as string)
          // TODO do not hard code decimals
          const balance = rawWalletBalance / 10 ** 18
          setTokenBalance(token, balance)
          setTokenLoading(token, false)
        } catch (error) {
          setTokenLoading(Token.Nu, false)
          console.log(
            `Error: Fetching ${token} balance failed for ${account}`,
            error
          )
        }
      }
    },
    [account, contract]
  )

  return { approve, balanceOf }
}
