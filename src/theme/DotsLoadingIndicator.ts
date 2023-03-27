import {
  SystemStyleObject,
  SystemStyleFunction,
  getColor,
} from "@chakra-ui/theme-tools"
import { keyframes } from "@threshold-network/components"

const getDefaultAnimation = (
  activeColor: string,
  inactiveColor: string
) => keyframes`
  0% {
    background-color: ${activeColor};
  }
  50%, 100% {
    background-color: ${inactiveColor};
    opacity: 0.2
  }
`

const getInactiveColorScheme = (colorScheme: string) => {
  if (colorScheme === "brand") {
    return "gray"
  }

  return "gray"
}

const baseDotStyles: SystemStyleObject = {
  borderRadius: "50%",
}

const baseStyle: SystemStyleFunction = (props) => {
  const { colorScheme, theme } = props
  const activeColor = getColor(theme, `${colorScheme}.500`)
  const inactiveColor = getColor(
    theme,
    `${getInactiveColorScheme(colorScheme)}.100`
  )

  const animation = `${getDefaultAnimation(
    activeColor,
    inactiveColor
  )} 1s infinite alternate`

  return {
    position: "relative",
    borderRadius: "50%",
    backgroundColor: inactiveColor,
    ...baseDotStyles,
    animation,
    animationDelay: "0.5s",
    _first: {
      animationDelay: "0s",
    },
    _last: {
      animationDelay: "1s",
    },
  }
}

const sizes: Record<string, SystemStyleObject> = {
  sm: {
    w: "16px",
    h: "16px",
  },
}

const defaultProps = {
  colorScheme: "brand",
  size: "sm",
}

export const DotsLoadingIndicator = {
  baseStyle,
  sizes,
  defaultProps,
}
