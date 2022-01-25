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
import { Body1, H5 } from "../../Typography"
import withBaseModal from "../withBaseModal"
import { useModal } from "../../../hooks/useModal"
import { BaseModalProps } from "../../../types"
import { ModalType } from "../../../enums"
import StakingChecklist from "../../StakingChecklist"
import InfoBox from "../../InfoBox"
import { StakingContractLearnMore } from "../../ExternalLink"

const StakingChecklistModal: FC<BaseModalProps> = ({ closeModal }) => {
  const { openModal } = useModal()

  return (
    <>
      <ModalHeader>Stake Tokens</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Stack spacing={6}>
          <InfoBox variant="modal">
            <Body1 color={useColorModeValue("gray.700", "white")}>
              <H5 mb={4}>Before you continue</H5>
              <Body1>
                Please take note about the Staking Process and requirements you
                need to meet so you can gain rewards.
              </Body1>
            </Body1>
          </InfoBox>
          <StakingChecklist />
          <StakingContractLearnMore />
          <Divider />
        </Stack>
      </ModalBody>
      <ModalFooter>
        <Button onClick={closeModal} variant="outline" mr={2}>
          Cancel
        </Button>
        <Button onClick={() => openModal(ModalType.ConfirmStakingParams)}>
          Stake
        </Button>
      </ModalFooter>
    </>
  )
}

export default withBaseModal(StakingChecklistModal)
