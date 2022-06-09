import { FC } from "react"
import { useNavigate } from "react-router-dom"
import {
  Button,
  Icon,
  List,
  ListItem,
  Box,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
  useColorModeValue,
} from "@chakra-ui/react"
import { MdCheckCircle, MdRemoveCircle } from "react-icons/all"
import InfoBox from "../../InfoBox"
import {
  H5,
  BodyLg,
  BodySm,
  LineDivider,
  ChecklistGroup,
} from "@threshold-network/components"
import { StakingBonusReadMore } from "../../ExternalLink"
import { BaseModalProps } from "../../../types"
import { StakeData } from "../../../types/staking"
import { EligibilityCard, EmptyEligibilityCard } from "./EligibilityCard"

export const EligibilityConfirmation: FC<
  BaseModalProps & { stakes: StakeData[] }
> = ({ closeModal, stakes }) => {
  const navigate = useNavigate()

  const hasStakes = stakes.length > 0
  const isEligible =
    hasStakes &&
    stakes.every(
      (stake) =>
        stake.bonusEligibility.hasActiveStake &&
        stake.bonusEligibility.hasPREConfigured &&
        !stake.bonusEligibility.hasUnstakeAfterBonusDeadline
    )

  const title = isEligible
    ? "You are eligible"
    : "Some of your stakes are not eligible yet. Make sure you meet the criteria and check again!"

  const onStartStaking = () => {
    navigate("/staking")
    closeModal()
  }

  return (
    <>
      <ModalHeader>Staking Bonus</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <InfoBox variant="modal">
          <H5>
            <Icon
              as={isEligible ? MdCheckCircle : MdRemoveCircle}
              color={isEligible ? "green.500" : "red.500"}
            />
            &nbsp;{title}
          </H5>
          <BodyLg mt="4">
            To receive a Staking Bonus any stake needs to meet two requirements.
          </BodyLg>
          <BodyLg mt="2">The Staking Bonus is 3% of your stake.</BodyLg>
        </InfoBox>
        <LineDivider />
        <Box ml="4">
          <ChecklistGroup
            title="Requirement 1 - Active stake"
            checklistItems={[
              {
                title: "Have an active stake before June 1st",
                subTitle: (
                  <BodySm color={useColorModeValue("gray.500", "gray.300")}>
                    Your Staking Bonus will be added to your Staking Rewards.
                    You can withdraw them starting{" "}
                    <BodySm
                      as="span"
                      color={useColorModeValue("brand.500", "brand.550")}
                    >
                      July 15th.
                    </BodySm>{" "}
                    The Staking Bonus can be accumulated along the Staking
                    Rewards.
                  </BodySm>
                ),
              },
            ]}
          />
          <Box mt="4">
            <ChecklistGroup
              title="Requirement 2 - PRE Set up and working"
              checklistItems={[
                {
                  title: "PRE Node configured and working",
                  subTitle:
                    "You need a configured and working PRE node in order to get your Staking Bonus",
                },
              ]}
            />
          </Box>
        </Box>
        <List mt="12" spacing="4">
          {hasStakes ? (
            stakes.map(renderEligibilityCheck)
          ) : (
            <EmptyEligibilityCard onClickStartStakingBtn={onStartStaking} />
          )}
        </List>
        <StakingBonusReadMore />
        <LineDivider mb="0" mt="4" />
      </ModalBody>
      <ModalFooter>
        <Button onClick={closeModal} variant="outline" mr={2}>
          Dismiss
        </Button>
      </ModalFooter>
    </>
  )
}

const renderEligibilityCheck = (stake: StakeData) => (
  <ListItem key={stake.stakingProvider}>
    <EligibilityCard stake={stake} />
  </ListItem>
)
