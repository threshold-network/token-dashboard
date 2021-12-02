import { useEffect, useRef } from "react"
import { Contract, EventFilter } from "@ethersproject/contracts"

// TODO: types
export const useSubscribeToContractEvent = (
  contract: Contract | null,
  eventName: string,
  callback: (args: any[]) => void,
  // The indexed parameters must be in the correct order. For example if we want
  // to filter the `Transfer` event of ERC20 contract, which is implemented as
  // `event Transfer(address indexed from, address indexed to, uint256 value);`,
  // by `to` param we need to pass `[null, <address>]`.
  indexedFilterParams: any[] = []
) => {
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
      callbackRef.current(...args)
    }

    const eventNameOrFilter: string | EventFilter =
      indexedFilterParams.length === 0
        ? eventName
        : contract.filters[eventName](...indexedFilterParams)

    contract.on(eventNameOrFilter, cb)

    return () => {
      contract.off(eventNameOrFilter, cb)
    }
  }, [contract, indexedFilterParams, eventName])
}
