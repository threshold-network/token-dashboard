import { useEffect, useRef, useState } from "react"
import { subgraphAPI, tBTCMetrics } from "../../utils/subgraphAPI"

export const useFetchTBTCMetrics = (): {
  metrics: tBTCMetrics
  isFetching: boolean
  error: string
} => {
  const shouldUpdateState = useRef<boolean>(true)
  const [metrics, setMetrics] = useState<tBTCMetrics>({
    totalHolders: "0",
    totalMints: 0,
  })
  const [isFetching, setIsFetching] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetch = async () => {
      if (!shouldUpdateState.current) return
      setIsFetching(true)

      try {
        const data = await subgraphAPI.fetchTBTCMetrics()
        if (!shouldUpdateState.current) return

        setMetrics(data)
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
  }, [])

  return { metrics, isFetching, error }
}
