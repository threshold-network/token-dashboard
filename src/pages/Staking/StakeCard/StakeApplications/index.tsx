import { FC } from "react"
import { BodyMd, Box, Button } from "@threshold-network/components"
import AuthorizeApplicationRow from "./AuthorizeApplicationRow"
import { Link as RouterLink } from "react-router-dom"
import { useStakingAppDataByStakingProvider } from "../../../../hooks/staking-applications"
import { AppAuthDataProps } from "../../AuthorizeStakingApps/AuthorizeApplicationsCardCheckbox"

const StakeApplications: FC<{ stakingProvider: string }> = ({
  stakingProvider,
}) => {
  const tbtcApp = useStakingAppDataByStakingProvider("tbtc", stakingProvider)
  const randomBeaconApp = useStakingAppDataByStakingProvider(
    "randomBeacon",
    stakingProvider
  )

  const appsAuthData: {
    [appName: string]: AppAuthDataProps
  } = {
    tbtc: {
      stakingAppId: "tbtc",
      label: "tBTC",
      isAuthorized: tbtcApp.isAuthorized,
      percentage: tbtcApp.percentage,
      authorizedStake: tbtcApp.authorizedStake,
      isAuthRequired: true,
    },
    randomBeacon: {
      stakingAppId: "randomBeacon",
      label: "Random Beacon",
      isAuthorized: randomBeaconApp.isAuthorized,
      percentage: randomBeaconApp.percentage,
      authorizedStake: randomBeaconApp.authorizedStake,
      isAuthRequired: true,
    },
    pre: {
      stakingAppId: "pre",
      label: "PRE",
      isAuthorized: false,
      percentage: 0,
      authorizedStake: "0",
      isAuthRequired: false,
    },
  }

  return (
    <Box>
      <BodyMd>Applications</BodyMd>
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
        to={`/staking/${stakingProvider}/authorize`}
      >
        Configure Apps
      </Button>
    </Box>
  )
}

export default StakeApplications
