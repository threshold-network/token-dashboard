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
import NodeStatusLabel from "./NodeStatusLabel"
import TokenBalance from "../../../components/TokenBalance"
import StakeDetailRow from "./StakeDetailRow"
import { StakeCardHeaderTitle } from "../StakeCard/Header/HeaderTitle"
import { useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import { RootState } from "../../../store"
import { selectStakeByStakingProvider } from "../../../store/staking"
import { selectRewardsByStakingProvider } from "../../../store/rewards"

const StakeDetailsPage: FC = () => {
  const { stakingProviderAddress } = useParams()
  const stake = useSelector((state: RootState) =>
    selectStakeByStakingProvider(state, stakingProviderAddress!)
  ) as StakeData

  const isInActiveStake = stake
    ? BigNumber.from(stake?.totalInTStake).isZero()
    : false

  const { total: rewardsForStake } = useSelector((state: RootState) =>
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
            value={stake.stakingProvider}
          />
          <StakeDetailRow label="Authorizer Address" value={stake.authorizer} />
          <StakeDetailRow
            label="Beneficiary Address"
            value={stake.beneficiary}
          />
          <StakeDetailRow
            label="PRE Node Status"
            // TODO: These statuses need to be computed
            value={<NodeStatusLabel status="success" />}
          />
          <StakeDetailRow
            label="TBTC Node Status"
            // TODO: These statuses need to be computed
            value={<NodeStatusLabel status="warning" />}
          />
          <StakeDetailRow
            label="Random Beacon Node Status"
            // TODO: These statuses need to be computed
            value={<NodeStatusLabel status="error" />}
          />
        </Stack>
      </SimpleGrid>
    </Card>
  )
}

export default StakeDetailsPage
