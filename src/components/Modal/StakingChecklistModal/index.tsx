import { FC } from "react"
import {
  Box,
  Button,
  Divider,
  Link,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
} from "@chakra-ui/react"
import { Body1, Body3, H5 } from "../../Typography"
import withBaseModal from "../withBaseModal"
import { useModal } from "../../../hooks/useModal"
import { BaseModalProps } from "../../../types"
import { ModalType } from "../../../enums"
import StakingChecklist from "../../StakingChecklist"

const StakingChecklistModal: FC<BaseModalProps> = ({ closeModal }) => {
  const { openModal } = useModal()

  return (
    <>
      <ModalHeader>Stake Tokens</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Box borderRadius="md" bg="gray.50" p={6} mb={8}>
          <H5 mb={4} color="gray.800">
            Before you continue
          </H5>
          <Body1 color="gray.700">
            Make sure you have the following items in check
          </Body1>
        </Box>
        <StakingChecklist />
        <Body3 align="center" color="gray.500" mt={12} mb={6}>
          Read more about the{" "}
          <Link
            href={"SOME_LINK"}
            target="_blank"
            color="brand.500"
            textDecoration="underline"
          >
            staking contract
          </Link>
        </Body3>
        <Divider />
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
