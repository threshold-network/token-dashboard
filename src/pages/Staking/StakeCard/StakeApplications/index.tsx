import { FC } from "react"
import { BodyMd, Box, List } from "@threshold-network/components"
import AuthorizeApplicationRow from "./AuthorizeApplicationRow"
import BundledRewardsAlert from "../../../../components/BundledRewardsAlert"
import { useStakingAppDataByStakingProvider } from "../../../../hooks/staking-applications"
import { useAppSelector } from "../../../../hooks/store"
import { useStakeCardContext } from "../../../../hooks/useStakeCardContext"
import ButtonLink from "../../../../components/ButtonLink"

const StakeApplications: FC<{ stakingProvider: string }> = ({
  stakingProvider,
}) => {
  const tbtcApp = useStakingAppDataByStakingProvider("tbtc", stakingProvider)
  const randomBeaconApp = useStakingAppDataByStakingProvider(
    "randomBeacon",
    stakingProvider
  )
  const tacoApp = useStakingAppDataByStakingProvider("taco", stakingProvider)
  const isTbtcFetching = useAppSelector(
    (state) => state.applications.tbtc.stakingProviders.isFetching
  )
  const isRandomBeaconFetching = useAppSelector(
    (state) => state.applications.randomBeacon.stakingProviders.isFetching
  )
  const isTacoFetching = useAppSelector(
    (state) => state.applications.taco.stakingProviders.isFetching
  )

  const { isInactiveStake } = useStakeCardContext()

  return (
    <Box>
      <BodyMd mb="4">Applications</BodyMd>
      {(!tbtcApp.isAuthorized || !randomBeaconApp.isAuthorized || !tacoApp.isAuthorized) &&
        !isTbtcFetching &&
        !isTacoFetching &&
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
          label="TACo"
          isAuthorized={tacoApp.isAuthorized}
          percentage={tacoApp.percentage}
          stakingProvider={stakingProvider}
        />
      </List>
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
