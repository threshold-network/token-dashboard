import {
  BodySm,
  BoxProps,
  Text,
  useColorModeValue,
} from "@threshold-network/components"
import { FC } from "react"
import { PageTitleBadge } from "../PageTitleBadge"

export const NoBridgeFeesPageTitleBadge: FC<BoxProps> = ({ ...restProps }) => {
  const textColor = useColorModeValue("brand.500", "brand.300")
  return (
    <PageTitleBadge {...restProps}>
      <BodySm
        ml={12}
        textTransform={"uppercase"}
        color={textColor}
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
