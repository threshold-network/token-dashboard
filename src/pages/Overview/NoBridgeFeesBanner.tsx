import { BodyLg, Stack, Image, VStack } from "@threshold-network/components"
import {
  AnnouncementBannerContainer,
  AnnouncementBannerContainerProps,
} from "../../components/AnnouncementBanner"
import ButtonLink from "../../components/ButtonLink"
import santaIsComing from "../../static/images/santa-is-coming.svg"
import noBridgeFeesText from "../../static/images/no-bridge-fees-text.svg"
import { FC } from "react"

export const NoBridgeFeesBanner: FC<AnnouncementBannerContainerProps> = ({
  ...props
}) => {
  return (
    <AnnouncementBannerContainer
      backgroundImage={santaIsComing}
      backgroundSize={"cover"}
      hideCloseBtn
      {...props}
      py={12}
    >
      <Stack
        direction={{ base: "column", xl: "row" }}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <VStack alignItems={"start"}>
          <Image src={noBridgeFeesText} />
          <BodyLg color="white">until February 10, 2024!</BodyLg>
        </VStack>

        <ButtonLink to={"/tBTC"}>Start minting</ButtonLink>
      </Stack>
    </AnnouncementBannerContainer>
  )
}
