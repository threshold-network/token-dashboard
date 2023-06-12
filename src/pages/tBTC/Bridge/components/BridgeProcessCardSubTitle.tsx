import { ComponentProps, FC } from "react"
import { BodyLg, Box } from "@threshold-network/components"

export const BridgeProcessCardSubTitle: FC<
  {
    stepText: string
    subTitle: string | JSX.Element
  } & ComponentProps<typeof BodyLg>
> = ({ stepText, subTitle, ...restProps }) => {
  return (
    <BodyLg mb={4} {...restProps}>
      <Box as="span" fontWeight="bold" color="brand.500">
        {stepText}
      </Box>{" "}
      - {subTitle}
    </BodyLg>
  )
}
