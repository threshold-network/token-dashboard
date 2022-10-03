import { FC } from "react"
import {
  BodyMd,
  BodySm,
  BoxLabel,
  ChecklistGroup,
  FlowStep,
  FlowStepStatus,
  Stack,
  useColorModeValue,
  StackProps,
} from "@threshold-network/components"
import { ExternalHref } from "../../enums"
import ExternalLink from "../ExternalLink"
import { featureFlags } from "../../constants"
import InternalLink from "../InternalLink"
import { Box } from "@chakra-ui/react"

const STAKING_PROVIDER_URL = "/staking/how-it-works/providers"
const APPLICATION_DOCS_URL = "/staking/how-it-works/applications"

export const StakingDepositStepsNonMAS: FC = () => {
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
                isExternal
                href={ExternalHref.preStakingProvidersList}
                text="this"
              />
            </BodySm>
          ),
        },
      ]}
    />
  )
}

export const LegacyStakesDepositSteps: FC = () => {
  if (featureFlags.MULTI_APP_STAKING) {
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
              <ExternalLink isExternal href={ExternalHref.nuDapp} text="here" />
            </BodyMd>
            <BodyMd>
              Authorize Keep Network legacy stakes{" "}
              <ExternalLink
                isExternal
                href={ExternalHref.keepDapp}
                text="here"
              />
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
            Enter the Provider, Beneficiary, and Authorizer addresses. These
            will be automatically set to your wallet address. If you want to use
            a Staking Provider, here is{" "}
            <InternalLink to={STAKING_PROVIDER_URL}>a list</InternalLink>
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
            require authorization. To authorize TBTC and Random Beacon, go to
            the <InternalLink to="/staking">Staking Page</InternalLink> and
            select “Configure Stake”.
          </BodyMd>
        </FlowStep>

        <FlowStep
          status={FlowStepStatus.active}
          preTitle="Step 4"
          title="Set up node"
          size="sm"
        >
          You will need to run a node for applications that you have authorized
          to earn rewards. If you don’t have one, learn how to do it{" "}
          <InternalLink to={APPLICATION_DOCS_URL}>here</InternalLink> or contact{" "}
          <InternalLink to={STAKING_PROVIDER_URL}>
            a Staking Provider
          </InternalLink>
        </FlowStep>
      </Stack>
    )
  }

  return (
    <Box>
      <ChecklistGroup
        mb={8}
        title="Step 1 - T Staking Contract Authorization"
        checklistItems={[
          {
            itemId: "t_staking_contract_auth__0",
            itemTitle: (
              <BodyMd>
                Authorize your NuCypher legacy stake{" "}
                <ExternalLink
                  isExternal
                  text="here"
                  href={ExternalHref.nuDapp}
                />
              </BodyMd>
            ),
          },
          {
            itemId: "t_staking_contract_auth__1",
            itemTitle: (
              <BodyMd>
                Authorize your Keep Network legacy stake{" "}
                <ExternalLink
                  isExternal
                  text="here"
                  href={ExternalHref.keepDappAuthPage}
                />
              </BodyMd>
            ),
          },
        ]}
      />
      <PreSetupSteps />
    </Box>
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
                isExternal
                href={ExternalHref.preNodeSetup}
                text="here"
              />
              , or contact{" "}
              <ExternalLink
                isExternal
                href={ExternalHref.preStakingProvidersList}
                text="a staking provider"
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
                isExternal
                href={ExternalHref.preNodeSetup}
                text="here"
              />{" "}
              to gain rewards.
            </BodySm>
          ),
        },
      ]}
    />
  )
}

const StakingTimeline: FC<{ statuses?: FlowStepStatus[] } & StackProps> = ({
  statuses = [],
  ...restProps
}) => {
  if (featureFlags.MULTI_APP_STAKING) {
    return (
      <Stack spacing={6}>
        <BoxLabel status="secondary">Staking Timeline</BoxLabel>
        <FlowStep
          size="sm"
          title="Stake Tokens"
          preTitle="Step 1"
          status={statuses[0] ?? FlowStepStatus.active}
        >
          Enter the Provider, Beneficiary, and Authorizer addresses. These will
          be automatically set to your wallet address. If you want to use a
          Staking Provider, here is{" "}
          <InternalLink to={STAKING_PROVIDER_URL}>a list</InternalLink>
        </FlowStep>
        <FlowStep
          size="sm"
          title="Authorize Apps"
          preTitle="Step 2"
          status={statuses[1] ?? FlowStepStatus.inactive}
        >
          For each stake, there are three applications available. PRE does not
          require authorization. To authorize TBTC and Random Beacon, go to the{" "}
          <InternalLink to="/staking">Staking page</InternalLink> and select
          “Configure Stake”.
        </FlowStep>
        <FlowStep
          size="sm"
          title="Set up node"
          preTitle="Step 3"
          status={statuses[2] ?? FlowStepStatus.inactive}
        >
          You will need to run a node for applications that you have authorized
          to earn rewards. If you don’t have one, learn how to do it{" "}
          <InternalLink to={APPLICATION_DOCS_URL}>here</InternalLink> or contact
          a{" "}
          <InternalLink to={STAKING_PROVIDER_URL}>
            Staking Provider.
          </InternalLink>
        </FlowStep>
      </Stack>
    )
  }

  return (
    <Stack {...restProps}>
      <Box mb={6}>
        <StakingDepositStepsNonMAS />
      </Box>
      <Box>
        <PreSetupSteps />
      </Box>
    </Stack>
  )
}

export default StakingTimeline
