import { FC } from "react"
import { Box, Stack } from "@chakra-ui/react"
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
            "Node address (Operator), Beneficiary, and Authorizer addresses",
          subTitle: (
            <Body3 color="gray.500">
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
            <Body3 color="gray.500">
              If you don't have one yet, set this up{" "}
              <ExternalLink
                href={ExternalHref.preNodeSetup}
                text="here"
                withArrow
              />
            </Body3>
          ),
        },
        {
          title: "PRE Node Worker address",
          subTitle: "Make sure you add your Worker address to gain rewards",
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
