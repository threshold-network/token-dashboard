import { useMemo } from "react"
import { useWeb3React } from "@web3-react/core"
import { Contract } from "@ethersproject/contracts"
import { JsonRpcProvider } from "@ethersproject/providers"
import { getEnvVariable } from "../../utils/getEnvVariable"
import { getContract } from "../../utils/getContract"
import { EnvVariable } from "../../enums"

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
      active
        ? library
        : new JsonRpcProvider(getEnvVariable(EnvVariable.ETH_HOSTNAME_HTTP)),
      withSignerIfPossible && account ? account : undefined
    )
  }, [address, ABI, library, chainId, withSignerIfPossible, account]) as T
}
