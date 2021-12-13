import { useErc20TokenContract } from "./useERC20"
import { Token, TransactionType } from "../../enums"
import { Contract } from "@ethersproject/contracts"
// import T from "@threshold-network/solidity-contracts/artifacts/T.json"

const UNI_ROPSTEN = "0x71d82Eb6A5051CfF99582F4CDf2aE9cD402A4882"

export interface UseT {
  (): {
    approveT: () => void
    fetchTBalance: () => void
    contract: Contract | null
  }
}

export const useT: UseT = () => {
  const { balanceOf, approve, contract } = useErc20TokenContract(
    UNI_ROPSTEN
    // T.address,
    // undefined,
    // T.abi
  )

  const approveT = () => {
    approve(TransactionType.ApproveT)
  }

  const fetchTBalance = () => {
    balanceOf(Token.T)
  }

  return {
    approveT,
    fetchTBalance,
    contract,
  }
}
