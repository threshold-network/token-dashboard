import { FC } from "react"
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Button,
  Divider,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react"
import { BodyLg, H5 } from "@threshold-network/components"
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
      <ModalCloseButton />
      <ModalBody>
        <Stack spacing={6}>
          <InfoBox variant="modal">
            <BodyLg color={useColorModeValue("gray.700", "white")} as="span">
              <H5 as="h4">
                Review the timeline carefully for an overview of the
                requirements.
              </H5>
            </BodyLg>
          </InfoBox>
          <Divider />
          <StakingTimeline />
          <Alert status="warning">
            <AlertIcon />
            <AlertDescription>
              Staking in Threshold requires running a node.
            </AlertDescription>
          </Alert>
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
