import { FC } from "react"
import {
  BoxLabel,
  BodySm,
  HStack,
  Progress,
  StackProps,
  useColorModeValue,
} from "@threshold-network/components"
import { CheckCircleIcon } from "@chakra-ui/icons"
import { formatPercentage } from "../../../../utils/percentage"
import ButtonLink from "../../../../components/ButtonLink"

export interface AuthorizeApplicationRowProps extends StackProps {
  label: string
  isAuthorized: boolean
  percentage: number
  stakingProvider: string
}

const AuthorizeApplicationRow: FC<AuthorizeApplicationRowProps> = ({
  label,
  isAuthorized,
  percentage,
  stakingProvider,
  ...restProps
}) => {
  const iconColor = useColorModeValue("green.500", "green.300")

  return (
    <HStack justify="space-between" {...restProps}>
      <BoxLabel
        size="sm"
        status="secondary"
        icon={
          isAuthorized ? (
            <CheckCircleIcon w={4} h={4} color={iconColor} />
          ) : null
        }
      >
        {label} App
      </BoxLabel>
      {isAuthorized ? (
        <HStack width="40%">
          <Progress
            value={percentage}
            size="lg"
            width="90%"
            colorScheme="brand"
            borderRadius={50}
          />
          <BodySm>{formatPercentage(percentage, undefined, true)}</BodySm>
        </HStack>
      ) : (
        <ButtonLink
          size="sm"
          variant="outline"
          to={`/staking/${stakingProvider}/authorize`}
        >
          Authorize Application
        </ButtonLink>
      )}
    </HStack>
  )
}

export default AuthorizeApplicationRow
