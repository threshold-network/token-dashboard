import { FC } from "react"
import {
  Box,
  HStack,
  StackProps,
  ThemingProps,
  useStyleConfig,
} from "@threshold-network/components"

type DotsLoadingIndicatorProps = StackProps & Omit<ThemingProps, "orientation">

export const DotsLoadingIndicator: FC<DotsLoadingIndicatorProps> = ({
  colorScheme = "brand",
  size = "sm",
  ...restProps
}) => {
  const styles = useStyleConfig("DotsLoadingIndicator", {
    colorScheme,
    size,
  })

  return (
    <HStack spacing="4" {...restProps}>
      <Box __css={styles} />
      <Box __css={styles} />
      <Box __css={styles} />
    </HStack>
  )
}
