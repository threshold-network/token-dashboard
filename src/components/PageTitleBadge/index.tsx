import { Box, BoxProps, useColorModeValue } from "@threshold-network/components"
import { FC } from "react"
import pageTitleBadgeIconLight from "../../static/images/page-title-badge-light.svg"
import pageTitleBadgeIconDark from "../../static/images/page-title-badge-dark.svg"

export const PageTitleBadge: FC<BoxProps> = ({ children, ...restProps }) => {
  const backgroundImage = useColorModeValue(
    pageTitleBadgeIconLight,
    pageTitleBadgeIconDark
  )
  return (
    <Box
      backgroundImage={backgroundImage}
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
