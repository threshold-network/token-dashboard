import {
  BodyMd,
  BodyXs,
  Card,
  Divider,
  H5,
  HStack,
  Image,
  Stack,
  VStack,
} from "@threshold-network/components"
import ApplicationDetailsCard from "./ApplicationDetailsCard"
import tbtcAppIllustrationLight from "../../../../static/images/tbtcAppIllustrationLight.svg"
import tbtcAppIllustrationDark from "../../../../static/images/tbtcAppIllustrationDark.svg"
import randomBeaconAppIllustrationLight from "../../../../static/images/randomBeaconAppIllustrationLight.png"
import randomBeaconAppIllustrationDark from "../../../../static/images/randomBeaconAppIllustrationDark.png"
import preAppIllustrationLight from "../../../../static/images/preAppIllustrationLight.png"
import preAppIllustrationDark from "../../../../static/images/preAppIllustrationDark.png"
import listIconStarLight from "../../../../static/images/ListIconStarLight.png"
import listIconStarDark from "../../../../static/images/ListIconStarDark.png"
import listIconStockLight from "../../../../static/images/ListIconStockLight.png"
import listIconStockDark from "../../../../static/images/ListIconStockDark.png"
import listIconArrowsLight from "../../../../static/images/ListIconArrowsLight.png"
import listIconArrowsDark from "../../../../static/images/ListIconArrowsDark.png"
import stakingApplicationsIllustrationLight from "../../../../static/images/StakingApplicationsIllustrationLight.png"
import stakingApplicationsIllustrationDark from "../../../../static/images/StakingApplicationsIllustrationDark.png"
import { PageComponent } from "../../../../types"
import { ExternalHref } from "../../../../enums"
import { featureFlags } from "../../../../constants"
import { Link as RouterLink } from "react-router-dom"
import { ColorMode, List, ListItem, useColorMode } from "@chakra-ui/react"
import ButtonLink from "../../../../components/ButtonLink"

const preNodeSteps = ["Run a PRE node", "Have a staked balance"]
const randomBeaconNodeSteps = [
  "Run a Random Beacon node",
  "Authorize a portion of your stake to Random Beacon",
  "Have a staked balance",
]
const tbtcNodeSteps = [
  "Run a tBTC node",
  "Authorize a portion of your stake to tBTC",
  "Have a staked balance",
]

const iconMap: { [iconName: string]: Record<ColorMode, string> } = {
  star: { light: listIconStarLight, dark: listIconStarDark },
  stock: { light: listIconStockLight, dark: listIconStockDark },
  arrows: { light: listIconArrowsLight, dark: listIconArrowsDark },
  stakingApps: {
    light: stakingApplicationsIllustrationLight,
    dark: stakingApplicationsIllustrationDark,
  },
  tbtc: {
    light: tbtcAppIllustrationLight,
    dark: tbtcAppIllustrationDark,
  },
  pre: {
    light: preAppIllustrationLight,
    dark: preAppIllustrationDark,
  },
  randomBeacon: {
    light: randomBeaconAppIllustrationLight,
    dark: randomBeaconAppIllustrationDark,
  },
}

const StakingApplications: PageComponent = () => {
  const { colorMode } = useColorMode()

  return (
    <Card>
      <H5 my={8}>Staking Applications</H5>
      <Divider mb={6} />
      <Stack
        justifyContent="space-between"
        spacing={{ base: "8", xl: "16" }}
        direction={{ base: "column", xl: "row" }}
        mb={8}
      >
        <Stack maxW="408px">
          <BodyMd mb={6}>
            Authorization allows you to authorize a portion or all of your stake
            to be used by Threshold apps.
          </BodyMd>
          <List>
            <ListItem>
              <HStack spacing={4}>
                <Image h="32px" w="32px" src={iconMap.star[colorMode]} />
                <BodyMd>Earn rewards by authorizing apps.</BodyMd>
              </HStack>
            </ListItem>
          </List>
          <List>
            <ListItem>
              <HStack spacing={4}>
                <Image h="32px" w="32px" src={iconMap.stock[colorMode]} />
                <BodyMd>
                  Authorize 100% of your stake for all apps for the most rewards
                  opportunity.
                </BodyMd>
              </HStack>
            </ListItem>
          </List>
          <List>
            <ListItem>
              <HStack spacing={4}>
                <Image h="32px" w="32px" src={iconMap.arrows[colorMode]} />
                <Stack>
                  <BodyMd>Change your authorized amount at any time. </BodyMd>
                  <BodyXs>
                    There is a deauthorization cooldown period of 45 days.
                  </BodyXs>
                </Stack>
              </HStack>
            </ListItem>
          </List>
        </Stack>
        <Image
          maxW={{ base: "100%", xl: "528px" }}
          src={iconMap.stakingApps[colorMode]}
        />
      </Stack>
      <Stack spacing={6}>
        <ApplicationDetailsCard
          preTitle="tBTC APP"
          title="tBTC is the only truly decentralized solution for bridging Bitcoin to Ethereum."
          description="tBTC replaces a centralized custodian with a randomly selected group of operators running nodes on the Threshold Network. This group of independent operators works together to secure your deposited Bitcoin through threshold cryptography."
          imgSrc={iconMap.tbtc[colorMode]}
          ctaButtons={
            <VStack mb={6}>
              <ButtonLink to="/staking" isFullWidth>
                Authorize tBTC
              </ButtonLink>
              <ButtonLink
                isExternal
                href={ExternalHref.tbtcNodeDocs}
                isFullWidth
                variant="outline"
              >
                tBTC Node Docs
              </ButtonLink>
            </VStack>
          }
          rewardSteps={tbtcNodeSteps}
        />
        <ApplicationDetailsCard
          preTitle="Random Beacon APP"
          title="Random Beacon is a threshold relay that can generate verifiable randomness."
          description="The Random Beacon application provides a trusted source of randomness for the process of trustless group election in the Threshold Network."
          imgSrc={iconMap.randomBeacon[colorMode]}
          ctaButtons={
            <VStack mb={6}>
              <ButtonLink as={RouterLink} to="/staking" isFullWidth>
                Authorize Random Beacon
              </ButtonLink>
              <ButtonLink
                isExternal
                href={ExternalHref.randomBeaconNodeDocs}
                isFullWidth
                variant="outline"
              >
                Random Beacon Node Docs
              </ButtonLink>
            </VStack>
          }
          rewardSteps={randomBeaconNodeSteps}
        />
        <ApplicationDetailsCard
          preTitle="PRE APP"
          title="Proxy Re-Encryption, or PRE, is cryptographic middleware for developing privacy-preserving applications."
          description="PRE is a scalable end-to-end encryption protocol that allows a proxy entity to transform (or re-encrypt) encrypted data from one encryption key to another, without revealing the plaintext data. The nodes on the Threshold Network act as these proxy entities and use threshold cryptography to securely and cooperatively re-encrypt data for recipients based on access conditions defined by the data owner. "
          imgSrc={iconMap.pre[colorMode]}
          ctaButtons={
            <ButtonLink
              isExternal
              href={ExternalHref.preNodeSetup}
              mb={6}
              isFullWidth
              variant="outline"
            >
              PRE Node Docs
            </ButtonLink>
          }
          rewardSteps={preNodeSteps}
        />
      </Stack>
    </Card>
  )
}

StakingApplications.route = {
  path: "applications",
  index: false,
  isPageEnabled: featureFlags.MULTI_APP_STAKING,
}

export default StakingApplications
