import { ComponentProps, FC } from "react"
import Card from "../../../../components/Card"
import { Label3 } from "../../../../components/Typography"
import { MintingTimeline } from "./MintingTimeline"
import { Box, StackDivider, Stack } from "@chakra-ui/react"

export const MintingCard: FC<ComponentProps<typeof Card>> = ({ ...props }) => {
  return (
    <Card {...props}>
      <Stack direction="row" divider={<StackDivider />} h="100%">
        <Box w={2 / 3}>
          <Label3 mb="5">Minting Card</Label3>
        </Box>
        <Box w={1 / 3}>
          <MintingTimeline />
        </Box>
      </Stack>
    </Card>
  )
}
