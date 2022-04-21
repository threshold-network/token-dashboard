import { FC, useEffect, useRef, useState } from "react"
import {
  StylesProvider,
  useMultiStyleConfig,
  useStyles,
  chakra,
  Box,
} from "@chakra-ui/react"

const DEFAULT_LINE_HEIGHT_TO_NODE = 10

export const Tree: FC = ({ children, ...props }) => {
  const styles = useMultiStyleConfig("Tree", props)

  return <StylesProvider value={styles}>{children}</StylesProvider>
}

export const TreeNode: FC<{ isRoot?: boolean }> = ({
  children,
  isRoot = false,
}) => {
  const styles = useStyles()
  const ref = useRef<HTMLUListElement>(null)
  const [nodeLineHeight, setNodeLineHeight] = useState("100%")

  useEffect(() => {
    if (isRoot) return

    const linesToNode =
      ref.current?.lastElementChild?.getElementsByClassName("item-line-to-node")
    if (linesToNode && linesToNode?.length > 0) {
      const lineToNodeElement = linesToNode[0] as HTMLElement
      const nodeLineHeight =
        lineToNodeElement.offsetTop +
        lineToNodeElement.offsetHeight / 2 -
        DEFAULT_LINE_HEIGHT_TO_NODE

      setNodeLineHeight(`${nodeLineHeight}px`)
    }
  })

  return (
    <chakra.ul
      __css={styles.node}
      _before={isRoot ? undefined : { height: nodeLineHeight }}
      ref={ref}
    >
      {children}
    </chakra.ul>
  )
}

export const TreeItem: FC = ({ children }) => {
  const styles = useStyles()

  return <chakra.li __css={styles.item}>{children}</chakra.li>
}

export const TreeItemLineToNode: FC = ({ children }) => {
  const styles = useStyles()

  return (
    <Box __css={styles.treeItemLineToNode} className="item-line-to-node">
      {children}
    </Box>
  )
}
