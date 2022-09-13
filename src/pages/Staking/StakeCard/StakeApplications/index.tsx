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
import { StakeData } from "../../../../types"
import AuthorizeApplicationRow from "./AuthorizeApplicationRow"
import { Link as RouterLink } from "react-router-dom"
import { useStakingAppDataByStakingProvider } from "../../../../hooks/staking-applications"
import { AppAuthDataProps } from "../../AuthorizeStakingApps/AuthorizeApplicationsCardCheckbox"

const StakeApplications: FC<{ stake: StakeData }> = ({ stake }) => {
  const areNodesMissing = true
  const tbtcApp = useStakingAppDataByStakingProvider(
    "tbtc",
    stake.stakingProvider
  )
  const randomBeaconApp = useStakingAppDataByStakingProvider(
    "randomBeacon",
    stake.stakingProvider
  )

  // TODO: This will probably be fetched from contracts
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
      authorizedStake: stake.totalInTStake,
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
        stakingProvider={stake.stakingProvider}
      />
      <AuthorizeApplicationRow
        appAuthData={appsAuthData.randomBeacon}
        stakingProvider={stake.stakingProvider}
      />
      <Button
        mt="5"
        width="100%"
        as={RouterLink}
        to={`/staking/authorize/${stake.stakingProvider}`}
      >
        Configure Apps
      </Button>
    </Box>
  )
}

export default StakeApplications
