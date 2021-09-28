import React from "react"
import {
  Icon,
  Box,
  Divider as ChakraDivider,
  DividerProps,
} from "@chakra-ui/react"

const baseIconSize = 24
const mdIconSize = 40

export const Divider = ({
  icon,
  ...props
}: Omit<DividerProps, "orientation"> & { icon?: any }) => (
  <Box
    position="relative"
    my={{ base: icon ? 3 : undefined, md: icon ? 5 : undefined }}
  >
    {icon && (
      <Icon
        bg="white"
        as={icon}
        color="gray.600"
        position="absolute"
        left={0}
        right={0}
        margin="auto"
        top={{
          base: `${(-1 * baseIconSize) / 2}px`,
          md: `${(-1 * mdIconSize) / 2}px`,
        }}
        zIndex={1}
        w={{ base: `${baseIconSize}px`, md: `${mdIconSize}px` }}
        h={{ base: `${baseIconSize}px`, md: `${mdIconSize}px` }}
      />
    )}
    <ChakraDivider {...props} />
  </Box>
)
