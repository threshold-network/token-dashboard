import { InfoIcon } from "@chakra-ui/icons"
import { VStack, HStack, Badge, StackProps, Icon } from "@chakra-ui/react"
import { LabelSm, BodyXs, BoxLabel } from "@threshold-network/components"
import { FC } from "react"
import { formatPercentage } from "../../../../utils/percentage"
import { IoAlertCircle } from "react-icons/all"

export interface StakeInfoProps extends StackProps {
  label: string
  percentageAuthorized: number
  aprPercentage: number
  slashingPercentage: number
  isAuthorizationRequired?: boolean
}

export const StakeInfo: FC<StakeInfoProps> = ({
  label,
  percentageAuthorized,
  aprPercentage,
  slashingPercentage,
  isAuthorizationRequired = false,
  ...restProps
}) => {
  return (
    <VStack alignItems={"flex-start"} {...restProps}>
      <HStack>
        <LabelSm>
          {label} App - {formatPercentage(percentageAuthorized)}
        </LabelSm>
        <InfoIcon />
        {!isAuthorizationRequired && (
          <Badge variant={"subtle"} colorScheme="gray" color={"gray.500"}>
            Authorization not required
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
    </VStack>
  )
}
