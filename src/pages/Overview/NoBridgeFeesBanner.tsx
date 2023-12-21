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
      p={{ base: 6, xl: 10 }}
      backgroundImage={santaIsComing}
      backgroundSize={"cover"}
      backgroundPosition={{ base: "10%", xl: "center" }}
      {...props}
    >
      <Stack
        direction={{ base: "column", xl: "row" }}
        alignItems={{ base: "start", xl: "center" }}
        justifyContent={{ base: "left", xl: "space-between" }}
      >
        <Image
          src={noBridgeFeesText}
          maxHeight={{ base: "60px", xl: "initial" }}
          maxWidth={"400px"}
        />
        <ButtonLink to={"/tBTC"} px={"6"} maxWidth={"150px"}>
          Start Minting
        </ButtonLink>
      </Stack>
    </AnnouncementBannerContainer>
  )
}
