import { InfoIcon, CheckCircleIcon } from "@chakra-ui/icons"
import {
  LabelSm,
  VStack,
  HStack,
  Badge,
  StackProps,
  BodyMd,
  BodyLg,
  H3,
  BodySm,
  Link,
} from "@threshold-network/components"
import { FC } from "react"
import { formatPercentage } from "../../../../utils/percentage"
import InfoBox from "../../../../components/InfoBox"
import { formatTokenAmount } from "../../../../utils/formatAmount"
import { StakingAppName } from "../../../../store/staking-applications"
import TooltipIcon from "../../../../components/TooltipIcon"

interface CommonProps {
  label: string
  percentageAuthorized: number
  stakingAppName: StakingAppName | "pre"
}

type ConditionalProps =
  | {
      isAuthorizationRequired?: false
      isAuthorized?: never
      authorizedStake?: never
      hasPendingDeauthorization?: never
    }
  | {
      isAuthorizationRequired: true
      isAuthorized: boolean
      authorizedStake?: string
      hasPendingDeauthorization: boolean
    }

// TODO: Use the Link component from: https://github.com/threshold-network/token-dashboard/pull/258
const tooltipText: Record<StakingAppName | "pre", JSX.Element> = {
  tbtc: (
    <>
      The tBTC application is the first decentralized bridge from Bitcoin to
      Ethereum. Learn more <Link>here</Link>.
    </>
  ),
  randomBeacon: (
    <>
      The Random Beacon application generates randomness for staker group
      selection. Learn more <Link>here</Link>.
    </>
  ),
  // TODO: updte the PRE app tooltip text.
  pre: (
    <>
      The Random Beacon application generates randomness for staker group
      selection. Learn more <Link>here</Link>.
    </>
  ),
}

export type AppAuthorizationInfoProps = CommonProps &
  ConditionalProps &
  StackProps

export const AppAuthorizationInfo: FC<AppAuthorizationInfoProps> = ({
  label,
  percentageAuthorized,
  isAuthorized,
  authorizedStake,
  hasPendingDeauthorization,
  stakingAppName,
  isAuthorizationRequired = false,
  ...restProps
}) => {
  return (
    <VStack alignItems={"flex-start"} {...restProps}>
      <HStack mb="1rem !important">
        {isAuthorized && !hasPendingDeauthorization && (
          <CheckCircleIcon color="green.400" />
        )}
        <LabelSm>
          {label} App -{" "}
          {formatPercentage(percentageAuthorized, undefined, true)}
        </LabelSm>{" "}
        <TooltipIcon label={<BodySm>{tooltipText[stakingAppName]}</BodySm>} />
        <InfoIcon color="gray.500" />
        {!isAuthorizationRequired && (
          <Badge variant={"subtle"} colorScheme="gray" color={"gray.500"}>
            Authorization not required
          </Badge>
        )}
        {isAuthorizationRequired && isAuthorized && !hasPendingDeauthorization && (
          <Badge variant={"subtle"} colorScheme="green" size="small">
            Authorized
          </Badge>
        )}
        {hasPendingDeauthorization && (
          <Badge variant={"subtle"} colorScheme="yellow" size="small">
            pending deauthorization
          </Badge>
        )}
      </HStack>
      {isAuthorizationRequired && isAuthorized && authorizedStake && (
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
