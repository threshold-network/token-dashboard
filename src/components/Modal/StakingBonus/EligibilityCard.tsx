import { FC } from "react"
import { useSelector } from "react-redux"
import { List, ListItem, ListIcon, Button, Flex } from "@chakra-ui/react"
import { MdCheckCircle, MdRemoveCircle } from "react-icons/all"
import InfoBox from "../../InfoBox"
import TokenBalance from "../../TokenBalance"
import { BodyMd, H3, Card } from "@threshold-network/components"
import ExternalLink from "../../ExternalLink"
import { dateToUnixTimestamp } from "../../../utils/date"
import { AddressZero } from "../../../web3/utils"
import { ExternalHref } from "../../../enums"
import { BonusEligibility, StakeData } from "../../../types"
import { stakingBonus } from "../../../constants"
import { StakeCardHeaderTitle } from "../../../pages/Staking/StakeCard/Header/HeaderTitle"
import { StakeCardProviderAddress } from "../../../pages/Staking/StakeCard/ProviderAddress"
import { selectStakeByStakingProvider } from "../../../store/staking"
import { RootState } from "../../../store"

export const EligibilityCard: FC<{
  stakingProvider: string
  bonusEligibility: BonusEligibility
}> = ({ stakingProvider, bonusEligibility }) => {
  const stake = useSelector((state: RootState) =>
    selectStakeByStakingProvider(state, stakingProvider)
  ) as StakeData

  const isFirstRequirementMet =
    bonusEligibility.eligibleStakeAmount !== "0" &&
    bonusEligibility.hasActiveStake &&
    !bonusEligibility.hasUnstakeAfterBonusDeadline

  const isSecondRequirementMet = bonusEligibility.hasPREConfigured

  const canTopUpStakeToGetBonus =
    bonusEligibility.eligibleStakeAmount === "0" &&
    bonusEligibility.hasActiveStake &&
    !bonusEligibility.hasUnstakeAfterBonusDeadline &&
    dateToUnixTimestamp() < stakingBonus.BONUS_DEADLINE_TIMESTAMP

  return (
    <>
      <Card
        borderColor={
          !isFirstRequirementMet || !isSecondRequirementMet
            ? "red.200"
            : undefined
        }
      >
        <Flex as="header" alignItems="center">
          <StakeCardHeaderTitle stake={stake} />
        </Flex>
        <BodyMd my="4">Staking Bonus</BodyMd>
        <TokenBalance
          tokenAmount={bonusEligibility.reward}
          withSymbol
          tokenSymbol="T"
          isLarge
        />
        <StakeCardProviderAddress
          stakingProvider={stakingProvider}
          mb="6"
          mt="4"
        />
        <RequirementList
          conditions={[isFirstRequirementMet, isSecondRequirementMet]}
        />
      </Card>
      {!isSecondRequirementMet && (
        <Button
          mt="4"
          as={ExternalLink}
          href={ExternalHref.preNodeSetup}
          text="Set PRE"
          textDecoration="none"
          isFullWidth
        />
      )}
      {canTopUpStakeToGetBonus && (
        <Button mt="4" isFullWidth>
          Top-up Stake
        </Button>
      )}
    </>
  )
}

export const EmptyEligibilityCard: FC<{
  onClickStartStakingBtn: () => void
}> = ({ onClickStartStakingBtn }) => {
  return (
    <>
      <Card borderColor={"red.200"}>
        <Flex as="header" alignItems="center">
          <StakeCardHeaderTitle stake={null} />
        </Flex>
        <BodyMd my="4">Staking Bonus</BodyMd>
        <H3>You have no stake yet</H3>
        <StakeCardProviderAddress stakingProvider={AddressZero} mb="6" mt="4" />
        <RequirementList conditions={[false, false]} />
      </Card>
      <Button mt="4" isFullWidth onClick={onClickStartStakingBtn}>
        Start Staking
      </Button>
    </>
  )
}

const RequirementList: FC<{ conditions: boolean[] }> = ({ conditions }) => {
  return (
    <InfoBox>
      <List spacing="4">
        <ListItem>
          <ListIcon
            width="24px"
            height="24px"
            as={conditions[0] ? MdCheckCircle : MdRemoveCircle}
            color={conditions[0] ? "green.500" : "red.500"}
          />
          Have an active stake before June 1st
        </ListItem>
        <ListItem>
          <ListIcon
            width="24px"
            height="24px"
            as={conditions[1] ? MdCheckCircle : MdRemoveCircle}
            color={conditions[1] ? "green.500" : "red.500"}
          />
          PRE Node configured and working
        </ListItem>
      </List>
    </InfoBox>
  )
}
