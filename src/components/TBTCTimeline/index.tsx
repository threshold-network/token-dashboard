import { FC } from "react"
import { Box } from "@chakra-ui/react"
import { Label3 } from "../Typography"
import { SweepTimer } from "./SweepTimer"

export const TbtcTimeline: FC = ({ ...props }) => {
  return (
    <Box>
      <Label3 mb="5">Timeline</Label3>
      <SweepTimer />
    </Box>
  )
}
