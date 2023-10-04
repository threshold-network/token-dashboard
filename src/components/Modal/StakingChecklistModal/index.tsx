import { FC } from "react"
import {
  BodyLg,
  FlowStepStatus,
  H5,
  Alert,
  AlertDescription,
  AlertIcon,
  Button,
  Divider,
  ModalBody,
  ModalFooter,
  ModalHeader,
  useColorModeValue,
} from "@threshold-network/components"
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
        <H5 mr={2}>Staking timeline</H5>
      </ModalHeader>
      <ModalCloseButton top="3" />
      <ModalBody py="0">
        <InfoBox variant="modal">
          <BodyLg color={useColorModeValue("gray.700", "white")} as="span">
            <H5 as="h4">
              Review the timeline carefully for an overview of the requirements.
            </H5>
          </BodyLg>
        </InfoBox>
        <StakingTimeline mt="4" statuses={[FlowStepStatus.inactive]} />
        <Alert status="warning" mt="6">
          <AlertIcon />
          <AlertDescription>
            Staking in Threshold requires running a node.
          </AlertDescription>
        </Alert>
        <StakingContractLearnMore mt="10" mb="4" />
        <Divider />
      </ModalBody>
      <ModalFooter p="6">
        <Button onClick={closeModal} variant="outline" mr={3}>
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
