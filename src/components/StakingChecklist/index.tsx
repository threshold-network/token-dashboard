import { FC } from "react"
import { Box, Stack, useColorModeValue } from "@chakra-ui/react"
import { BodyMd, BodySm, ChecklistGroup } from "@threshold-network/components"
import { ExternalHref } from "../../enums"
import ExternalLink from "../ExternalLink"

export const StakingDepositSteps: FC = () => {
  return (
    <ChecklistGroup
      title="Step 1 - Staking Deposit"
      checklistItems={[
        {
          itemId: "staking_deposit__0",
          itemTitle:
            "Provider Node address (Operator), Beneficiary, and Authorizer addresses",
          itemSubTitle: (
            <BodySm color={useColorModeValue("gray.500", "gray.300")}>
              These will be automatically set up to your wallet address. If you
              want to use a Staking Provider check{" "}
              <ExternalLink
                href={ExternalHref.preStakingProvidersList}
                text="this"
                withArrow
              />
            </BodySm>
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
          itemId: "t_staking_contract_auth__0",
          itemTitle: (
            <BodyMd>
              Authorize your NuCypher legacy stake{" "}
              <ExternalLink text="here" href={ExternalHref.nuDapp} withArrow />
            </BodyMd>
          ),
        },
        {
          itemId: "t_staking_contract_auth__1",
          itemTitle: (
            <BodyMd>
              Authorize your Keep Network legacy stake{" "}
              <ExternalLink
                text="here"
                href={ExternalHref.keepDappAuthPage}
                withArrow
              />
            </BodyMd>
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
          itemId: "run_a_pre_node__0",
          itemTitle: "Run a PRE Node",
          itemSubTitle: (
            <BodySm color={useColorModeValue("gray.500", "gray.300")}>
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
            </BodySm>
          ),
        },
        {
          itemId: "run_a_pre_node__1",
          itemTitle: "PRE Operator address",
          itemSubTitle: (
            <BodySm color={useColorModeValue("gray.500", "gray.300")}>
              Make sure you add your PRE Operator address{" "}
              <ExternalLink
                href={ExternalHref.preNodeSetup}
                text="here"
                withArrow
              />{" "}
              to gain rewards.
            </BodySm>
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
