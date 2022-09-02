import { FC } from "react"
import { Link, Stack, useColorModeValue } from "@chakra-ui/react"
import {
  BodyMd,
  BodySm,
  ChecklistGroup,
  FlowStep,
  FlowStepStatus,
} from "@threshold-network/components"
import { ExternalHref } from "../../enums"
import ExternalLink from "../ExternalLink"
import { StakeHowItWorksTab } from "../../pages/Staking/HowItWorks"

export const LegacyStakesDepositSteps: FC<{
  setTab: (tab: StakeHowItWorksTab) => void
}> = ({ setTab }) => {
  // TODO: Links from @threshold-network/components should be extended have these colors set by default
  const linkColor = useColorModeValue("brand.500", "white")

  return (
    <Stack spacing={6}>
      <FlowStep
        status={FlowStepStatus.active}
        preTitle="Step 1"
        title="Authorize T staking contract"
        size="sm"
        margin="0 !important"
      >
        <Stack spacing={0}>
          <BodyMd>
            Authorize NuCypher legacy stakes{" "}
            <ExternalLink href={ExternalHref.nuDapp} text="here" withArrow />
          </BodyMd>
          <BodyMd>
            Authorize Keep network legacy stakes{" "}
            <ExternalLink href={ExternalHref.keepDapp} text="here" withArrow />
          </BodyMd>
        </Stack>
      </FlowStep>
      <FlowStep
        status={FlowStepStatus.active}
        preTitle="Step 2"
        title="Stake Tokens"
        size="sm"
      >
        <BodyMd>
          Enter the Provider, Beneficiary, and Authorizer addresses. These will
          be automatically set to your wallet address. If you want to use a
          Staking Provider, here is{" "}
          <Link color={linkColor} onClick={() => setTab("providers")}>
            a list.
          </Link>
        </BodyMd>
      </FlowStep>

      <FlowStep
        status={FlowStepStatus.active}
        preTitle="Step 3"
        title="Authorize Apps"
        size="sm"
      >
        <BodyMd>
          For each stake, there are three applications available. PRE does not
          require authorization. To authorize TBTC and Random Beacon, go to the{" "}
          <ExternalLink href="/staking" text="staking page" /> and select
          “Configure Stake”.
        </BodyMd>
      </FlowStep>

      <FlowStep
        status={FlowStepStatus.active}
        preTitle="Step 4"
        title="Set up node"
        size="sm"
      >
        You will need to run a node for applications that you have authorized to
        earn rewards. If you don’t have one, learn how to do it{" "}
        <ExternalLink href="/" text="here" /> or contact{" "}
        <ExternalLink href="/staking" text="a Staking Provider" />
      </FlowStep>
    </Stack>
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
    <Stack spacing={6}>
      <FlowStep
        status={FlowStepStatus.active}
        preTitle="Step 1"
        title="Stake Tokens"
        size="sm"
        margin="0 !important"
      >
        <BodyMd>
          Enter the Provider, Beneficiary, and Authorizer addresses. These will
          be automatically set to your wallet address. If you want to use a
          Staking Provider, here is{" "}
          <ExternalLink href="/" text="a list" withArrow />
        </BodyMd>
      </FlowStep>

      <FlowStep
        status={FlowStepStatus.active}
        preTitle="Step 2"
        title="Authorize Apps"
        size="sm"
      >
        <BodyMd>
          For each stake, there are three applications available. PRE does not
          require authorization. To authorize TBTC and Random Beacon, go to the{" "}
          <ExternalLink href="/staking" text="staking page" /> and select
          “Configure Stake”.
        </BodyMd>
      </FlowStep>

      <FlowStep
        status={FlowStepStatus.active}
        preTitle="Step 3"
        title="Set up node"
        size="sm"
      >
        You will need to run a node for applications that you have authorized to
        earn rewards. If you don’t have one, learn how to do it{" "}
        <ExternalLink href="/" text="here" /> or contact{" "}
        <ExternalLink href="/staking" text="a Staking Provider" />
      </FlowStep>
    </Stack>
  )
}

export default StakingChecklist
