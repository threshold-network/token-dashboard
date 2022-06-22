import { ComponentProps, FC } from "react"
import { Card } from "@threshold-network/components"
import { MintingTimeline } from "./MintingTimeline"
import { Box, StackDivider, Stack } from "@chakra-ui/react"
import { MintingFlowRouter } from "./MintingFlowRouter"

export const MintingCard: FC<ComponentProps<typeof Card>> = ({ ...props }) => {
  return (
    <Card {...props}>
      <Stack direction="row" divider={<StackDivider />} h="100%" spacing={8}>
        <Box maxW="66%" width="100%">
          <MintingFlowRouter />
        </Box>
        <Box maxW="33%" minW={"216px"} w="100%">
          <MintingTimeline />
        </Box>
      </Stack>
    </Card>
  )
}
