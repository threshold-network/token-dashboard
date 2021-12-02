import { useMemo } from "react"
import { Contract } from "@ethersproject/contracts"
import { useWeb3React } from "@web3-react/core"
import { getContract } from "../../utils/getContract"

export function useContract<T extends Contract = Contract>(
  address: string,
  ABI: any,
  withSignerIfPossible = true
): T | null {
  const { library, account, chainId } = useWeb3React()

  return useMemo(() => {
    if (!address || !ABI || !library || !chainId) {
      return null
    }

    return getContract(
      address,
      ABI,
      library,
      withSignerIfPossible && account ? account : undefined
    )
  }, [address, ABI, library, chainId, withSignerIfPossible, account]) as T
}
