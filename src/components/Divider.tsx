import { FC } from "react"
import {
  Box,
  Divider as ChakraDivider,
  DividerProps,
  Icon,
  IconProps,
  StylesProvider,
  useMultiStyleConfig,
  useStyles,
} from "@chakra-ui/react"
import { HTMLChakraProps } from "@chakra-ui/system"

export const DividerIcon: FC<HTMLChakraProps<"span"> & IconProps> = ({
  as,
  ...restProps
}) => {
  return <DividerCenterElement as={as} {...restProps} />
}

export const DividerCenterElement: FC<HTMLChakraProps<"div">> = ({
  children,
  as,
  ...propStyles
}) => {
  const styles = useStyles()

  return (
    <Box as={as} __css={{ ...styles.icon, ...propStyles }}>
      {children}
    </Box>
  )
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
