import { FC } from "react"
import { Stack } from "@chakra-ui/react"
import { Body2 } from "../../../../components/Typography"

export const TbtcMintingCardSubTitle: FC<{
  stepText: string
  subTitle: string
}> = ({ stepText, subTitle }) => {
  return (
    <Stack direction="row">
      <Body2 fontWeight="bold" color="brand.700">
        {stepText}
      </Body2>{" "}
      - <Body2>{subTitle}</Body2>
    </Stack>
  )
}
