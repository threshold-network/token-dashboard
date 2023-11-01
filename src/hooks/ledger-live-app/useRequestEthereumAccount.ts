import { UseRequestAccountReturn, useRequestAccount } from "./useRequestAccount"

export function useRequestEthereumAccount(): UseRequestAccountReturn {
  const result = useRequestAccount("Ethereum")
  return result
}
