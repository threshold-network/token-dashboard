import KeepToken from "@keep-network/keep-core/artifacts/KeepToken.json"
import { useErc20TokenContract } from "./useERC20"
import { Token } from "../../enums"
import { TransactionType } from "../../enums/transactionType"
import { Contract } from "@ethersproject/contracts"
import { getContractAddressFromTruffleArtifact } from "../../utils/getContract"

export interface UseKeep {
  (): {
    approveKeep: () => void
    fetchKeepBalance: () => void
    contract: Contract | null
  }
}

export const useKeep: UseKeep = () => {
  const { balanceOf, approve, contract } = useErc20TokenContract(
    getContractAddressFromTruffleArtifact(KeepToken),
    undefined,
    KeepToken.abi
  )

  const approveKeep = () => {
    approve(TransactionType.ApproveKeep)
  }

  const fetchKeepBalance = () => {
    balanceOf(Token.Keep)
  }

  return {
    approveKeep,
    fetchKeepBalance,
    contract,
  }
}
