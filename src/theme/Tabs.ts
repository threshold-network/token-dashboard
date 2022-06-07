import { tabsAnatomy as parts } from "@chakra-ui/anatomy"
import {
  PartsStyleFunction,
  PartsStyleObject,
  SystemStyleObject,
} from "@chakra-ui/theme-tools"
import { mode } from "@chakra-ui/theme-tools"

const baseStyleTabPanel: SystemStyleObject = {
  p: 0,
}

const baseStyle: PartsStyleFunction<typeof parts> = (props) => ({
  tabpanel: baseStyleTabPanel,
})

const variantBrand: PartsStyleFunction<typeof parts> = (props) => {
  const { colorScheme: c, orientation } = props

  return {
    tablist: {
      border: "1px solid",
      borderColor: "gray.100",
      borderRadius: "0.5rem",
      boxShadow:
        "0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05)",
      bg: mode("white", `${c}.900`)(props),
    },
    tab: {
      fontWeight: "600",
      borderColor: "transparent",
      color: mode(`${c}.700`, "white")(props),
      _selected: {
        borderRadius: "0.25rem",
        bg: mode(`${c}.50`, `${c}.300`)(props),
      },
      _disabled: {
        opacity: 0.4,
        cursor: "not-allowed",
      },
    },
  }
}

const variants = {
  brand: variantBrand,
}

const sizes: Record<string, PartsStyleObject<typeof parts>> = {
  sm: {
    tablist: {
      p: "0.25rem",
    },
    tab: {
      fontSize: "sm",
    },
  },
  md: {
    tablist: {
      p: "0.5rem",
    },
    tab: {
      fontSize: "14px",
      lineHeight: "20px",
    },
  },
  lg: {
    tablist: {
      p: "0.5rem",
    },
    tab: {
      fontSize: "18px",
      lineHeight: "28px",
    },
  },
}

const defaultProps = {
  size: "md",
  variant: "brand",
  colorScheme: "gray",
}

export const Tabs = {
  baseStyle,
  variants,
  defaultProps,
  sizes,
}
