import { FC } from "react"
import { Stack } from "@chakra-ui/react"
import { BodyLg } from "@threshold-network/components"

export const TbtcMintingCardSubTitle: FC<{
  stepText: string
  subTitle: string
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
