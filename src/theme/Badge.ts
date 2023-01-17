import {
  mode,
  SystemStyleFunction,
  SystemStyleObject,
} from "@chakra-ui/theme-tools"
import { defaultTheme } from "@threshold-network/components"

// TODO: probably we should add a new color schema: `magic` and use
// `colorSchema` prop instead of `variant` becasue `magic` can be `solid` and
// `otuline`. See:
// https://www.figma.com/file/zZi2fYDUjWEMPQJWAt8VWv/Threshold-DS?node-id=2356%3A20781
const variantMagic: SystemStyleFunction = (props) => {
  return {
    background: "linear-gradient(120.19deg, #BD30FF 3.32%, #7D00FF 95.02%)",
    color: "white",
  }
}

const variants = {
  ...defaultTheme.components.Badge.variants,
  magic: variantMagic,
  subtle: (props: any) => {
    const { colorScheme: c, theme } = props
    const whiteAlpha200 = "rgba(255, 255, 255, 0.08);"

    const bgVariant = c === "brand" ? "75" : "50"
    // The `brand.75` color is already defined in the default theme but for some
    // reason chakra can't find the `brand.75` color.
    const brand75 = "#F2EDFF"
    const bgBrand = mode(brand75, whiteAlpha200)(props)
    const colorVariant = c === "brand" ? "100" : "200"

    return {
      bg:
        c === "brand"
          ? bgBrand
          : mode(`${c}.${bgVariant}`, whiteAlpha200)(props),
      color: mode(`${c}.500`, `${c}.${colorVariant}`)(props),
    }
  },
}

const sizes: Record<string, SystemStyleObject> = {
  sm: {
    px: "2",
    py: "1",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: "10px",
    lineHeight: "12px",
    letterSpacing: "0.075em",
    textTransform: "uppercase",
  },
}

const defaultProps = {
  colorScheme: "brand",
}

export const Badge = {
  ...defaultTheme.components.Badge,
  defaultProps,
  variants,
  sizes,
}
