import { ComponentProps, FC } from "react"
import { Card, Box, StackDivider, Stack } from "@threshold-network/components"
import { UnmintingTimeline } from "./UnmintingTimeline"
import { UnmintingFlowRouter } from "./UnmintingFlowRouter"

export const UnmintingCard: FC<ComponentProps<typeof Card>> = ({
  ...props
}) => {
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
          <UnmintingFlowRouter />
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
          <UnmintingTimeline />
        </Box>
      </Stack>
    </Card>
  )
}
