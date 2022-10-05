import { FC } from "react"
import {
  BoxLabel,
  BodySm,
  Button,
  HStack,
  Progress,
  StackProps,
} from "@threshold-network/components"
import { CheckCircleIcon } from "@chakra-ui/icons"
import { AppAuthDataProps } from "../../AuthorizeStakingApps/AuthorizeApplicationsCardCheckbox"
import { Link as RouterLink } from "react-router-dom"
import { formatPercentage } from "../../../../utils/percentage"

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
      <BoxLabel
        size="sm"
        status="secondary"
        icon={
          isAuthorized ? (
            <CheckCircleIcon w={4} h={4} color="green.500" />
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
        <Button
          as={RouterLink}
          to={`/staking/${stakingProvider}/authorize`}
          size="sm"
          variant="outline"
        >
          Authorize Application
        </Button>
      )}
    </HStack>
  )
}

export default AuthorizeApplicationRow
