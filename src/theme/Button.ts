import { getColorFromProps } from "./utils"

export const Button = {
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
