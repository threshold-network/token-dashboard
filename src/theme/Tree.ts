import {
  getColor,
  mode,
  PartsStyleFunction,
  anatomy,
  SystemStyleObject,
  SystemStyleFunction,
} from "@chakra-ui/theme-tools"

const parts = anatomy("tree").parts("node", "item", "treeItemLineToNode")

const spaceBetweenNodeLineAndItem = 5

const baseStyleNode: SystemStyleFunction = (props) => {
  const borderColor = mode("gray.500", "whiteAlpha.300")(props)

  return {
    listStyle: "none",
    margin: 0,
    padding: 0,
    ul: {
      pl: spaceBetweenNodeLineAndItem,
      ml: 3,
      position: "relative",
      _before: {
        position: "absolute",
        content: '""',
        left: 0,
        borderLeft: `1px dashed ${getColor(props.theme, borderColor)}`,
      },
    },
  }
}

const baseStyleItem: SystemStyleObject = {}

const baseStyleTreeItemLineToNode: SystemStyleFunction = (props) => {
  const borderColor = mode("gray.500", "whiteAlpha.300")(props)
  const border = `1px dashed ${getColor(props.theme, borderColor)}`

  return {
    position: "relative",
    _before: {
      position: "absolute",
      content: '""',
      bottom: "50%",
      right: "100%",
      width: spaceBetweenNodeLineAndItem,
      height: "10px",
      borderLeft: border,
      borderBottom: border,
      borderBottomLeftRadius: "0.75rem",
    },
  }
}

const baseStyle: PartsStyleFunction<typeof parts> = (props) => ({
  node: baseStyleNode(props),
  item: baseStyleItem,
  treeItemLineToNode: baseStyleTreeItemLineToNode(props),
})

export const Tree = {
  parts: parts.keys,
  baseStyle,
}
