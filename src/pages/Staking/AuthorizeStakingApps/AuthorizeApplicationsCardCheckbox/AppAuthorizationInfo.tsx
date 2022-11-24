import { CheckCircleIcon } from "@chakra-ui/icons"
import {
  LabelSm,
  VStack,
  HStack,
  Badge,
  StackProps,
  BodyMd,
  BodyLg,
  H3,
} from "@threshold-network/components"
import { FC } from "react"
import { formatPercentage } from "../../../../utils/percentage"
import InfoBox from "../../../../components/InfoBox"
import { formatTokenAmount } from "../../../../utils/formatAmount"
import { StakingAppName } from "../../../../store/staking-applications"
import TooltipIcon from "../../../../components/TooltipIcon"
import Link from "../../../../components/Link"
import { AuthorizationStatus } from "../../../../types"

interface CommonProps {
  label: string
  percentageAuthorized: number
  stakingAppName: StakingAppName | "pre"
}

type ConditionalProps =
  | {
      status?: Extract<AuthorizationStatus, "authorization-not-required">
      authorizedStake?: never
    }
  | {
      status: Extract<AuthorizationStatus, "to-authorize">
      authorizedStake?: never
    }
  | {
      status: Exclude<AuthorizationStatus, "authorization-not-required">
      authorizedStake: string
    }

const TooltipLearnMoreLink = () => {
  return <Link to="/staking/how-it-works/applications">here</Link>
}

const tooltipText: Record<StakingAppName | "pre", JSX.Element> = {
  tbtc: (
    <>
      The tBTC application is the first decentralized bridge from Bitcoin to
      Ethereum. Learn more <TooltipLearnMoreLink />.
    </>
  ),
  randomBeacon: (
    <>
      The Random Beacon application generates randomness for staker group
      selection. Learn more <TooltipLearnMoreLink />.
    </>
  ),
  pre: (
    <>
      The PRE application is cryptographic middleware for developing
      privacy-preserving applications. Learn more <TooltipLearnMoreLink />. .
    </>
  ),
}

export type AppAuthorizationInfoProps = CommonProps &
  ConditionalProps &
  StackProps

const statusToBadge: Record<
  Exclude<AuthorizationStatus, "to-authorize">,
  { props: any; label: string }
> = {
  "authorization-not-required": {
    props: {
      colorScheme: "gray",
      color: "gray.500",
    },
    label: "authorization not required",
  },
  authorized: {
    props: {
      colorScheme: "green",
    },
    label: "authorized",
  },
  "pending-deauthorization": {
    props: {
      colorScheme: "yellow",
    },
    label: "pending deauthorization",
  },
  "deauthorization-initiation-needed": {
    props: {
      colorScheme: "red",
    },
    label: "deauthorization initiation needed",
  },
}

export const AppAuthorizationInfo: FC<AppAuthorizationInfoProps> = ({
  label,
  percentageAuthorized,
  authorizedStake,
  stakingAppName,
  status,
  ...restProps
}) => {
  return (
    <VStack alignItems={"flex-start"} {...restProps}>
      <HStack mb="1rem !important">
        {status === "authorized" && <CheckCircleIcon color="green.400" />}
        <LabelSm>
          {label} App -{" "}
          {formatPercentage(percentageAuthorized, undefined, true)}
        </LabelSm>{" "}
        <TooltipIcon label={tooltipText[stakingAppName]} />
        {status && status !== "to-authorize" && (
          <Badge variant="subtle" {...statusToBadge[status].props}>
            {statusToBadge[status].label}
          </Badge>
        )}
      </HStack>
      {authorizedStake && authorizedStake !== "0" && (
        <>
          <BodyMd mt="2.5rem !important">Total Authorized Balance</BodyMd>
          <InfoBox pr="44">
            <H3>
              {formatTokenAmount(authorizedStake!)} <BodyLg as="span">T</BodyLg>
            </H3>
          </InfoBox>
        </>
      )}
    </VStack>
  )
}
