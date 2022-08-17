import { Progress, StackProps } from "@chakra-ui/react"
import { FC } from "react"
import { Badge, BodySm, Button, HStack } from "@threshold-network/components"
import { CheckCircleIcon } from "@chakra-ui/icons"
import { AppAuthDataProps } from "../../AuthorizeStakingApps/AuthorizeApplicationsCardCheckbox"

export interface AuthorizeApplicationRowProps extends StackProps {
  appAuthData: AppAuthDataProps
  onAuthorizeClick: () => void
}

const AuthorizeApplicationRow: FC<AuthorizeApplicationRowProps> = ({
  appAuthData,
  onAuthorizeClick,
  ...restProps
}) => {
  const { label, isAuthorized, percentage } = appAuthData
  return (
    <HStack justify={"space-between"} {...restProps}>
      <Badge
        variant={"solid"}
        borderRadius={5}
        px={2}
        py={2}
        backgroundColor={"gray.50"}
        color={"gray.700"}
        textTransform={"none"}
      >
        <HStack>
          {isAuthorized && <CheckCircleIcon w={5} h={5} color={"green.500"} />}
          <BodySm>{label} App</BodySm>
        </HStack>
      </Badge>
      {isAuthorized ? (
        <HStack width={"40%"}>
          <Progress
            value={percentage}
            size="lg"
            width="90%"
            colorScheme="brand"
            borderRadius={50}
          ></Progress>
          <BodySm>{percentage}%</BodySm>
        </HStack>
      ) : (
        <Button size="sm" variant="outline" onClick={onAuthorizeClick}>
          Authorize Application
        </Button>
      )}
    </HStack>
  )
}

export default AuthorizeApplicationRow
