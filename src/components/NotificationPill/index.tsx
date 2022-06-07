import { FC } from "react"
import { Box, useStyleConfig } from "@chakra-ui/react"
import {
  ThemingProps,
  HTMLChakraProps,
  omitThemingProps,
} from "@chakra-ui/system"

export interface NotificationPillProps
  extends HTMLChakraProps<"div">,
    ThemingProps<"NotificationPill"> {}

// Notification pill icon indicates a change in state.
const NotificationPill: FC<NotificationPillProps> = (props) => {
  const { variant, size } = props
  const styles = useStyleConfig("NotificationPill", {
    variant,
    size,
  } as ThemingProps)

  const restProps = omitThemingProps(props as ThemingProps)

  return <Box __css={styles} {...restProps} />
}

export default NotificationPill
