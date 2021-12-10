import KeepToken from "@keep-network/keep-core/artifacts/KeepToken.json"
import { useErc20TokenContract } from "./useERC20"
import { Token } from "../../enums"
import { TransactionType } from "../../enums/transactionType"
import { Contract } from "@ethersproject/contracts"

const TETHER_ROPSTEN = "0x110a13FC3efE6A245B50102D2d79B3E76125Ae83"

export interface UseKeep {
  (): {
    approveKeep: () => void
    fetchKeepBalance: () => void
    contract: Contract | null
  }
}

export const useKeep: UseKeep = () => {
  const { balanceOf, approve, contract } = useErc20TokenContract(
    // TODO handle chainID
    // KeepToken.networks[1337].address,
    TETHER_ROPSTEN,
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
