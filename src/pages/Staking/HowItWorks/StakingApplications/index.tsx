import { FC } from "react"
import {
  Alert,
  AlertIcon,
  Button,
  Stack,
  Divider,
  Card,
  BodyMd,
  H5,
  VStack,
} from "@threshold-network/components"
import tbtcAppIllustration from "../../../../static/images/tbtcAppIllustration.png"
import randomBeaconAppIllustration from "../../../../static/images/randomBeaconAppIllustration.png"
import preAppIllustration from "../../../../static/images/preAppIllustration.png"
import ApplicationDetailsCard from "./ApplicationDetailsCard"

const StakingApplications: FC = () => {
  return (
    <Card>
      <H5 my={8}>Staking Providers</H5>
      <Divider mb={6} />
      <BodyMd mb={6}>
        Authorization allows you to authorize a portion or all of your stake to
        any number of Threshold applications. You can change this amount by
        deauthorizing at any time. There is a deauthorization cooldown period of
        14 days.
      </BodyMd>
      {/* TODO: Investigate why magic prop isn't working */}
      {/*status="magic"*/}
      <Alert mb={6}>
        <AlertIcon />
        In order to earn rewards, please authorize Threshold apps to use your
        stake. Note that you can authorize 100% of your stake for all of the
        apps.
      </Alert>

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
