import { useMemo } from "react"
import { useWeb3React } from "@web3-react/core"
import { Contract } from "@ethersproject/contracts"
import { getThresholdLibProvider } from "../../utils/getThresholdLib"
import { getContract } from "../../utils/getContract"
import { useIsActive } from "../../hooks/useIsActive"

export function useContract<T extends Contract = Contract>(
  address: string,
  ABI: any,
  withSignerIfPossible = true
): T | null {
  const { library } = useWeb3React()
  const { account, chainId, isActive } = useIsActive()

  return useMemo(() => {
    if (!address || !ABI) {
      return null
    }

    return getContract(
      address,
      ABI,
      isActive ? library : getThresholdLibProvider(),
      withSignerIfPossible && account ? account : undefined
    )
  }, [address, ABI, library, chainId, withSignerIfPossible, account]) as T
}
