import { FC, useEffect, useState } from "react"
import { Box, H4, LabelSm, Skeleton } from "@threshold-network/components"
import Countdown from "react-countdown"
import { useTbtcState } from "../../../../hooks/useTbtcState"

const CountdownRenderer: FC<any> = ({ hours, minutes, seconds, completed }) => {
  if (completed) {
    // Render a completed state
    return <Box>Countdown complete</Box>
  } else {
    // Render a countdown
    return (
      <H4 color="brand.500" fontWeight={800}>
        {hours} : {minutes} : {seconds}
      </H4>
    )
  }
}

export const SweepTimer: FC = () => {
  const { nextBridgeCrossing, updateState } = useTbtcState()
  // const [days, hours, minutes, seconds] = useCountdown(nextBridgeCrossing)

  // TODO: this is a hack to make the timer load after 3 seconds. We need to pull this from the contract
  useEffect(() => {
    const timer = setTimeout(() => {
      updateState("nextBridgeCrossing", Date.now() + 10000)
    }, 3000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <Box mt={4}>
      <LabelSm>Next Bridge Crossing</LabelSm>

      <Skeleton isLoaded={!!nextBridgeCrossing}>
        <Countdown
          key={Date.now()}
          date={nextBridgeCrossing}
          onComplete={() => {
            updateState("nextBridgeCrossing", Date.now() + 10000)
          }}
          renderer={CountdownRenderer}
        />
      </Skeleton>
    </Box>
  )
}
