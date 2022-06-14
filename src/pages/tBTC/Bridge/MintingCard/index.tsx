import { ComponentProps, FC } from "react"
import Card from "../../../../components/Card"
import { MintingTimeline } from "./MintingTimeline"
import { Box, StackDivider, Stack } from "@chakra-ui/react"
import { MintingFlowRouter } from "./MintingFlowRouter"

export const MintingCard: FC<ComponentProps<typeof Card>> = ({ ...props }) => {
  return (
    <Card {...props}>
      <Stack direction="row" divider={<StackDivider />} h="100%">
        <Box w={2 / 3}>
          <MintingFlowRouter />
        </Box>
        <Box w={1 / 3}>
          <MintingTimeline />
        </Box>
      </Stack>
    </Card>
  )
}
