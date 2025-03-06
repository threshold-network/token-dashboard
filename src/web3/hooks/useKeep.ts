import KeepToken from "@keep-network/keep-core/artifacts/KeepToken.json"
import { useErc20TokenContract } from "./useERC20"
import { Token } from "../../enums"
import { TransactionType } from "../../enums/transactionType"
import { Contract } from "@ethersproject/contracts"
import { AddressZero } from "@ethersproject/constants"
import { SupportedChainIds } from "../../networks/enums/networks"
import { useConnectedOrDefaultChainId } from "../../networks/hooks/useConnectedOrDefaultChainId"

export const KEEP_ADDRESSES = {
  // https://etherscan.io/address/0x85Eee30c52B0b379b046Fb0F85F4f3Dc3009aFEC
  [SupportedChainIds.Ethereum]: "0x85Eee30c52B0b379b046Fb0F85F4f3Dc3009aFEC",
  // https://sepolia.etherscan.io/address/0xa07f4E37C2E7089Ea3AFffbe51A6A281833a4D14
  [SupportedChainIds.Sepolia]: "0xa07f4E37C2E7089Ea3AFffbe51A6A281833a4D14",
  [SupportedChainIds.Localhost]: AddressZero,
} as Record<number | string, string>

export interface UseKeep {
  (): {
    approveKeep: () => void
    fetchKeepBalance: () => void
    contract: Contract | null
  }
}

export const useKeep: UseKeep = () => {
  const defaultOrConnectedChainId = useConnectedOrDefaultChainId()

  const { balanceOf, approve, contract } = useErc20TokenContract(
    KEEP_ADDRESSES[Number(defaultOrConnectedChainId)],
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
