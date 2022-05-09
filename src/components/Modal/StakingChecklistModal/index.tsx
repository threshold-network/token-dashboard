import { FC, useState } from "react"
import {
  Button,
  Checkbox,
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

const StakingChecklistModal: FC<BaseModalProps> = ({ closeModal }) => {
  const { openModal } = useModal()
  const [alphaConsent, setAlphaConsent] = useState(false)

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
          <StakingChecklist />
          <StakingContractLearnMore />
          <Checkbox
            checked={alphaConsent}
            onChange={() => setAlphaConsent(!alphaConsent)}
            spacing="1rem"
            color={useColorModeValue("gray.500", "gray.300")}
          >
            I am aware this is an alpha version and I have read the requirements
            for Threshold Staking.
          </Checkbox>
          <Divider />
        </Stack>
      </ModalBody>
      <ModalFooter>
        <Button onClick={closeModal} variant="outline" mr={2}>
          Cancel
        </Button>
        <Button
          onClick={() => openModal(ModalType.ConfirmStakingParams)}
          disabled={!alphaConsent}
        >
          Stake
        </Button>
      </ModalFooter>
    </>
  )
}

export default withBaseModal(StakingChecklistModal)
