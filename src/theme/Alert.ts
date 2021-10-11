import { getColorFromProps } from "./utils"
import { mode, transparentize } from "@chakra-ui/theme-tools"

const statusStyles = (props: any) => {
  if (props.status === "info" || !props.status) {
    if (props.variant === "solid") {
      return {
        container: {
          backgroundColor: "gray.600",
          color: "white",
          boxShadow: "md",
        },
        icon: {
          color: "gray.300",
        },
      }
    }

    return {
      container: {
        backgroundColor: mode("white", transparentize("white", 0.16))(props),
        borderColor: "gray.200",
      },
      icon: {
        color: mode("gray.500", "white")(props),
      },
    }
  }

  if (props.status === "warning") {
    if (props.variant === "solid") {
      return {
        container: {
          bg: "yellow.400",
          color: "gray.900",
          border: "none",
          boxShadow: "md",
        },
        icon: {
          color: "yellow.600",
        },
      }
    }

    return {
      container: {
        backgroundColor: mode(
          "yellow.100",
          transparentize("yellow.500", 0.16)
        )(props),
        borderColor: "yellow.500",
      },
      icon: {
        color: "yellow.500",
      },
    }
  }

  if (props.status === "success") {
    if (props.variant === "solid") {
      return {
        container: {
          backgroundColor: "green.600",
          color: "white",
          boxShadow: "md",
        },
        icon: {
          color: "green.100",
        },
      }
    }
  }

  if (props.status === "error") {
    if (props.variant === "solid") {
      return {
        container: {
          backgroundColor: "red.500",
          color: "white",
          boxShadow: "md",
        },
        icon: {
          color: "red.100",
        },
      }
    }
  }

  return {}
}

export const Alert = {
  baseStyle: (props: any) => ({
    container: {
      borderRadius: "md",
      border: "1px solid",
      borderColor: getColorFromProps(props, 500),
    },
  }),
  variants: {
    subtle: statusStyles,
    "left-accent": statusStyles,
    "top-accent": statusStyles,
    solid: statusStyles,
  },
}
