import { FC } from "react"
import {
  Icon,
  Box,
  Divider as ChakraDivider,
  DividerProps,
  useMultiStyleConfig,
  IconProps,
  StylesProvider,
  useStyles,
} from "@chakra-ui/react"
import { HTMLChakraProps } from "@chakra-ui/system"

export const DividerIcon: FC<HTMLChakraProps<"span"> & IconProps> = ({
  as,
  ...propStyles
}) => {
  const styles = useStyles()
  return <Icon as={as} __css={{ ...styles.icon, ...propStyles }} />
}

export const Divider = ({
  children,
  ...props
}: Omit<DividerProps, "orientation">) => {
  const styles = useMultiStyleConfig("Divider", {})

  return (
    <Box __css={styles.dividerWrapper}>
      <StylesProvider value={styles}>
        {children}
        <ChakraDivider {...props} />
      </StylesProvider>
    </Box>
  )
}
