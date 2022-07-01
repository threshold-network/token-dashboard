import { FC } from "react"
import { Button } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import {
  BodyMd,
  BodyLg,
  H5,
  LabelSm,
  Card,
  HStack,
  Badge,
} from "@threshold-network/components"
import InfoBox from "../../components/InfoBox"
import { useModal } from "../../hooks/useModal"
import { ModalType } from "../../enums"
import { formatTokenAmount } from "../../utils/formatAmount"
import { useCountdown } from "../../hooks/useCountdown"
import { BigNumber } from "ethers"

const RewardsCard: FC<{
  totalRewardsBalance: string
  totalBonusBalance: string
}> = ({ totalRewardsBalance, totalBonusBalance }) => {
  const { active } = useWeb3React()
  const { openModal } = useModal()
  const { days, hours, minutes, seconds } = useCountdown(1657843200)
  const hasBonusRewards = BigNumber.from(totalBonusBalance).gt(0)

  return (
    <Card>
      <LabelSm textTransform="uppercase">Rewards</LabelSm>
      <HStack mt="6">
        <BodyMd>Total Rewards</BodyMd>
        {hasBonusRewards ? (
          <Badge variant="magic" ml="auto !important">
            staking bonus
          </Badge>
        ) : (
          <BodyMd ml="auto !important">
            Next rewards emission:{" "}
            <BodyMd
              as="span"
              color="brand.500"
            >{`${days}d:${hours}h:${minutes}m:${seconds}s`}</BodyMd>
          </BodyMd>
        )}
      </HStack>
      <InfoBox mt="2" direction="row" p="0" alignItems="center">
        {active ? (
          <>
            <H5
              flex="2"
              p="4"
              borderRight={hasBonusRewards ? "1px solid" : undefined}
              borderColor={hasBonusRewards ? "gray.300" : undefined}
            >
              {formatTokenAmount(totalRewardsBalance)}
              <BodyLg as="span"> T</BodyLg>
            </H5>
            {hasBonusRewards && (
              <BodyLg flex="1" p="4" textAlign="right">
                {formatTokenAmount(totalBonusBalance)} T
              </BodyLg>
            )}
          </>
        ) : (
          <BodyMd>
            Rewards are released at the end of each month and can be claimed
            retroactively for March and April.
          </BodyMd>
        )}
      </InfoBox>

      <Button
        mt="4"
        variant="outline"
        size="lg"
        disabled={!active}
        isFullWidth
        onClick={() =>
          openModal(ModalType.ClaimingRewards, {
            totalRewardsAmount: totalRewardsBalance,
          })
        }
      >
        Claim All
      </Button>
    </Card>
  )
}

export default RewardsCard
