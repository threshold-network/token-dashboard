import { ComponentProps, FC } from "react"
import { BodyLg, Box, useColorModeValue } from "@threshold-network/components"

export const BridgeProcessCardSubTitle: FC<
  {
    stepText: string
    subTitle?: string
  } & ComponentProps<typeof BodyLg>
> = ({ stepText, subTitle, children, ...restProps }) => {
  return (
    <BodyLg mb={4} {...restProps}>
      <Box
        as="span"
        fontWeight="bold"
        color={useColorModeValue("brand.500", "brand.300")}
      >
        {stepText}
      </Box>
      {subTitle ? ` - ${subTitle}` : children}
    </BodyLg>
  )
}
