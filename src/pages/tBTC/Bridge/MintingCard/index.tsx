import { ComponentProps, FC } from "react"
import { Card } from "@threshold-network/components"
import { MintingTimeline } from "./MintingTimeline"
import { Box, StackDivider, Stack } from "@chakra-ui/react"
import { MintingFlowRouter } from "./MintingFlowRouter"

export const MintingCard: FC<ComponentProps<typeof Card>> = ({ ...props }) => {
  return (
    <Card {...props}>
      <Stack
        direction={{
          base: "column",
          md: "row",
          lg: "column",
          xl: "row",
        }}
        divider={<StackDivider />}
        h="100%"
        spacing={8}
      >
        <Box
          w={{
            base: "100%",
            md: "66%",
            lg: "100%",
            xl: "66%",
          }}
        >
          <MintingFlowRouter />
        </Box>
        <Box
          w={{
            base: "100%",
            md: "33%",
            lg: "100%",
            xl: "33%",
          }}
          minW={"216px"}
        >
          <MintingTimeline />
        </Box>
      </Stack>
    </Card>
  )
}
