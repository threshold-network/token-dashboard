import { InfoIcon } from "@chakra-ui/icons"
import { VStack, HStack, Badge, StackProps } from "@chakra-ui/react"
import { LabelSm, BodyXs } from "@threshold-network/components"
import { FC } from "react"

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
          {label} App - {percentageAuthorized}%
        </LabelSm>
        <InfoIcon />
        {!isAuthorizationRequired && (
          <Badge variant={"subtle"} colorScheme="gray" color={"gray.500"}>
            Authorization not required
          </Badge>
        )}
      </HStack>
      <HStack>
        <Badge
          variant={"solid"}
          borderRadius={5}
          px={2}
          py={2}
          backgroundColor={"brand.50"}
          color={"brand.700"}
          textTransform={"none"}
          fontSize="sm"
        >
          <HStack>
            <InfoIcon w={3} h={3} color={"brand.700"} />
            <BodyXs>APR &#183; {aprPercentage}%</BodyXs>
          </HStack>
        </Badge>
        <Badge
          variant={"solid"}
          borderRadius={5}
          px={2}
          py={2}
          backgroundColor={"brand.50"}
          color={"brand.700"}
          textTransform={"none"}
          fontSize="sm"
        >
          <HStack>
            <InfoIcon w={3} h={3} color={"brand.700"} />
            <BodyXs>
              {"Slashing "} &#183; {`<${slashingPercentage}%`}
            </BodyXs>
          </HStack>
        </Badge>
      </HStack>
    </VStack>
  )
}
