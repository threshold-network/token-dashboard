import NuCypherToken from "@threshold-network/solidity-contracts/artifacts/NuCypherToken.json"
import { Contract } from "@ethersproject/contracts"
import { useErc20TokenContract } from "./useERC20"
import { Token } from "../../enums"
import { TransactionType } from "../../enums/transactionType"

export interface UseNu {
  (): {
    approveNu: () => void
    fetchNuBalance: () => void
    contract: Contract | null
  }
}

export const useNu: UseNu = () => {
  const { balanceOf, approve, contract } = useErc20TokenContract(
    NuCypherToken.address,
    undefined,
    NuCypherToken.abi
  )

  const approveNu = () => {
    approve(TransactionType.ApproveNu)
  }

  const fetchNuBalance = () => {
    balanceOf(Token.Nu)
  }

  return {
    fetchNuBalance,
    approveNu,
    contract,
  }
}
