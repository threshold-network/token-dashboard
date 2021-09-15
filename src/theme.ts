import { extendTheme } from "@chakra-ui/react"

const colors = {
  yellow: {
    50: "#FFFBE6",
    100: "#FFF1B8",
    200: "#FFE58F",
    300: "#FFD666",
    400: "#FFC53D",
    500: "#FAAD14",
    600: "#D48806",
    700: "#AD6800",
    800: "#874D00",
    900: "#613400",
  },
  red: {
    400: "#F55B4B",
    500: "#E53939",
    600: "#BF3030",
    700: "#992626",
    800: "#731D1D",
    900: "#4C1316",
  },
}

const getColorFromProps = (
  props: any,
  weight: number,
  defaultColorScheme = "brand"
) => {
  return props?.colorScheme !== defaultColorScheme
    ? props?.theme?.colors[props?.colorScheme][weight]
    : null
}

const Button = {
  defaultProps: {
    colorScheme: "brand",
  },
  variants: {
    link: {
      backgroundColor: "transparent",
      _hover: {
        backgroundColor: "transparent",
      },
      _active: {
        backgroundColor: "transparent",
      },
    },
    brand: (props: any) => {
      return {
        _disabled: {
          backgroundColor: getColorFromProps(props, 500) || "gray.400",
        },
      }
    },
    solid: (props: any) => {
      return {
        _disabled: {
          backgroundColor: getColorFromProps(props, 500) || "gray.400",
        },
      }
    },
    outline: (props: any) => {
      const colorScheme600 = getColorFromProps(props, 600)

      return {
        borderColor: colorScheme600 || "gray.200",
        backgroundColor: "transparent",
        color: colorScheme600 || "gray.700",
        _active: {
          backgroundColor: colorScheme600 || "gray.300",
        },
        _hover: {
          borderColor: colorScheme600 || "gray.200",
          backgroundColor: getColorFromProps(props, 50) || "transparent",
          color: colorScheme600 || "gray.700",
        },
        _disabled: {
          backgroundColor: "white",
        },
      }
    },
  },
  baseStyle: {
    backgroundColor: "gray.600",
    color: "white",
    _active: {
      backgroundColor: "gray.900",
    },
    _hover: {
      backgroundColor: "gray.700",
    },
    _disabled: {
      backgroundColor: "gray.400",
    },
  },
}

const Badge = {
  defaultProps: {
    variant: "solid",
    size: "md",
    colorScheme: "brand",
  },
  sizes: {
    sm: {
      fontSize: "14px",
      lineHeight: "16px",
      px: "8px",
      py: "4px",
    },
    md: {
      fontSize: "16px",
      lineHeight: "24px",
      px: "12px",
      py: "6px",
    },
  },
  variants: {
    solid: (props: any) => ({
      color: "white",
      backgroundColor: getColorFromProps(props, 500) || "black",
    }),
    outline: (props: any) => {
      return {
        boxShadow: `inset 0 0 0px 1px ${
          getColorFromProps(props, 500) || "black"
        }`,
      }
    },
  },
  baseStyle: {
    borderRadius: "full",
  },
}

const theme = extendTheme({
  colors,
  components: {
    Button,
    Badge,
  },
})

export default theme
