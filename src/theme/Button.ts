import { mode } from "@chakra-ui/theme-tools"
import { getColorFromProps as gcfp } from "./utils"

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
    solid: (props: any) => {
      return {
        _disabled: {
          backgroundColor: gcfp(props, 500, "gray.400"),
        },
      }
    },
    outline: (props: any) => {
      return {
        borderColor: gcfp(props, 600, "gray.200"),
        backgroundColor: "transparent",
        color: gcfp(props, 600, "gray.700"),
        _active: {
          backgroundColor: gcfp(props, 600, "gray.300"),
        },
        _hover: {
          borderColor: gcfp(props, 600, "gray.200"),
          backgroundColor: gcfp(props, 50, "transparent"),
          color: gcfp(props, 600, "gray.700"),
        },
        _disabled: {
          backgroundColor: "white",
        },
      }
    },
  },
  baseStyle: (props: any) => ({
    backgroundColor: "red",
    color: "white",
    _active: {
      backgroundColor: mode("gray.600", "gray.400")(props),
    },
    _hover: {
      backgroundColor: mode("gray.700", "gray.300")(props),
    },
    _disabled: {
      backgroundColor: "gray.400",
    },
  }),
}
