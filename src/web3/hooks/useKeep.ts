import { useErc20TokenContract } from "./useERC20"
import { useWeb3React } from "@web3-react/core"
import { Token } from "../../enums"
import { TransactionType } from "../../enums/transactionType"

// TODO grab these from env?
const KEEP_MAINNET = "0x85eee30c52b0b379b046fb0f85f4f3dc3009afec"
const KEEP_ROPSTEN = "0xab584929f7e0d994617209d7207527b5ed8da57e"

export interface UseKeep {
  (): {
    approveKeep: () => void
    fetchKeepBalance: () => void
  }
}

export const useKeep = () => {
  const { chainId } = useWeb3React()
  const contractAddress = chainId === 3 ? KEEP_ROPSTEN : KEEP_MAINNET
  const { balanceOf, approve } = useErc20TokenContract(contractAddress)

  const approveKeep = () => {
    approve(TransactionType.ApproveKeep)
  }

  const fetchKeepBalance = () => {
    balanceOf(Token.Keep)
  }

  return {
    approveKeep,
    fetchKeepBalance,
  }
}
