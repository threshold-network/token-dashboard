import { FC } from "react"
import {
  Box,
  Flex,
  Badge,
  BodyLg,
  BodyMd,
  HStack,
} from "@threshold-network/components"
import TokenBalance from "../../../../components/TokenBalance"
import { formatTokenAmount } from "../../../../utils/formatAmount"
import { useSelector } from "react-redux"
import { RootState } from "../../../../store"
import { selectRewardsByStakingProvider } from "../../../../store/rewards"
import { StakeData } from "../../../../types"

const StakeRewards: FC<{ stake: StakeData; isPRESet: boolean }> = ({
  stake,
  isPRESet,
}) => {
  const { total, bonus } = useSelector((state: RootState) =>
    selectRewardsByStakingProvider(state, stake.stakingProvider)
  )

  return (
    <Box>
      <HStack mt="10" mb="4">
        <BodyMd>Total Rewards</BodyMd>
        {bonus !== "0" && (
          <Badge variant="magic" mt="1rem !important" ml="auto !important">
            staking bonus
          </Badge>
        )}
      </HStack>
      <Flex alignItems="end" justifyContent="space-between">
        <TokenBalance tokenAmount={total} withSymbol tokenSymbol="T" isLarge />
        {!isPRESet ? (
          <Badge colorScheme="red" variant="solid" size="medium" ml="3">
            missing PRE
          </Badge>
        ) : (
          bonus !== "0" && <BodyLg>{formatTokenAmount(bonus)} T</BodyLg>
        )}
      </Flex>
    </Box>
  )
}

export default StakeRewards
