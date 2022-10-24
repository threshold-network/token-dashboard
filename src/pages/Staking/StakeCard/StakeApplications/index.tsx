import { FC } from "react"
import { BodyMd, Box } from "@threshold-network/components"
import AuthorizeApplicationRow from "./AuthorizeApplicationRow"
import { useStakingAppDataByStakingProvider } from "../../../../hooks/staking-applications"
import { AppAuthDataProps } from "../../AuthorizeStakingApps/AuthorizeApplicationsCardCheckbox"
import BundledRewardsAlert from "../../../../components/BundledRewardsAlert"
import { useAppSelector } from "../../../../hooks/store"
import ButtonLink from "../../../../components/ButtonLink"

const StakeApplications: FC<{ stakingProvider: string }> = ({
  stakingProvider,
}) => {
  const tbtcApp = useStakingAppDataByStakingProvider("tbtc", stakingProvider)
  const randomBeaconApp = useStakingAppDataByStakingProvider(
    "randomBeacon",
    stakingProvider
  )
  const isTbtcFetching = useAppSelector(
    (state) => state.applications.tbtc.stakingProviders.isFetching
  )
  const isRandomBeaconFetching = useAppSelector(
    (state) => state.applications.randomBeacon.stakingProviders.isFetching
  )

  const appsAuthData: {
    [appName: string]: AppAuthDataProps
  } = {
    tbtc: {
      ...tbtcApp,
      stakingAppId: "tbtc",
      label: "tBTC",
      isAuthRequired: true,
    },
    randomBeacon: {
      ...randomBeaconApp,
      stakingAppId: "randomBeacon",
      label: "Random Beacon",
      isAuthRequired: true,
    },
    pre: {
      stakingAppId: "pre",
      label: "PRE",
      isAuthRequired: false,
    },
  }

  return (
    <Box>
      <BodyMd>Applications</BodyMd>
      {(!tbtcApp.isAuthorized || !randomBeaconApp.isAuthorized) &&
        !isTbtcFetching &&
        !isRandomBeaconFetching && <BundledRewardsAlert mb="4" />}
      <AuthorizeApplicationRow
        my={"3"}
        appAuthData={appsAuthData.tbtc}
        stakingProvider={stakingProvider}
      />
      <AuthorizeApplicationRow
        appAuthData={appsAuthData.randomBeacon}
        stakingProvider={stakingProvider}
      />
      <ButtonLink
        mt="5"
        isFullWidth
        to={`/staking/${stakingProvider}/authorize`}
      >
        Configure Apps
      </ButtonLink>
    </Box>
  )
}

export default StakeApplications
