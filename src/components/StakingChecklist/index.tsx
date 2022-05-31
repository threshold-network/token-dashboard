import { FC } from "react"
import { Box, Stack, useColorModeValue } from "@chakra-ui/react"
import { Body2, Body3 } from "../Typography"
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
            "Provider Node address (Operator), Beneficiary, and Authorizer addresses",
          subTitle: (
            <Body3 color={useColorModeValue("gray.500", "gray.300")}>
              These will be automatically set up to your wallet address. If you
              want to use a Staking Provider check{" "}
              <ExternalLink
                href={ExternalHref.preStakingProvidersList}
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

export const LegacyStakesDepositSteps: FC = () => {
  return (
    <ChecklistGroup
      title="Step 1 - T Staking Contract Authorization"
      checklistItems={[
        {
          title: (
            <Body2>
              Authorize your NuCypher legacy stake{" "}
              <ExternalLink text="here" href={ExternalHref.nuDapp} withArrow />
            </Body2>
          ),
        },
        {
          title: (
            <Body2>
              Authorize your Keep Network legacy stake{" "}
              <ExternalLink
                text="here"
                href={ExternalHref.keepDappAuthPage}
                withArrow
              />
            </Body2>
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
                href={ExternalHref.preStakingProvidersList}
                text="a staking provider"
                withArrow
              />
              .
            </Body3>
          ),
        },
        {
          title: "PRE Operator address",
          subTitle: (
            <Body3 color={useColorModeValue("gray.500", "gray.300")}>
              Make sure you add your PRE Operator address{" "}
              <ExternalLink
                href={ExternalHref.preNodeSetup}
                text="here"
                withArrow
              />{" "}
              to gain rewards.
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
