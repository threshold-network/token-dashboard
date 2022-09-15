import { InfoIcon } from "@chakra-ui/icons"
import {
  LabelSm,
  BoxLabel,
  VStack,
  HStack,
  Badge,
  StackProps,
  Icon,
} from "@threshold-network/components"
import { FC } from "react"
import { formatPercentage } from "../../../../utils/percentage"
import { IoAlertCircle } from "react-icons/all"

export interface AppAuthorizationInfoProps extends StackProps {
  label: string
  percentageAuthorized: number
  separatePercentAuthorized?: boolean
  aprPercentage: number
  slashingPercentage: number
  isAuthorizationRequired?: boolean
}

export const AppAuthorizationInfo: FC<AppAuthorizationInfoProps> = ({
  label,
  percentageAuthorized,
  aprPercentage,
  slashingPercentage,
  isAuthorizationRequired = false,
  separatePercentAuthorized,
  ...restProps
}) => {
  return (
    <VStack alignItems={"flex-start"} {...restProps}>
      <HStack
        w="full"
        justifyContent={separatePercentAuthorized ? "space-between" : undefined}
      >
        <HStack>
          <LabelSm>
            {label} App{" "}
            {!separatePercentAuthorized &&
              `- ${formatPercentage(percentageAuthorized)}`}
          </LabelSm>
          <InfoIcon />
          {!isAuthorizationRequired && (
            <Badge variant={"subtle"} colorScheme="gray" color={"gray.500"}>
              Authorization not required
            </Badge>
          )}
        </HStack>
        {separatePercentAuthorized && (
          <LabelSm>{formatPercentage(percentageAuthorized)}</LabelSm>
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
    </VStack>
  )
}
