import { mode } from "@chakra-ui/theme-tools"
import { getColorFromProps as gcfp } from "./utils"
import { theme } from "@chakra-ui/react"

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
    primary: (props: any) => {
      return {
        ...theme.components.Button.variants.solid(props),
        _disabled: {
          backgroundColor: gcfp(props, 500, "gray.400"),
        },
      }
    },
    secondary: (props: any) => {
      return {
        ...theme.components.Button.variants.outline(props),
        borderColor:
          props.colorScheme === "brand"
            ? "gray.400"
            : gcfp(props, 600, "gray.200"),
        backgroundColor: "transparent",
        color: mode(
          gcfp(props, 600, "gray.700"),
          gcfp(props, 100, "white")
        )(props),
        _active: {
          backgroundColor: gcfp(props, 600, "gray.300"),
        },
        _hover: {
          borderColor:
            props.colorScheme === "brand"
              ? "gray.400"
              : gcfp(props, 600, "gray.200"),
          backgroundColor:
            props.colorScheme === "brand"
              ? "gray.100"
              : gcfp(props, 50, "transparent"),
          color: gcfp(props, 600, "gray.700"),
        },
        _disabled: {
          color: gcfp(props, 600, "gray.700"),
          backgroundColor: "white",
          borderColor:
            props.colorScheme === "brand"
              ? "gray.200"
              : gcfp(props, 400, "gray.200"),
        },
      }
    },
    tertiary: (props: any) => {
      const ghostStyles = theme.components.Button.variants.ghost(props)

      return {
        ...ghostStyles,
        _hover: {
          bg: props.colorScheme === "brand" ? "gray.100" : gcfp(props, 50),
        },
        _active: {
          bg: props.colorScheme === "brand" ? "gray.300" : gcfp(props, 100),
        },
        _disabled: {
          bg: "transparent",
        },
      }
    },
  },
  baseStyle: (props: any) => ({
    backgroundColor: mode("gray.600", "gray.200")(props),
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
