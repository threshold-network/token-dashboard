import { FC } from "react"
import {
  SimpleGrid,
  Image,
  Stack,
  Box,
  LabelSm,
  Divider,
  List,
  ListItem,
  LabelMd,
  BodyMd,
  ListIcon,
} from "@threshold-network/components"
import { BsFillArrowRightCircleFill } from "react-icons/all"
import {
  AnnouncementBannerContainer,
  AnnouncementBannerTitle,
} from "../../../components/AnnouncementBanner"
import tbtcAppBannerIllustration from "../../../static/images/tBTCAppBanner.svg"

const ListItemWithIcon: FC = ({ children }) => {
  return (
    <ListItem display={"flex"} justifyItems="center">
      <ListIcon
        color="brand.500"
        my="auto"
        as={BsFillArrowRightCircleFill}
        w="16px"
        h="16px"
      />
      {children}
    </ListItem>
  )
}

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
          <List spacing="4">
            <ListItem>
              <LabelMd>minting duration</LabelMd>
              <List spacing="2">
                <ListItemWithIcon>
                  <BodyMd as="span">
                    Mint tBTC in around{" "}
                    <Box as="span" color="brand.500">
                      ~1 to 3 hours
                    </Box>
                    .
                  </BodyMd>
                </ListItemWithIcon>
              </List>
            </ListItem>
            <ListItem>
              <LabelMd>funds time lock</LabelMd>
              <List spacing="2">
                <ListItemWithIcon>
                  <BodyMd>
                    Your BTC funds will be locked for{" "}
                    <Box as="span" color="brand.500">
                      6 months
                    </Box>
                    .
                  </BodyMd>
                </ListItemWithIcon>
              </List>
            </ListItem>
            <ListItem>
              <LabelMd>unminting tbtc</LabelMd>
              <List spacing="2">
                <ListItemWithIcon>
                  <BodyMd>Unminting is currently under construction.</BodyMd>
                </ListItemWithIcon>
              </List>
            </ListItem>
          </List>
        </Box>
      </SimpleGrid>
    </AnnouncementBannerContainer>
  )
}
