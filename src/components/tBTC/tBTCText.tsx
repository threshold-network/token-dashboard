import { FC } from "react"
import { Box, BoxProps } from "@threshold-network/components"

export const TBTCText: FC<BoxProps> = (props) => {
  return (
    <Box as="span" {...props}>
      <Box as="span" textTransform="lowercase">
        t
      </Box>
      BTC
    </Box>
  )
}
