import { theme } from "@chakra-ui/react"
import { SystemStyleFunction, mode, cssVar } from "@chakra-ui/theme-tools"

const $bg = cssVar("tooltip-bg")
const $arrowBg = cssVar("popper-arrow-bg")

// TODO: move to the components repo.
const baseStyle: SystemStyleFunction = (props) => {
  const bg = mode("white", "gray.300")(props)
  const color = mode("gray.700", "gray.900")(props)

  return {
    ...theme.components.Tooltip.baseStyle,
    fontWeight: 400,
    fontSize: "14px",
    lineHeight: "20px",
    background: bg,
    [$bg.variable]: `colors.${bg}`,
    bg: [$bg.reference],
    [$arrowBg.variable]: [$bg.reference],
    color,
    p: 2,
    borderRadius: "4px",
  }
}

export const Tooltip = {
  baseStyle,
}
