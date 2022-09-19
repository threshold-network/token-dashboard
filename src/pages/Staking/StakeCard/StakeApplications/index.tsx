import { FC } from "react"
import {
  Alert,
  AlertDescription,
  AlertIcon,
  BodyMd,
  Box,
  Button,
  Link,
} from "@threshold-network/components"
import AuthorizeApplicationRow from "./AuthorizeApplicationRow"
import { Link as RouterLink } from "react-router-dom"
import { useStakingAppDataByStakingProvider } from "../../../../hooks/staking-applications"

const StakeApplications: FC<{ stakingProvider: string }> = ({
  stakingProvider,
}) => {
  const areNodesMissing = true
  const tbtcApp = useStakingAppDataByStakingProvider("tbtc", stakingProvider)
  const randomBeaconApp = useStakingAppDataByStakingProvider(
    "randomBeacon",
    stakingProvider
  )

  // TODO: This will probably be fetched from contracts
  const appsAuthData = {
    tbtc: {
      label: "tBTC",
      isAuthorized: tbtcApp.isAuthorized,
      percentage: tbtcApp.percentage,
      isAuthRequired: true,
    },
    randomBeacon: {
      label: "Random Beacon",
      isAuthorized: randomBeaconApp.isAuthorized,
      percentage: randomBeaconApp.percentage,
      isAuthRequired: true,
    },
    pre: {
      label: "PRE",
      isAuthorized: false,
      percentage: 0,
      isAuthRequired: false,
    },
  }

  return (
    <Box>
      <BodyMd>Applications</BodyMd>
      {areNodesMissing && (
        <Alert status="error" my={4} px={2} py={1}>
          <AlertIcon />
          <AlertDescription>
            Missing Nodes.{" "}
            <Link
              // TODO: Do not forget to update this link
              href={"/overview"}
              target="_blank"
              textDecoration={"underline"}
            >
              More info
            </Link>
          </AlertDescription>
        </Alert>
      )}
      <AuthorizeApplicationRow
        mb={"3"}
        appAuthData={appsAuthData.tbtc}
        stakingProvider={stakingProvider}
      />
      <AuthorizeApplicationRow
        appAuthData={appsAuthData.randomBeacon}
        stakingProvider={stakingProvider}
      />
      <Button
        mt="5"
        width="100%"
        as={RouterLink}
        to={`/staking/authorize/${stakingProvider}`}
      >
        Configure Apps
      </Button>
    </Box>
  )
}

export default StakeApplications
