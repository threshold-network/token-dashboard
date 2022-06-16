import { FC } from "react"
import { Stack } from "@chakra-ui/react"
import { Body1 } from "../../../../components/Typography"

export const TbtcMintingCardSubTitle: FC<{
  stepText: string
  subTitle: string
}> = ({ stepText, subTitle }) => {
  return (
    <Stack direction="row" mb={2}>
      <Body1 fontWeight="bold" color="brand.500">
        {stepText}
      </Body1>{" "}
      <Body1>- {subTitle}</Body1>
    </Stack>
  )
}
