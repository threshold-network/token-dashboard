import { AddressZero } from "@ethersproject/constants"
import { SupportedChainIds } from "../../networks/enums/networks"
import { useContract } from "./useContract"
import KeepBonding from "@keep-network/keep-ecdsa/artifacts/KeepBonding.json"
import { useConnectedOrDefaultChainId } from "../../networks/hooks/useConnectedOrDefaultChainId"

const KEEP_BONDING_ADDRESSES = {
  // https://etherscan.io/address/0x27321f84704a599aB740281E285cc4463d89A3D5
  [SupportedChainIds.Ethereum]: "0x27321f84704a599aB740281E285cc4463d89A3D5",
  // TODO: Set local address- how to resolve it in local network?
  [SupportedChainIds.Localhost]: AddressZero,
} as Record<number, string>

export const useKeepBondingContract = () => {
  const defaultOrConnectedChainId = useConnectedOrDefaultChainId()

  return useContract(
    KEEP_BONDING_ADDRESSES[Number(defaultOrConnectedChainId)],
    KeepBonding.abi
  )
}
