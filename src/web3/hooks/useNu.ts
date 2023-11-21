import { Contract } from "@ethersproject/contracts"
import { useErc20TokenContract } from "./useERC20"
import { Token } from "../../enums"
import { TransactionType } from "../../enums/transactionType"
import { getArtifact } from "../../threshold-ts/utils"
import {
  shouldUseTestnetDevelopmentContracts,
  supportedChainId,
} from "../../utils/getEnvVariable"

const nuCupherTokenArtifact = getArtifact(
  "NuCypherToken",
  supportedChainId,
  shouldUseTestnetDevelopmentContracts
)
export interface UseNu {
  (): {
    approveNu: () => void
    fetchNuBalance: () => void
    contract: Contract | null
  }
}

export const useNu: UseNu = () => {
  const { balanceOf, approve, contract } = useErc20TokenContract(
    nuCupherTokenArtifact.address,
    undefined,
    nuCupherTokenArtifact.abi
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
