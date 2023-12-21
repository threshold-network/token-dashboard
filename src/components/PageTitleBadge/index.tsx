import { Box, BoxProps, Text } from "@threshold-network/components"
import { FC } from "react"
import pageTitleBadge from "../../static/images/page-title-badge.png"

export const PageTitleBadge: FC<BoxProps> = ({ children, ...restProps }) => {
  return (
    <Box
      backgroundImage={pageTitleBadge}
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
