import { FC } from "react"
import {
  StylesProvider,
  useMultiStyleConfig,
  useStyles,
  chakra,
} from "@chakra-ui/react"

export const Tree: FC = ({ children, ...props }) => {
  const styles = useMultiStyleConfig("Tree", props)

  return <StylesProvider value={styles}>{children}</StylesProvider>
}

export const TreeNode: FC = ({ children }) => {
  const styles = useStyles()

  return <chakra.ul __css={styles.node}>{children}</chakra.ul>
}

export const TreeItem: FC = ({ children }) => {
  const styles = useStyles()

  return <chakra.li __css={styles.item}>{children}</chakra.li>
}
