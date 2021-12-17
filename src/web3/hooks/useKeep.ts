import KeepToken from "@keep-network/keep-core/artifacts/KeepToken.json"
import { useErc20TokenContract } from "./useERC20"
import { Token } from "../../enums"
import { TransactionType } from "../../enums/transactionType"
import { Contract } from "@ethersproject/contracts"

const TETHER_ROPSTEN = "0x110a13FC3efE6A245B50102D2d79B3E76125Ae83"

// The artifacts from `@keep-network/keep-core` for a given build only support a
// single network id.
const networks = Object.keys(KeepToken.networks) as Array<
  keyof typeof KeepToken.networks
>

const KEEP_TOKEN_ADDRESS =
  networks && networks.length > 0
    ? (KeepToken.networks[networks[0]] as { address: string }).address
    : null

console.log("KeepToken", KeepToken)

export interface UseKeep {
  (): {
    approveKeep: () => void
    fetchKeepBalance: () => void
    contract: Contract | null
  }
}

export const useKeep: UseKeep = () => {
  const { balanceOf, approve, contract } = useErc20TokenContract(
    TETHER_ROPSTEN,
    // KEEP_TOKEN_ADDRESS as string,
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
