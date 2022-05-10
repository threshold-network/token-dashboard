import { FC } from "react"
import {
  chakra,
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
import { H5, Body1, Body3 } from "../../Typography"
import { Divider } from "../../Divider"
import { StakingBonusReadMore } from "../../ExternalLink"
import { BaseModalProps } from "../../../types"
import { StakeData } from "../../../types/staking"
import ChecklistGroup from "../../ChecklistGroup"
import { EligibilityCard } from "./EligibilityCard"

export const EligibilityConfirmation: FC<
  BaseModalProps & { stakes: StakeData[] }
> = ({ closeModal, stakes }) => {
  const isEligible = stakes.every(
    (stake) =>
      stake.bonusEligibility.hasActiveStake &&
      stake.bonusEligibility.hasPREConfigured &&
      !stake.bonusEligibility.hasUnstakeAfterBonusDeadline
  )

  const title = isEligible
    ? "You are eligible"
    : "Some of your stakes are not eligible yet. Make sure you meet the criteria and check again!"

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
          <Body1 mt="4">
            To receive a Staking Bonus any stake needs to meet two requirements.
          </Body1>
          <Body1 mt="2">The Staking Bonus is 2.5% of your stake.</Body1>
        </InfoBox>
        <Divider />
        <Box ml="4">
          <ChecklistGroup
            title="Requirement 1 - Active stake"
            checklistItems={[
              {
                title: "Have an active stake before June the 1st",
                subTitle: (
                  <Body3 color={useColorModeValue("gray.500", "gray.300")}>
                    Your Staking Bonus will be added to your Staking Rewards.
                    You can withdraw them starting{" "}
                    <chakra.strong color="brand.500">July 15th.</chakra.strong>{" "}
                    The Staking Bonus can be accumulated along the Staking
                    Rewards.
                  </Body3>
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
          {stakes.map(renderEligibilityCheck)}
        </List>
        <StakingBonusReadMore />
        <Divider mb="0" mt="4" />
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
