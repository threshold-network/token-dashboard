import { FC } from "react"
import {
  BoxLabel,
  BodySm,
  HStack,
  Progress,
  StackProps,
} from "@threshold-network/components"
import { CheckCircleIcon } from "@chakra-ui/icons"
import { AppAuthDataProps } from "../../AuthorizeStakingApps/AuthorizeApplicationsCardCheckbox"
import { formatPercentage } from "../../../../utils/percentage"
import ButtonLink from "../../../../components/ButtonLink"

export interface AuthorizeApplicationRowProps extends StackProps {
  appAuthData: AppAuthDataProps
  stakingProvider: string
}

const AuthorizeApplicationRow: FC<AuthorizeApplicationRowProps> = ({
  appAuthData,
  stakingProvider,
  ...restProps
}) => {
  const { label, isAuthorized, percentage } = appAuthData
  return (
    <HStack justify="space-between" {...restProps}>
      <BoxLabel>
        <HStack>
          {isAuthorized && <CheckCircleIcon w={4} h={4} color="green.500" />}
          <BodySm>{label} App</BodySm>
        </HStack>
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
