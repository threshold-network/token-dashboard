import { FC } from "react"
import { Box } from "@chakra-ui/react"
import { LabelSm } from "@threshold-network/components"
import { SweepTimer } from "./SweepTimer"

export const TbtcTimeline: FC = ({ ...props }) => {
  return (
    <Box>
      <LabelSm mb="5">Timeline</LabelSm>
      <SweepTimer />
    </Box>
  )
}
