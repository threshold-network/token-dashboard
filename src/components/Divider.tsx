import { FC } from "react"
import {
  Icon,
  Box,
  Divider as ChakraDivider,
  DividerProps,
  useMultiStyleConfig,
  IconProps,
} from "@chakra-ui/react"
import { HTMLChakraProps } from "@chakra-ui/system"

export const DividerIcon: FC<HTMLChakraProps<"span"> & IconProps> = ({
  as,
  ...propStyles
}) => {
  const { icon: themeStyles } = useMultiStyleConfig("Divider", {})
  return <Icon as={as} __css={{ ...themeStyles, ...propStyles }} />
}

export const Divider = ({
  children,
  ...props
}: Omit<DividerProps, "orientation">) => {
  const styles = useMultiStyleConfig("Divider", {})

  return (
    <Box __css={styles.dividerWrapper}>
      {children}
      <ChakraDivider {...props} />
    </Box>
  )
}
