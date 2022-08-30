import { FC } from "react"
import { Link, Stack, useColorModeValue } from "@chakra-ui/react"
import {
  BodyMd,
  BodySm,
  BoxLabel,
  ChecklistGroup,
  FlowStep,
  FlowStepStatus,
} from "@threshold-network/components"
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

const StakingTimeline: FC = () => {
  const STAKING_PROVIDER_URL = "someURL"
  const PROVIDER_ADDRESS_URL = "someURL"
  const BENEFICIARY_ADDRESS_URL = "someURL"
  const AUTHORIZER_ADDRESS_URL = "someURL"

  return (
    <Stack spacing={6}>
      <BoxLabel>Staking Timeline</BoxLabel>
      <FlowStep
        size="sm"
        title="Stake Tokens"
        preTitle="Step 1"
        status={FlowStepStatus.active}
      >
        Enter the{" "}
        <Link color="brand.500" href={PROVIDER_ADDRESS_URL}>
          Provider
        </Link>
        ,{" "}
        <Link color="brand.500" href={BENEFICIARY_ADDRESS_URL}>
          Beneficiary
        </Link>
        , and{" "}
        <Link color="brand.500" href={AUTHORIZER_ADDRESS_URL}>
          Authorizer
        </Link>{" "}
        addresses. These will be automatically set to your wallet address. If
        you want to use a Staking Provider, here is{" "}
        <Link color="brand.500" href={STAKING_PROVIDER_URL}>
          a list
        </Link>
        .
      </FlowStep>
      <FlowStep
        size="sm"
        title="Authorize Apps"
        preTitle="Step 2"
        status={FlowStepStatus.inactive}
      >
        You can authorize 100% of your stake for each app. This amount can be
        changed at any time.
      </FlowStep>
      <FlowStep
        size="sm"
        title="Set up node"
        preTitle="Step 3"
        status={FlowStepStatus.inactive}
      >
        Set up and run a node for any of the applications authorized.
      </FlowStep>
    </Stack>
  )
}

export default StakingTimeline
