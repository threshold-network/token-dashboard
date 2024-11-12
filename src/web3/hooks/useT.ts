import T from "@threshold-network/solidity-contracts/artifacts/T.json"
import { Contract } from "@ethersproject/contracts"
import { useErc20TokenContract } from "./useERC20"
import { Token, TransactionType } from "../../enums"
import { AddressZero } from "@ethersproject/constants"
import { SupportedChainIds } from "../../networks/enums/networks"
import { useDefaultOrConnectedChainId } from "../../networks/hooks/useDefaultOrConnectedChainId"

export const T_ADDRESSES = {
  // https://etherscan.io/address/0xCdF7028ceAB81fA0C6971208e83fa7872994beE5
  [SupportedChainIds.Ethereum]: "0xCdF7028ceAB81fA0C6971208e83fa7872994beE5",
  // https://sepolia.etherscan.io/address/0x46abDF5aD1726ba700794539C3dB8fE591854729
  [SupportedChainIds.Sepolia]: "0x46abDF5aD1726ba700794539C3dB8fE591854729",
  [SupportedChainIds.Localhost]: AddressZero,
} as Record<number | string, string>

export interface UseT {
  (): {
    approveT: () => void
    fetchTBalance: () => void
    contract: Contract | null
  }
}

export const useT: UseT = () => {
  const defaultOrConnectedChainId = useDefaultOrConnectedChainId()
  const { balanceOf, approve, contract } = useErc20TokenContract(
    T_ADDRESSES[Number(defaultOrConnectedChainId)],
    undefined,
    T.abi
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
