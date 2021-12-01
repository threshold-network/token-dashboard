import { Button, Stack } from "@chakra-ui/react"
import UpgradeCard from "./UpgradeCard"
import { ModalType, Token } from "../enums"
import { useModal } from "../hooks/useModal"

export const ScratchPad = ({}) => {
  const { openModal } = useModal()
  return (
    <Stack spacing={4} maxW="md" mt={8}>
      <Button onClick={() => openModal(ModalType.UpgradeTransaction)}>
        open modal
      </Button>
      <UpgradeCard token={Token.Keep} />
      <UpgradeCard token={Token.Nu} />
    </Stack>
  )
}
