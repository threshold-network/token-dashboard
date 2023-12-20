import { BodyMd, Stack, Image, VStack } from "@threshold-network/components"
import {
  AnnouncementBannerContainer,
  AnnouncementBannerContainerProps,
} from "../../components/AnnouncementBanner"
import ButtonLink from "../../components/ButtonLink"
import santaIsComing from "../../static/images/santa-is-coming.png"
import noBridgeFeesText from "../../static/images/no-bridge-fees-text.svg"
import { FC } from "react"

export const NoBridgeFeesBanner: FC<AnnouncementBannerContainerProps> = ({
  ...props
}) => {
  return (
    <AnnouncementBannerContainer
      hideCloseBtn
      py={{ base: 6, xl: 8 }}
      backgroundImage={santaIsComing}
      backgroundSize={"cover"}
      backgroundPosition={{ base: "25%", xl: "center" }}
      {...props}
    >
      <Stack
        direction={{ base: "column", xl: "row" }}
        alignItems={{ base: "left", xl: "center" }}
        justifyContent={"space-between"}
      >
        <VStack alignItems={"start"}>
          <Image
            src={noBridgeFeesText}
            maxHeight={{ base: "60px", xl: "initial" }}
          />
          <BodyMd color="white" fontSize={{ base: 14, xl: 21 }}>
            until February 10, 2024!
          </BodyMd>
        </VStack>

        <ButtonLink to={"/tBTC"} px={"6"} maxWidth={"150px"}>
          Start Minting
        </ButtonLink>
      </Stack>
    </AnnouncementBannerContainer>
  )
}
