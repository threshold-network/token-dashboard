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
  indexedFilterParams: string[] = []
) => {
  const callbackRef = useRef<(args: any[]) => void>()
  const indexedFilterParamsLength = indexedFilterParams.length
  // An event can have up to 3 indexed params. We want to extract these values
  // from an array and use them in `useEffect` dependency array.
  const firstIndexedParam = indexedFilterParams[0] || null
  const secondIndexedParam = indexedFilterParams[1] || null
  const thirdIndexedParam = indexedFilterParams[2] || null

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
    const fileterParams = [
      firstIndexedParam,
      secondIndexedParam,
      thirdIndexedParam,
    ]
    // Remove unnecessary params, otherwise encoding topic filter will fail. For
    // example, we can't pass `[<address>, null]` if we want to filter the
    // `Transfer` event only by `from`.
    fileterParams.length = indexedFilterParamsLength
    const eventNameOrFilter: string | EventFilter =
      indexedFilterParamsLength === 0
        ? eventName
        : contract.filters[eventName](fileterParams)

    contract.on(eventNameOrFilter, cb)

    return () => {
      contract.off(eventNameOrFilter, cb)
    }
  }, [
    contract,
    eventName,
    firstIndexedParam,
    secondIndexedParam,
    thirdIndexedParam,
    indexedFilterParamsLength,
  ])
}
