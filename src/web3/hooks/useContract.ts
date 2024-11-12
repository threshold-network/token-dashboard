import { useMemo } from "react"
import { useWeb3React } from "@web3-react/core"
import { Contract } from "@ethersproject/contracts"
import { getThresholdLibProvider } from "../../utils/getThresholdLib"
import { getContract } from "../../utils/getContract"

export function useContract<T extends Contract = Contract>(
  address: string,
  ABI: any,
  withSignerIfPossible = true
): T | null {
  const { library, account, chainId, active } = useWeb3React()

  return useMemo(() => {
    if (!address || !ABI) {
      return null
    }

    return getContract(
      address,
      ABI,
      active ? library : getThresholdLibProvider(),
      withSignerIfPossible && account ? account : undefined
    )
  }, [address, ABI, library, chainId, withSignerIfPossible, account]) as T
}
