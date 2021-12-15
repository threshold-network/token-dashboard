import { useState, useEffect } from "react"
import { useTheme } from "@chakra-ui/react"

type ChakraTShirtSize = "sm" | "md" | "lg" | "xl"

type BreakpointsEM = {
  [size: string]: number
}

function useChakraBreakpoint(breakpointToQuery: ChakraTShirtSize) {
  const [windowWidthEm, setWindowWidthEm] = useState(0)
  const { breakpoints } = useTheme()
  const breakpointsEm = Object.keys(breakpoints).reduce((acc, current) => {
    acc[current] = Number(breakpoints[current].slice(0, -2))
    return acc
  }, {} as BreakpointsEM)

  useEffect(() => {
    function handleResize() {
      const emSize =
        innerWidth /
        parseFloat(
          getComputedStyle(document.querySelector("body") as Element)[
            // @ts-ignore
            "font-size"
          ]
        )
      setWindowWidthEm(emSize)
    }
    window.addEventListener("resize", handleResize)
    handleResize()
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return windowWidthEm < breakpointsEm[breakpointToQuery]
}

export default useChakraBreakpoint
