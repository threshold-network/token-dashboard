import { useRequestAccount, UseRequestAccountReturn } from "./useRequestAccount"

export function useRequestBitcoinAccount(): UseRequestAccountReturn {
  const result = useRequestAccount("Bitcoin")
  return result
}
