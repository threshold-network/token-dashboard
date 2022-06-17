import { FC } from "react"
import { List, ListItem, ListIcon, Button } from "@chakra-ui/react"
import { MdCheckCircle, MdRemoveCircle } from "react-icons/all"
import InfoBox from "../../InfoBox"
import {
  StakeCardHeader,
  StakeCardHeaderTitle,
  StakeCardProviderAddress,
} from "../../../pages/Staking/StakeCard"
import TokenBalance from "../../TokenBalance"
import { BodyMd, H3, Card } from "@threshold-network/components"
import ExternalLink from "../../ExternalLink"
import { dateToUnixTimestamp } from "../../../utils/date"
import { AddressZero } from "../../../web3/utils"
import { ExternalHref } from "../../../enums"
import { StakeData } from "../../../types/staking"
import { stakingBonus } from "../../../constants"

export const EligibilityCard: FC<{ stake: StakeData }> = ({ stake }) => {
  const isFirstRequirementMet =
    stake.bonusEligibility.eligibleStakeAmount !== "0" &&
    stake.bonusEligibility.hasActiveStake &&
    !stake.bonusEligibility.hasUnstakeAfterBonusDeadline

  const isSecondRequirementMet = stake.bonusEligibility.hasPREConfigured

  const canTopUpStakeToGetBonus =
    stake.bonusEligibility.eligibleStakeAmount === "0" &&
    stake.bonusEligibility.hasActiveStake &&
    !stake.bonusEligibility.hasUnstakeAfterBonusDeadline &&
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
        <StakeCardHeader>
          <StakeCardHeaderTitle stake={stake} />
        </StakeCardHeader>
        <BodyMd my="4">Staking Bonus</BodyMd>
        <TokenBalance
          tokenAmount={stake.bonusEligibility.reward}
          withSymbol
          tokenSymbol="T"
          isLarge
        />
        <StakeCardProviderAddress
          stakingProvider={stake.stakingProvider}
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
        <StakeCardHeader>
          <StakeCardHeaderTitle stake={null} />
        </StakeCardHeader>
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
