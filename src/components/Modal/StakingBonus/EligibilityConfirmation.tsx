import { FC } from "react"
import {
  Button,
  List,
  ListIcon,
  ListItem,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react"
import { MdCheckCircle } from "react-icons/all"
import Confetti from "react-confetti"
import InfoBox from "../../InfoBox"
import { H5, Body1, Body2, Body3 } from "../../Typography"
import { Divider } from "../../Divider"
import { StakingBonusReadMore } from "../../ExternalLink"
import BoxLabel from "../../BoxLabel"
import { BaseModalProps } from "../../../types"
import { BonusEligibility } from "../../../types/staking"
import { formatTokenAmount } from "../../../utils/formatAmount"

export const EligibilityConfirmation: FC<
  BaseModalProps & { bonusEligibility: BonusEligibility }
> = ({ closeModal, bonusEligibility }) => {
  // TODO: Calculate the bonus.
  const reward = bonusEligibility.eligibleStakeAmount || "0"
  return (
    <>
      <ModalHeader>Staking Bonus</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Confetti
          width={440}
          height={250}
          confettiSource={{ x: 200, y: 40, h: 100, w: 100 }}
          numberOfPieces={50}
        />
        <InfoBox variant="modal">
          <H5>You are eligible for {formatTokenAmount(reward)}</H5>
          <Body1 mt="4">
            In order for any stake to get a Staking Bonus it needs to meet two
            requirements.
          </Body1>
          <Body1 mt="8">The Staking Bonus is 2.5% of your stake.</Body1>
        </InfoBox>
        <Divider />
        <List pl="8" pr="4">
          <ListItem>
            <BoxLabel w="fit-content" mb={4}>
              Requirement 1 - Active stake
            </BoxLabel>
            <List>
              <ListItem>
                <Stack direction="row">
                  <ListIcon
                    marginInlineEnd="unset"
                    as={MdCheckCircle}
                    mt="2px"
                    height="24px"
                    width="24px"
                    color="green.500"
                  />
                  <Body2
                    as="div"
                    color={useColorModeValue("gray.700", "white")}
                  >
                    Have an active stake before May the 15th
                    <Body3>
                      Your Staking Bonus will be added to your Staking Rewards.
                      You can withdraw them starting July 15th. The Staking
                      Bonus can be accumulated along the Staking Rewards.
                    </Body3>
                  </Body2>
                </Stack>
              </ListItem>
            </List>
          </ListItem>
          <ListItem mt="5">
            <BoxLabel w="fit-content" mb={4}>
              Requirement 2 - PRE Set up and working
            </BoxLabel>
            <List>
              <ListItem>
                <Stack direction="row">
                  <ListIcon
                    marginInlineEnd="unset"
                    as={MdCheckCircle}
                    mt="2px"
                    height="24px"
                    width="24px"
                    color="green.500"
                  />
                  <Body2
                    as="div"
                    color={useColorModeValue("gray.700", "white")}
                  >
                    PRE Node configured and working
                    <Body3>
                      You need a configured and working PRE node in order to get
                      your Staking Bonus.
                    </Body3>
                  </Body2>
                </Stack>
              </ListItem>
            </List>
          </ListItem>
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
