import { mode, transparentize } from "@chakra-ui/theme-tools"
import { getColorFromProps } from "./utils"

export const Badge = {
  baseStyle: {
    px: "12px",
    borderRadius: "full",
  },
  defaultProps: {
    variant: "solid",
    fontSize: "md",
    colorScheme: "brand",
  },
  variants: {
    solid: (props: any) => {
      return {
        color: "white",
        backgroundColor: getColorFromProps(props, 500, "black"),
      }
    },
    outline: (props: any) => {
      return {
        boxShadow: `inset 0 0 0px 1px ${getColorFromProps(
          props,
          500,
          "black"
        )}`,
      }
    },
    subtle: (props: any) => {
      const lightModeColor = getColorFromProps(props, 800, "black")
      const darkModeColor = getColorFromProps(props, 200, "white")
      const lightModeBg = getColorFromProps(props, 100, "gray.100")
      const darkModeBg = transparentize(
        getColorFromProps(props, 50, "gray.50"),
        0.16
      )(props.theme)

      return {
        backgroundColor: mode(lightModeBg, darkModeBg)(props),
        color: mode(lightModeColor, darkModeColor)(props),
      }
    },
  },
}
