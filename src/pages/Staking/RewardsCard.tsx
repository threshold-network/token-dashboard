import { FC } from "react"
import { Button, useColorModeValue, VStack } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import {
  BodyMd,
  BodyLg,
  H5,
  LabelSm,
  Card,
  HStack,
  Badge,
  useCountdown,
} from "@threshold-network/components"
import InfoBox from "../../components/InfoBox"
import { useModal } from "../../hooks/useModal"
import { ModalType } from "../../enums"
import { formatTokenAmount } from "../../utils/formatAmount"
import { BigNumber } from "ethers"
import { useNextRewardsDropDate } from "../../hooks/useNextRewardsDropDate"

const RewardsCard: FC<{
  totalRewardsBalance: string
  totalBonusBalance: string
}> = ({ totalRewardsBalance, totalBonusBalance }) => {
  const { active } = useWeb3React()
  const { openModal } = useModal()

  const dropTimestamp = useNextRewardsDropDate()
  const { days, hours, minutes, seconds } = useCountdown(dropTimestamp, true)

  const hasBonusRewards = BigNumber.from(totalBonusBalance).gt(0)
  const hasRewards = BigNumber.from(totalRewardsBalance).gt(0)

  const timerColor = useColorModeValue("brand.500", "brand.300")

  return (
    <Card>
      <HStack justifyContent={"space-between"} alignItems="flex-start">
        <LabelSm textTransform="uppercase">Rewards</LabelSm>
        {hasBonusRewards ? (
          <Badge variant="magic" ml="auto !important">
            staking bonus
          </Badge>
        ) : (
          <VStack alignItems={"flex-end"}>
            <LabelSm textTransform="uppercase">Next emission</LabelSm>
            <BodyMd
              as="span"
              color={timerColor}
            >{`${days}d : ${hours}h : ${minutes}m : ${seconds}s`}</BodyMd>
          </VStack>
        )}
      </HStack>
      <BodyMd mt="6">Total Rewards</BodyMd>
      <InfoBox mt="2" direction="row" p={active ? 0 : 4} alignItems="center">
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
            Monthly staking rewards are distributed retroactively by the
            Threshold Council and are claimable on or about the beginning of the
            subsequent month.
          </BodyMd>
        )}
      </InfoBox>

      <Button
        mt="4"
        variant="outline"
        size="lg"
        disabled={!active || !hasRewards}
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
