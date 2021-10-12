import { alertAnatomy } from "@chakra-ui/anatomy"
import {
  mode,
  PartsStyleFunction,
  transparentize,
} from "@chakra-ui/theme-tools"
import { getColorFromProps } from "./utils"

const statusWarning = (props: any) => {
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

const statusInfo = (props: any) => {
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

const statusStyles = (props: any) => {
  const { status } = props

  const styleMap: { [status: string]: any } = {
    info: statusInfo(props),
    warning: statusWarning(props),
  }

  return styleMap[status] || {}
}

const variantSolid: PartsStyleFunction<typeof alertAnatomy> = (props) => {
  const { status } = props

  const bgMap: { [status: string]: string } = {
    warning: "yellow.400",
    success: "green.600",
    error: "red.500",
    info: "gray.600",
  }
  const colorMap: { [status: string]: string } = {
    warning: "gray.900",
    success: "white",
    error: "white",
    info: "white",
  }
  const iconColorMap: { [status: string]: string } = {
    warning: "yellow.600",
    success: "green.100",
    error: "red.100",
    info: mode("gray.500", "white")(props),
  }

  return {
    container: {
      border: "none",
      boxShadow: "md",
      bg: bgMap[status],
      color: colorMap[status],
    },
    icon: {
      color: iconColorMap[status],
    },
  }
}

export const Alert = {
  baseStyle: (props: any) => ({
    icon: {
      alignSelf: "flex-start",
    },
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
    solid: variantSolid,
  },
}
