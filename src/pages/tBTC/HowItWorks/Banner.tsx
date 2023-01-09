import {
  SimpleGrid,
  Image,
  Stack,
  Box,
  LabelSm,
  Divider,
} from "@threshold-network/components"
import {
  AnnouncementBannerContainer,
  AnnouncementBannerTitle,
} from "../../../components/AnnouncementBanner"
import tbtcAppBannerIllustration from "../../../static/images/tBTCAppBanner.svg"
import { TakeNoteList } from "../../../components/tBTC"

export const Banner = () => {
  return (
    <AnnouncementBannerContainer hideCloseBtn>
      <SimpleGrid columns={{ base: 1, xl: 2 }} gap="16">
        <Stack
          spacing="12"
          direction={{ base: "column", xl: "row" }}
          alignItems={"center"}
        >
          <Image
            src={tbtcAppBannerIllustration}
            maxH={{ base: "140px", xl: "unset" }}
          />
          <Box as="header" textAlign={{ base: "left", xl: "unset" }}>
            <AnnouncementBannerTitle
              preTitle="announcing"
              title="The NEW tBTC dApp is here!"
            />
          </Box>
          <Divider
            orientation="vertical"
            borderColor="brand.100"
            display={{ base: "none", xl: "block" }}
          />
        </Stack>
        <Box>
          <LabelSm color="brand.500" mb="2">
            take note:
          </LabelSm>
          <TakeNoteList />
        </Box>
      </SimpleGrid>
    </AnnouncementBannerContainer>
  )
}
