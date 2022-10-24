import { StakeData } from "../../../types"
import { FC } from "react"
import {
  Badge,
  BodyMd,
  Box,
  Card,
  Flex,
  H5,
  HStack,
  LineDivider,
  SimpleGrid,
  Stack,
} from "@threshold-network/components"
import { BigNumber } from "ethers"
import InfoBox from "../../../components/InfoBox"
import TokenBalance from "../../../components/TokenBalance"
import StakeDetailRow from "./StakeDetailRow"
import { StakeCardHeaderTitle } from "../StakeCard/Header/HeaderTitle"
import { useParams } from "react-router-dom"
import { selectStakeByStakingProvider } from "../../../store/staking"
import { selectRewardsByStakingProvider } from "../../../store/rewards"
import NodeStatusLabel from "./NodeStatusLabel"
import { useStakingAppDataByStakingProvider } from "../../../hooks/staking-applications"
import { useAppSelector } from "../../../hooks/store"

const StakeDetailsPage: FC = () => {
  const { stakingProviderAddress } = useParams()

  const stake = useAppSelector((state) =>
    selectStakeByStakingProvider(state, stakingProviderAddress!)
  ) as StakeData

  const tbtcApp = useStakingAppDataByStakingProvider(
    "tbtc",
    stake.stakingProvider
  )

  const randomBeaconApp = useStakingAppDataByStakingProvider(
    "randomBeacon",
    stake.stakingProvider
  )

  const isInActiveStake = BigNumber.from(stake?.totalInTStake ?? "0").isZero()

  const { total: rewardsForStake } = useAppSelector((state) =>
    selectRewardsByStakingProvider(state, stake.stakingProvider)
  )

  if (!stake)
    return <div>No Stake found for address: {stakingProviderAddress} </div>

  return (
    <Card>
      <HStack justify="space-between">
        <H5>Stake Details</H5>
        <Flex as="header" alignItems="center">
          <Badge
            colorScheme={isInActiveStake ? "gray" : "green"}
            variant="subtle"
            size="small"
            mr="2"
          >
            {isInActiveStake ? "inactive" : "active"}
          </Badge>
          <StakeCardHeaderTitle stakeType={stake.stakeType} />
        </Flex>
      </HStack>
      <LineDivider />
      <SimpleGrid
        columns={[1, null, null, 2]}
        spacing="4"
        w="100%"
        alignItems="self-start"
      >
        <Stack>
          <Box>
            <BodyMd>Total Staked Balance</BodyMd>
            <InfoBox>
              <TokenBalance
                tokenAmount={stake.totalInTStake.toString()}
                withSymbol
                tokenSymbol="T"
                isLarge
              />
            </InfoBox>
          </Box>
          <Box>
            <BodyMd>Total Rewards</BodyMd>
            <InfoBox>
              <TokenBalance
                tokenAmount={rewardsForStake}
                withSymbol
                tokenSymbol="T"
                isLarge
              />
            </InfoBox>
          </Box>
        </Stack>
        <Stack>
          <StakeDetailRow
            isPrimary
            label="Provider Address"
            isAddress
            address={stake.stakingProvider}
          />
          <StakeDetailRow
            label="Authorizer Address"
            isAddress
            address={stake.authorizer}
          />
          <StakeDetailRow
            label="Beneficiary Address"
            isAddress
            address={stake.beneficiary}
          />
          <StakeDetailRow label="PRE Node Status">
            <NodeStatusLabel isAuthorized />
          </StakeDetailRow>
          <StakeDetailRow label="tBTC Node Status">
            <NodeStatusLabel isAuthorized={tbtcApp.isAuthorized} />
          </StakeDetailRow>
          <StakeDetailRow label="Random Beacon Node Status">
            <NodeStatusLabel isAuthorized={randomBeaconApp.isAuthorized} />
          </StakeDetailRow>
        </Stack>
      </SimpleGrid>
    </Card>
  )
}

export default StakeDetailsPage
