import {
  PartsStyleFunction,
  anatomy,
  SystemStyleObject,
  SystemStyleFunction,
} from "@chakra-ui/theme-tools"

const parts = anatomy("timeline").parts(
  "container",
  "item",
  "itemBreakpoint",
  "itemDot",
  "itemConnector"
)

const baseStyleContainer: SystemStyleFunction = (props) => {
  return {
    listStyle: "none",
    listStyleType: "none",
    marginInlineStart: "0",
  }
}

const baseStyleItem: SystemStyleObject = {
  "&.timeline__item": {
    flex: 1,
    "&--active": {
      ".breakpoint__dot": {
        background: "gradient.3",
        ".dot__background": {
          display: "none",
        },
      },
      ".breakpoint__connector": {
        backgroundColor: "brand.500",
        _after: {
          backgroundColor: "brand.500",
        },
      },
    },
    "&--semi-active": {
      _first: {
        ".timeline__item__breakpoint": {
          ".breakpoint__connector": {
            backgroundColor: "gray.100",
          },
        },
      },
      ".timeline__item__breakpoint": {
        ".breakpoint__connector": {
          backgroundColor: "brand.500",
        },
        ".breakpoint__dot": {
          background: "gradient.3",
          ".dot__background": {
            backgroundColor: "white",
          },
        },
      },
    },
    "&--inactive": {
      ".breakpoint__dot": {
        background: "gray.100",
        ".dot__background": {
          backgroundColor: "white",
        },
      },
    },
  },
  _first: {
    ".timeline__item__breakpoint": {
      ".breakpoint__dot": {
        mx: "unset",
      },
      ".breakpoint__connector": {
        width: "100%",
        left: "29px",
        _after: {
          content: "none",
        },
      },
    },
    ".timeline__item__content": {
      textAlign: "left",
    },
  },
  _last: {
    ".timeline__item__breakpoint": {
      flexDirection: "row-reverse",
      ".breakpoint__dot": {
        mx: "unset",
      },
      ".breakpoint__connector": {
        width: "100%",
        right: "29px",
        left: "unset",
        _after: {
          content: "none",
        },
      },
    },
    ".timeline__item__content": {
      textAlign: "right",
    },
  },
}

const baseStyleItemBreakpoint: SystemStyleObject = {
  position: "relative",
  zIndex: 1,
  display: "flex",
}

const baseStyleItemDot: SystemStyleFunction = (props) => {
  return {
    w: "30px",
    h: "30px",
    borderRadius: "50%",
    p: "1",
    mx: "auto",
    ".dot__background": {
      w: "22px",
      h: "22px",
      borderRadius: "50%",
    },
  }
}

const baseStyleItemConnector: SystemStyleObject = {
  height: 2,
  width: "50%",
  position: "absolute",
  top: "calc(50% - 4px)",
  left: "auto",
  zIndex: -1,
  backgroundColor: "gray.100",
  _after: {
    position: "absolute",
    content: `" "`,
    width: "100%",
    height: 2,
    backgroundColor: "gray.100",
    left: "100%",
  },
}

const baseStyleItemConntent: SystemStyleObject = {
  mt: 2,
  textAlign: "center",
}

const baseStyle: PartsStyleFunction<typeof parts> = (props) => ({
  container: baseStyleContainer(props),
  item: baseStyleItem,
  itemDot: baseStyleItemDot(props),
  itemConnector: baseStyleItemConnector,
  itemBreakpoint: baseStyleItemBreakpoint,
  itemContent: baseStyleItemConntent,
})

const horizontalVariant: PartsStyleFunction<typeof parts> = (props) => {
  const { colorScheme } = props

  return {
    container: {
      display: "flex",
      justifyContent: "space-between",
      py: 2,
      px: 3.5,
      backgroundColor: `${colorScheme}.50`,
      borderRadius: "0.5rem",
    },
  }
}

const verticalVariant: PartsStyleFunction<typeof parts> = (props) => {
  return {}
}

const variants = {
  horizontal: horizontalVariant,
  vertical: verticalVariant,
}

const defaultProps = {
  variant: "horizontal",
  colorScheme: "brand",
}

export const Timeline = {
  parts: parts.keys,
  baseStyle,
  variants,
  defaultProps,
}
