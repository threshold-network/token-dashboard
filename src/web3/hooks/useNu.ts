// import NuCypherToken from "@threshold-network/solidity-contracts/artifacts/NuCypherToken.json"
import { Contract } from "@ethersproject/contracts"
import { useErc20TokenContract } from "./useERC20"
import { Token } from "../../enums"
import { TransactionType } from "../../enums/transactionType"

const DAI_ROPSTEN = "0xc2118d4d90b274016cB7a54c03EF52E6c537D957"

export interface UseNu {
  (): {
    approveNu: () => void
    fetchNuBalance: () => void
    contract: Contract | null
  }
}

export const useNu: UseNu = () => {
  const { balanceOf, approve, contract } = useErc20TokenContract(
    DAI_ROPSTEN,
    // NuCypherToken.address,
    undefined,
    // NuCypherToken.abi
    undefined
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
