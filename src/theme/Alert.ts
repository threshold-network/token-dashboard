import { getColorFromProps } from "./utils"
import { mode, transparentize } from "@chakra-ui/theme-tools"

const statusStyles = (props: any) => {
  if (props.status === "info" || !props.status) {
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
