import { useRef, useEffect } from "react"

export const usePrevious = <T>(value: T): T => {
  const valueRef = useRef(value)
  useEffect(() => {
    valueRef.current = value
  }, [value])

  return valueRef.current
}
