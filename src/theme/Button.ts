import { mode } from "@chakra-ui/theme-tools"

export const Button = {
  defaultProps: {
    colorScheme: "brand",
    iconSpacing: "16px",
  },
  variants: {
    solid: (props: any) => {
      const _disabled = {
        backgroundColor: "gray.100",
        color: "gray.700",
      }

      if (props.colorScheme === "brand") {
        return {
          color: "white",
          backgroundColor: mode("brand.500", "brand.550")(props),
          _disabled,
          _hover: {
            backgroundColor: "brand.700",
            _disabled,
          },
          _active: {
            backgroundColor: mode("brand.900", "brand.800")(props),
          },
        }
      }
    },
    outline: (props: any) => {
      if (props.colorScheme === "brand") {
        return {
          color: mode("gray.700", "gray.50")(props),
          borderColor: "gray.300",
          _hover: {
            backgroundColor: mode("gray.100", "gray.700")(props),
          },

          _active: {
            backgroundColor: mode("gray.700", "gray.800")(props),
          },

          _disabled: {
            opacity: 0.25,
          },
        }
      }
    },
    ghost: (props: any) => {
      return {
        color: mode("gray.700", "gray.50")(props),
        _hover: {
          backgroundColor: mode("gray.100", "gray.700")(props),
        },
        _active: {
          backgroundColor: mode("gray.300", "gray.800")(props),
        },
        _disabled: {
          opacity: 0.25,
        },
      }
    },
    "side-bar": (props: any) => {
      const { isOpen } = props

      return {
        bg: "transparent",
        display: "flex",
        margin: "auto",
        px: "8px",
        height: (p: any) => p.height || p.h || "56px",
        width: (p: any) => (isOpen ? undefined : p.height || p.h || "56px"),
        color: mode("gray.500", "gray.300")(props),
        _hover: {
          bg: props["data-is-mobile"]
            ? undefined
            : mode("brand.50", "whiteAlpha.400")(props),
          color: props["data-is-mobile"]
            ? undefined
            : mode("brand.500", "brand.50")(props),
        },
      }
    },
  },
}
