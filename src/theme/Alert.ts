import { getColorFromProps } from "./utils"

const statusStyles = (props: any) => {
  if (props.status === "info") {
    return {
      container: {
        backgroundColor: "white",
        borderColor: "gray.200",
      },
      icon: {
        color: "gray.500",
      },
    }
  }
  if (props.status === "warning") {
    return {
      container: {
        backgroundColor: "yellow.100",
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
