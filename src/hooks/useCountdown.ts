import { useEffect, useState } from "react"
import {
  dateAs,
  dateToUnixTimestamp,
  ONE_SEC_IN_MILISECONDS,
} from "../utils/date"

const useCountdown = (targetDateInUnix: number) => {
  const [diff, setDiff] = useState(targetDateInUnix - dateToUnixTimestamp())

  useEffect(() => {
    const interval = setInterval(() => {
      const diff = targetDateInUnix - dateToUnixTimestamp()
      if (diff === 0) {
        clearInterval(interval)
      }

      setDiff(diff)
    }, ONE_SEC_IN_MILISECONDS)

    return () => clearInterval(interval)
  }, [targetDateInUnix])

  return dateAs(diff)
}

export { useCountdown }
