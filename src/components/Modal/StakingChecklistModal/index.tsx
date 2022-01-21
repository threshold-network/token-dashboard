import { FC } from "react"
import {
  Button,
  Divider,
  Link,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react"
import { Body1, Body3, H5 } from "../../Typography"
import withBaseModal from "../withBaseModal"
import { useModal } from "../../../hooks/useModal"
import { BaseModalProps } from "../../../types"
import { ExternalLink, ModalType } from "../../../enums"
import StakingChecklist from "../../StakingChecklist"
import InfoBox from "../../InfoBox"

const StakingChecklistModal: FC<BaseModalProps> = ({ closeModal }) => {
  const { openModal } = useModal()

  return (
    <>
      <ModalHeader>Stake Tokens</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Stack spacing={6}>
          <InfoBox variant="modal">
            <H5 mb={4} color={useColorModeValue("gray.800", "white")}>
              Before you continue
            </H5>
            <Body1 color={useColorModeValue("gray.700", "white")}>
              Make sure you have the following items in check
            </Body1>
          </InfoBox>
          <StakingChecklist />
          <Body3 align="center" color="gray.500">
            Read more about the{" "}
            <Link
              href={ExternalLink.stakingContractLeanMore}
              target="_blank"
              color="brand.500"
              textDecoration="underline"
            >
              staking contract
            </Link>
          </Body3>
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
