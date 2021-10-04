import { getColor } from "@chakra-ui/theme-tools"

export const getColorFromProps = (
  props: any,
  weight: number,
  fallbackColor?: string
) => {
  const { colorScheme, theme } = props
  const preferredColor = `${colorScheme}.${weight}`
  return getColor(theme, preferredColor, fallbackColor)
}
