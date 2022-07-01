import { ComponentProps, FC } from "react"
import { Card, Box, StackDivider, Stack } from "@threshold-network/components"
import { UnmintingTimeline } from "./UnmintingTimeline"
import { UnmintingFlowRouter } from "./UnmintingFlowRouter"

export const UnmintingCard: FC<ComponentProps<typeof Card>> = ({
  ...props
}) => {
  return (
    <Card {...props}>
      <Stack direction="row" divider={<StackDivider />} h="100%" spacing={8}>
        <Box maxW="66%" width="100%">
          <UnmintingFlowRouter />
        </Box>
        <Box maxW="33%" minW={"216px"} w="100%">
          <UnmintingTimeline />
        </Box>
      </Stack>
    </Card>
  )
}
