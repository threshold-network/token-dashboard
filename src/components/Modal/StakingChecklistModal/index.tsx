import { FC } from "react"
import {
  Button,
  Divider,
  Flex,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react"
import { BodyLg, BodySm, H5 } from "@threshold-network/components"
import withBaseModal from "../withBaseModal"
import { useModal } from "../../../hooks/useModal"
import { BaseModalProps } from "../../../types"
import { ModalType } from "../../../enums"
import StakingTimeline from "../../StakingTimeline"
import InfoBox from "../../InfoBox"
import { StakingContractLearnMore } from "../../Link"
import ModalCloseButton from "../ModalCloseButton"

const StakingChecklistModal: FC<BaseModalProps & { stakeAmount: string }> = ({
  closeModal,
  stakeAmount,
}) => {
  const { openModal } = useModal()

  return (
    <>
      <ModalHeader display="flex" alignItems="baseline">
        <H5 mr={2}>Stake Tokens</H5>
        <BodySm>(Step 1)</BodySm>
      </ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Stack spacing={6}>
          <InfoBox variant="modal">
            <BodyLg color={useColorModeValue("gray.700", "white")} as="span">
              <H5 mb={4}>Staking in Threshold requires running a node</H5>
              <BodyLg>
                Please review the staking timeline below for a handy overview of
                the staking requirements.
              </BodyLg>
            </BodyLg>
          </InfoBox>
          <Divider />
          <StakingTimeline />
          <StakingContractLearnMore mt="4rem !important" />
          <Divider />
        </Stack>
      </ModalBody>
      <ModalFooter>
        <Button onClick={closeModal} variant="outline" mr={2}>
          Cancel
        </Button>
        <Button
          onClick={() =>
            openModal(ModalType.ConfirmStakingParams, { stakeAmount })
          }
        >
          Continue
        </Button>
      </ModalFooter>
    </>
  )
}

export default withBaseModal(StakingChecklistModal)
