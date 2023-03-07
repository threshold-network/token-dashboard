import { FC } from "react"
import {
  ListItem,
  OrderedList,
  Box,
  StylesProvider,
  useMultiStyleConfig,
  useStyles,
} from "@threshold-network/components"

export type TimelineItemStatus = "active" | "semi-active" | "inactive"
type TimelineItemProps = {
  status: TimelineItemStatus
}

export const Timeline: FC = ({ children, ...props }) => {
  const styles = useMultiStyleConfig("Timeline", props)

  return (
    <StylesProvider value={styles}>
      <OrderedList className="timeline" sx={styles.container}>
        {children}
      </OrderedList>
    </StylesProvider>
  )
}

export const TimelineItem: FC<TimelineItemProps> = ({
  status = "inactive",
  children,
}) => {
  const styles = useStyles()

  return (
    <ListItem
      className={`timeline__item timeline__item--${status}`}
      sx={styles.item}
    >
      {children}
    </ListItem>
  )
}

export const TimelineBreakpoint: FC = ({ children }) => {
  const styles = useStyles()

  return (
    <Box className="timeline__item__breakpoint" __css={styles.itemBreakpoint}>
      {children}
    </Box>
  )
}

export const TimelineDot = () => {
  const styles = useStyles()

  return (
    <Box className="breakpoint__dot" __css={styles.itemDot}>
      <Box className="dot__background" />
    </Box>
  )
}

export const TimelineConnector = () => {
  const styles = useStyles()

  return (
    <Box className="breakpoint__connector" __css={styles.itemConnector}></Box>
  )
}

export const TimelineContent: FC = ({ children }) => {
  const styles = useStyles()

  return (
    <Box className="timeline__item__content" __css={styles.itemContent}>
      {children}
    </Box>
  )
}
