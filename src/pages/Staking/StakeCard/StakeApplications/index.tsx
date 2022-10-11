import { FC } from "react"
import { BodyMd, Box, Button, List } from "@threshold-network/components"
import { Link as RouterLink } from "react-router-dom"
import AuthorizeApplicationRow from "./AuthorizeApplicationRow"
import BundledRewardsAlert from "../../../../components/BundledRewardsAlert"
import { useStakingAppDataByStakingProvider } from "../../../../hooks/staking-applications"
import { useAppSelector } from "../../../../hooks/store"
import { useStakeCardContext } from "../../../../hooks/useStakeCardContext"

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

  const { isPRESet } = useStakeCardContext()

  return (
    <Box>
      <BodyMd mb="4">Applications</BodyMd>
      {(!tbtcApp.isAuthorized || !randomBeaconApp.isAuthorized) &&
        !isTbtcFetching &&
        !isRandomBeaconFetching && <BundledRewardsAlert mb="4" />}
      <List spacing={4}>
        <AuthorizeApplicationRow
          as="li"
          label="tBTC"
          isAuthorized={tbtcApp.isAuthorized}
          percentage={tbtcApp.percentage}
          stakingProvider={stakingProvider}
        />
        <AuthorizeApplicationRow
          as="li"
          label="Random Beacon"
          isAuthorized={randomBeaconApp.isAuthorized}
          percentage={randomBeaconApp.percentage}
          stakingProvider={stakingProvider}
        />
        <AuthorizeApplicationRow
          as="li"
          label="PRE"
          isAuthorized={isPRESet}
          percentage={100}
          stakingProvider={stakingProvider}
        />
      </List>
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
