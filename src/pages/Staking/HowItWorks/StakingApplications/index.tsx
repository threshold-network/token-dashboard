import { FC } from "react"
import {
  BodyMd,
  BodyXs,
  Button,
  Card,
  Divider,
  H5,
  HStack,
  Image,
  Stack,
  VStack,
} from "@threshold-network/components"
import tbtcAppIllustration from "../../../../static/images/tbtcAppIllustration.png"
import randomBeaconAppIllustration from "../../../../static/images/randomBeaconAppIllustration.png"
import preAppIllustration from "../../../../static/images/preAppIllustration.png"
import ApplicationDetailsCard from "./ApplicationDetailsCard"

import listIconStar from "../../../../static/images/ListIconStar.png"
import listIconStock from "../../../../static/images/ListIconStock.png"
import listIconArrows from "../../../../static/images/ListIconArrows.png"
import stakingApplicationsIllustration from "../../../../static/images/StakingApplicationsIllustration.png"

const CustomList: FC<{
  items: { imgSrc: any; content: string | JSX.Element }[]
}> = ({ items }) => {
  return (
    <Stack spacing={4}>
      {items.map(({ imgSrc, content }) => (
        <HStack spacing={4}>
          <Image h="32px" w="32px" src={imgSrc} />
          {typeof content === "string" ? <BodyMd>{content}</BodyMd> : content}
        </HStack>
      ))}
    </Stack>
  )
}

const StakingApplications: FC = () => {
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

          <CustomList
            items={[
              {
                content: "Earn rewards by authorizing apps.",
                imgSrc: listIconStar,
              },
              {
                content:
                  "Authorize 100% of your stake for all apps for the most rewards opportunity.",
                imgSrc: listIconStock,
              },
              {
                content: (
                  <Stack>
                    <BodyMd>Change your authorized amount at any time. </BodyMd>
                    <BodyXs>
                      There is a deauthorization cooldown period of 14 days.
                    </BodyXs>
                  </Stack>
                ),
                imgSrc: listIconArrows,
              },
            ]}
          />
        </Stack>
        <Image maxW="528px" src={stakingApplicationsIllustration} />
      </Stack>
      <Stack spacing={6}>
        <ApplicationDetailsCard
          preTitle="TBTC APP"
          title="tBTC is the only truly decentralized solution for bridging Bitcoin to Ethereum."
          description="tBTC replaces a centralized custodian with a randomly selected group of operators running nodes on the Threshold Network. This group of independent operators works together to secure your deposited Bitcoin through threshold cryptography."
          imgSrc={tbtcAppIllustration}
          ctaButtons={
            <VStack mb={6}>
              <Button isFullWidth>Authorize TBTC</Button>
              <Button isFullWidth variant="outline">
                Authorize TBTC
              </Button>
            </VStack>
          }
          rewardSteps={[
            "Run a tBTC node",
            "Authorize a portion of your stake to tBTC",
            "Have a staked balance",
          ]}
          aprPercentage={10}
          slashingPercentage={1}
        />
        <ApplicationDetailsCard
          preTitle="Random Beacon APP"
          title="Random Beacon is a threshold relay that can generate verifiable randomness."
          description="The Random Beacon application provides a trusted source of randomness for the process of trustless group election in the Threshold Network."
          imgSrc={randomBeaconAppIllustration}
          ctaButtons={
            <VStack mb={6}>
              <Button isFullWidth>Authorize Random Beacon</Button>
              <Button isFullWidth variant="outline">
                Random Beacon Node Docs
              </Button>
            </VStack>
          }
          rewardSteps={[
            "Run a Random Beacon node",
            "Authorize a portion of your stake to Random Beacon",
            "Have a staked balance",
          ]}
          aprPercentage={10}
          slashingPercentage={1}
        />
        <ApplicationDetailsCard
          preTitle="PRE APP"
          title="Proxy Re-Encryption, or PRE, is cryptographic middleware for developing privacy-preserving applications."
          description="PRE is a scalable end-to-end encryption protocol that allows a proxy entity to transform (or re-encrypt) encrypted data from one encryption key to another, without revealing the plaintext data. The nodes on the Threshold Network act as these proxy entities and use threshold cryptography to securely and cooperatively re-encrypt data for recipients based on access conditions defined by the data owner. "
          imgSrc={preAppIllustration}
          ctaButtons={
            <Button isFullWidth variant="outline" mb={6}>
              PRE Node Docs
            </Button>
          }
          rewardSteps={["Run a PRE node", "Have a staked balance"]}
          aprPercentage={10}
          slashingPercentage={1}
        />
      </Stack>
    </Card>
  )
}

export default StakingApplications
