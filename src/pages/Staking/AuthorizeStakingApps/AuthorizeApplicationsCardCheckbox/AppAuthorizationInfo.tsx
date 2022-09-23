import { InfoIcon, CheckCircleIcon } from "@chakra-ui/icons"
import {
  LabelSm,
  BoxLabel,
  VStack,
  HStack,
  Badge,
  StackProps,
  Icon,
  BodyMd,
  BodyLg,
  H3,
} from "@threshold-network/components"
import { FC } from "react"
import { formatPercentage } from "../../../../utils/percentage"
import { IoAlertCircle } from "react-icons/all"
import InfoBox from "../../../../components/InfoBox"
import { formatTokenAmount } from "../../../../utils/formatAmount"

interface CommonProps {
  label: string
  aprPercentage: number
  slashingPercentage: number
  percentageAuthorized: number
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
      authorizedStake: string
      hasPendingDeauthorization: boolean
    }

export type AppAuthorizationInfoProps = CommonProps &
  ConditionalProps &
  StackProps

export const AppAuthorizationInfo: FC<AppAuthorizationInfoProps> = ({
  label,
  percentageAuthorized,
  aprPercentage,
  slashingPercentage,
  isAuthorized,
  authorizedStake,
  hasPendingDeauthorization,
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
        </LabelSm>
        <InfoIcon />
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
      <HStack>
        <BoxLabel
          icon={<Icon as={IoAlertCircle} />}
          size="sm"
          status="primary"
          variant="solid"
        >
          APR &#183; {formatPercentage(aprPercentage, 0, true)}
        </BoxLabel>
        <BoxLabel
          icon={<Icon as={IoAlertCircle} />}
          size="sm"
          status="primary"
          variant="solid"
        >
          {"Slashing "} &#183;{" "}
          {`${formatPercentage(slashingPercentage, 0, true)}`}
        </BoxLabel>
      </HStack>
      {isAuthorizationRequired && isAuthorized && authorizedStake && (
        <>
          <BodyMd mt="2.5rem !important">Total Authorized Balance</BodyMd>
          <InfoBox pr="44">
            <H3>
              {formatTokenAmount(authorizedStake)} <BodyLg as="span">T</BodyLg>
            </H3>
          </InfoBox>
        </>
      )}
    </VStack>
  )
}
