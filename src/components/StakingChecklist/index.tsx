import { FC } from "react"
import { Box, Stack, useColorModeValue } from "@chakra-ui/react"
import { Body3 } from "../Typography"
import ChecklistGroup from "../ChecklistGroup"
import { ExternalHref } from "../../enums"
import ExternalLink from "../ExternalLink"

export const StakingDepositSteps: FC = () => {
  return (
    <ChecklistGroup
      title="Step 1 - Staking Deposit"
      checklistItems={[
        {
          title:
            "Node address (Provider), Beneficiary, and Authorizer addresses",
          subTitle: (
            <Body3 color={useColorModeValue("gray.500", "gray.300")}>
              These will be automatically set up to your wallet address. If you
              want to use a Staking Provider check{" "}
              <ExternalLink
                href={ExternalHref.preStakingProvider}
                text="this"
                withArrow
              />
            </Body3>
          ),
        },
      ]}
    />
  )
}

export const PreSetupSteps: FC = () => {
  return (
    <ChecklistGroup
      title="Step 2 - PRE Setup"
      checklistItems={[
        {
          title: "Run a PRE Node",
          subTitle: (
            <Body3 color={useColorModeValue("gray.500", "gray.300")}>
              You will need to run a PRE node to get rewards. If you don’t have
              one, learn how to do it here{" "}
              <ExternalLink
                href={ExternalHref.preNodeSetup}
                text="here"
                withArrow
              />
              , or contact{" "}
              <ExternalLink
                href={ExternalHref.preStakingProvider}
                text="a staking provider"
                withArrow
              />
            </Body3>
          ),
        },
        {
          title: "PRE Operator address",
          subTitle: (
            <Body3 color={useColorModeValue("gray.500", "gray.300")}>
              Learn how to add a PRE Operator address{" "}
              <ExternalLink
                href={ExternalHref.preNodeSetup}
                text="here"
                withArrow
              />
            </Body3>
          ),
        },
      ]}
    />
  )
}

const StakingChecklist: FC = () => {
  return (
    <Stack>
      <Box mb={6}>
        <StakingDepositSteps />
      </Box>
      <Box>
        <PreSetupSteps />
      </Box>
    </Stack>
  )
}

export default StakingChecklist
