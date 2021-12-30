import T from "@threshold-network/solidity-contracts/artifacts/T.json"
import { Contract } from "@ethersproject/contracts"
import { useErc20TokenContract } from "./useERC20"
import { Token } from "../../enums"

export interface UseT {
  (): {
    approveT: () => void
    fetchTBalance: () => void
    contract: Contract | null
  }
}

export const useT: UseT = () => {
  const { balanceOf, approve, contract } = useErc20TokenContract(
    T.address,
    undefined,
    T.abi
  )

  const approveT = () => {
    // approve(TransactionType.ApproveNu)
  }

  const fetchTBalance = () => {
    balanceOf(Token.T)
  }

  return {
    fetchTBalance,
    approveT,
    contract,
  }
}
