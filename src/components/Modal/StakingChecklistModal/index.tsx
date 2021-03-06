import { FC } from "react"
import {
  Button,
  Divider,
  ModalBody,
  ModalCloseButton,
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
import StakingChecklist from "../../StakingChecklist"
import InfoBox from "../../InfoBox"
import { StakingContractLearnMore } from "../../ExternalLink"

const StakingChecklistModal: FC<BaseModalProps & { stakeAmount: string }> = ({
  closeModal,
  stakeAmount,
}) => {
  const { openModal } = useModal()

  return (
    <>
      <ModalHeader>Stake Tokens</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Stack spacing={6}>
          <InfoBox variant="modal">
            <BodyLg color={useColorModeValue("gray.700", "white")} as="span">
              <H5 mb={4}>Before you continue</H5>
              <BodyLg>
                Please take note about the Staking Process and requirements you
                need to meet so you can gain rewards.
              </BodyLg>
            </BodyLg>
          </InfoBox>
          <Divider />
          <StakingChecklist />
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
          Stake
        </Button>
      </ModalFooter>
    </>
  )
}

export default withBaseModal(StakingChecklistModal)
