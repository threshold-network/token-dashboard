import { useMemo } from "react"
import { Contract } from "@ethersproject/contracts"
import { useWeb3React } from "@web3-react/core"
import ERC20_ABI from "../abi/ERC20.json"
import { getContract } from "../../utils/getContract"
// import { Erc20 } from "../abis/types"

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

export function useErc20TokenContract(
  tokenAddress: string,
  withSignerIfPossible?: boolean
) {
  // TODO: Figure out how to type the ERC20 contract
  // return useContract<Erc20>(tokenAddress, ERC20_ABI, withSignerIfPossible)
  return useContract(tokenAddress, ERC20_ABI, withSignerIfPossible)
}
