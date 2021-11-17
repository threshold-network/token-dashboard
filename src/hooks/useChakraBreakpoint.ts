import { useState, useEffect } from "react"
import { useTheme } from "@chakra-ui/react"

function useChakraBreakpoint(breakpointToQuery: "sm" | "md" | "lg" | "xl") {
  const [windowWidthPx, setWindowWidth] = useState(0)

  const { breakpoints } = useTheme()
  const breakpointsEm = Object.keys(breakpoints).reduce((acc, current) => {
    // @ts-ignore
    acc[current] = Number(breakpoints[current].slice(0, -2))
    return acc
  }, {})

  useEffect(() => {
    function handleResize() {
      const emSize =
        innerWidth /
        parseFloat(
          // @ts-ignore
          getComputedStyle(document.querySelector("body"))["font-size"]
        )
      setWindowWidth(emSize)
    }
    window.addEventListener("resize", handleResize)
    handleResize()
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // @ts-ignore
  return windowWidthPx < breakpointsEm[breakpointToQuery]
}

export default useChakraBreakpoint
