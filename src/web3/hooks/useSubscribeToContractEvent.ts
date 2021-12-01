import { useEffect, useRef } from "react"
import { Contract, EventFilter } from "@ethersproject/contracts"

export const useSubscribeToContractEvent = (
  contract: Contract | null,
  eventName: string,
  callback: (args: any[]) => void,
  // The indexed parameters must be in the correct order.
  contractIndexingParams: any[] = []
) => {
  // const { library, account, chainId } = useWeb3React()
  const callbackRef = useRef<(args: any[]) => void>()

  useEffect(() => {
    callbackRef.current = callback // Update ref to the latest callback.
  }, [callback])

  useEffect(() => {
    if (!contract) {
      return
    }
    // @ts-ignore
    function cb(...args) {
      // @ts-ignore
      callback(...args)
    }
    const eventNameOrFilter: string | EventFilter =
      contractIndexingParams.length === 0
        ? eventName
        : contract.filters[eventName](...contractIndexingParams)

    contract.on(eventNameOrFilter, cb)

    return () => {
      contract.off(eventNameOrFilter, cb)
    }
  }, [contract])
}
