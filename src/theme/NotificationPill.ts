import type {
  SystemStyleFunction,
  SystemStyleObject,
} from "@chakra-ui/theme-tools"
import { ThemeUtils } from "@threshold-network/components"

const baseStyle: SystemStyleObject = {
  borderRadius: "100%",
}

const sizes: Record<string, SystemStyleObject> = {
  lg: {
    h: "24px",
    w: "24px",
  },
  md: {
    h: "16px",
    w: "16px",
  },
  sm: {
    h: "8px",
    w: "8px",
  },
}

const variantDisabled: SystemStyleFunction = (props) => {
  const { colorScheme } = props

  return {
    bg: `${colorScheme}.100`,
  }
}

const variantSolid: SystemStyleFunction = (props) => {
  const { colorScheme } = props

  const colorWeight = colorScheme === "grey" ? 800 : 500

  return {
    bg: `${colorScheme}.${colorWeight}`,
  }
}

const variantGradient: SystemStyleFunction = (props) => {
  const from = ThemeUtils.getColorFromProps(props, 600)
  const to = ThemeUtils.getColorFromProps(props, 500)

  return {
    bg: `linear-gradient(120.19deg, ${from} 3.32%, ${to} 95.02%)`,
  }
}

const variants = {
  solid: variantSolid,
  gradient: variantGradient,
  disabled: variantDisabled,
}

const defaultProps = {
  size: "md",
  variant: "solid",
  colorScheme: "brand",
}

export const NotificationPill = {
  baseStyle,
  sizes,
  variants,
  defaultProps,
}
