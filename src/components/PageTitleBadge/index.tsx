import { Box, BoxProps, Text } from "@threshold-network/components"
import { FC } from "react"
import pageTitleBadgeIcon from "../../static/images/page-title-badge.svg"

export const PageTitleBadge: FC<BoxProps> = ({ children, ...restProps }) => {
  return (
    <Box
      backgroundImage={pageTitleBadgeIcon}
      backgroundSize={"cover"}
      maxWidth={"392px"}
      width={"100%"}
      height={"36px"}
      {...restProps}
    >
      {children}
    </Box>
  )
}
