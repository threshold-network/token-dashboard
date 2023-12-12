import { FC } from "react"
import {
  Box,
  BoxProps,
  Card,
  Stack,
  StackDivider,
  StackProps,
  VStack,
} from "@threshold-network/components"

export const BridgeLayout: FC<StackProps> = ({ children, ...restProps }) => {
  return (
    <Stack
      as={Card}
      direction={{
        base: "column",
        xl: "row",
      }}
      divider={<StackDivider />}
      spacing={8}
      minW="0"
      alignItems="flex-start"
      gap="unset"
      position="relative"
      {...restProps}
    >
      {children}
    </Stack>
  )
}

export const BridgeLayoutMainSection: FC<BoxProps> = ({
  children,
  ...restProps
}) => {
  return (
    <Box
      w={{
        base: "100%",
        xl: "66%",
      }}
      {...restProps}
    >
      {children}
    </Box>
  )
}

export const BridgeLayoutAsideSection: FC<BoxProps> = ({
  children,
  ...restProps
}) => {
  return (
    <VStack
      as="aside"
      w={{
        base: "100%",
        xl: "33%",
      }}
      minW={"216px"}
      spacing="8"
      alignItems="flex-start"
      {...restProps}
    >
      {children}
    </VStack>
  )
}
