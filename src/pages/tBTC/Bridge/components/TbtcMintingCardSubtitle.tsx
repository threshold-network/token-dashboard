import { FC } from "react"
import { BodyLg, Stack } from "@threshold-network/components"

export const TbtcMintingCardSubTitle: FC<{
  stepText: string
  subTitle: string | JSX.Element
}> = ({ stepText, subTitle }) => {
  return (
    <Stack direction="row" mb={2}>
      <BodyLg fontWeight="bold" color="brand.500">
        {stepText}
      </BodyLg>{" "}
      <BodyLg>- {subTitle}</BodyLg>
    </Stack>
  )
}
