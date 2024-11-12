import { Contract } from "@ethersproject/contracts"
import { useErc20TokenContract } from "./useERC20"
import { Token } from "../../enums"
import { TransactionType } from "../../enums/transactionType"
import { getArtifact } from "../../threshold-ts/utils"
import { shouldUseTestnetDevelopmentContracts } from "../../utils/getEnvVariable"
import { useIsActive } from "../../hooks/useIsActive"
import { isL1Network } from "../../networks/utils"
import { SupportedChainIds } from "../../networks/enums/networks"
export interface UseNu {
  (): {
    approveNu: () => void
    fetchNuBalance: () => void
    contract: Contract | null
  }
}

export const useNu: UseNu = () => {
  const { chainId } = useIsActive()
  const supportedChainId = isL1Network(chainId)
    ? (chainId as number)
    : SupportedChainIds.Ethereum

  const nuCupherTokenArtifact = getArtifact(
    "NuCypherToken",
    supportedChainId,
    shouldUseTestnetDevelopmentContracts
  )

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
