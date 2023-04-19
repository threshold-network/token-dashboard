import { useEffect, useRef, useState } from "react"
import { subgraphAPI } from "../../utils/subgraphAPI"

export type RecentDeposit = {
  amount: string
  address: string
  date: number
  txHash: string
}

export const useFetchRecentDeposits = (
  numberOfDeposits: number = 4
): [RecentDeposit[], boolean, string] => {
  const shouldUpdateState = useRef<boolean>(true)
  const [deposits, setDeposits] = useState<RecentDeposit[]>([])
  const [isFetching, setIsFetching] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetch = async () => {
      if (!shouldUpdateState.current) return
      setIsFetching(true)

      try {
        const data = await subgraphAPI.fetchRecentTBTCDeposits(numberOfDeposits)
        if (!shouldUpdateState.current) return

        setDeposits(
          data.map((_) => ({
            amount: _.amount,
            txHash: _.txHash,
            date: _.timestamp,
            address: _.address,
          }))
        )
      } catch (error) {
        if (!shouldUpdateState.current) return

        setError((error as unknown as Error).toString())
      } finally {
        if (!shouldUpdateState.current) return

        setIsFetching(false)
      }
    }

    fetch()

    return () => {
      shouldUpdateState.current = false
    }
  }, [numberOfDeposits])

  return [deposits, isFetching, error]
}
