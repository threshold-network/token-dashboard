import { FC, useEffect, useState } from "react"
import {
  Box,
  Countdown,
  H4,
  LabelSm,
  Skeleton,
} from "@threshold-network/components"
import { useTbtcState } from "../../../../hooks/useTbtcState"

export const SweepTimer: FC = () => {
  const { nextBridgeCrossingInUnix, updateState } = useTbtcState()

  const onComplete = (targetTimeInUnix: number) => {
    const currentTimeInSeconds = Math.floor(Date.now() / 1000)
    updateState("nextBridgeCrossingInUnix", currentTimeInSeconds + 10)
  }

  // TODO: this is a hack to make the timer load after 3 seconds. We need to
  // pull this from the contract
  useEffect(() => {
    const timer = setTimeout(() => {
      const currentTimeInSeconds = Math.floor(Date.now() / 1000)
      updateState("nextBridgeCrossingInUnix", currentTimeInSeconds + 10)
    }, 3000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <Box mt={4}>
      <LabelSm>Next Bridge Crossing</LabelSm>

      <Skeleton isLoaded={!!nextBridgeCrossingInUnix}>
        <Countdown
          targetDateInUnix={
            nextBridgeCrossingInUnix ? nextBridgeCrossingInUnix : 0
          }
          onComplete={onComplete}
          withLeadingZeroes={false}
        >
          {(days, hours, minutes, seconds) => {
            return (
              <H4 color="brand.500" fontWeight={800}>
                {hours} : {minutes} : {seconds}
              </H4>
            )
          }}
        </Countdown>
      </Skeleton>
    </Box>
  )
}
