import { BodySm, BoxProps, Text } from "@threshold-network/components"
import { FC } from "react"
import { PageTitleBadge } from "../PageTitleBadge"

export const NoBridgeFeesPageTitleBadge: FC<BoxProps> = ({ ...restProps }) => {
  return (
    <PageTitleBadge {...restProps}>
      <BodySm
        ml={12}
        textTransform={"uppercase"}
        color={"brand.500"}
        letterSpacing={".5px"}
      >
        <Text as="span" fontWeight={"bold"}>
          No Bridge fees
        </Text>{" "}
        until february 10, 2024!
      </BodySm>
    </PageTitleBadge>
  )
}
