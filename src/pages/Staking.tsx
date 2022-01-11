import { FC } from "react"
import { Button, HStack, Stack } from "@chakra-ui/react"
import { useModal } from "../hooks/useModal"
import { ModalType } from "../enums"
import { useWeb3React } from "@web3-react/core"

const StakingPage: FC = () => {
  const { openModal } = useModal()
  const { active, account } = useWeb3React()

  const openStakingModal = async () => {
    openModal(ModalType.ConfirmStakingParams)
  }

  return (
    <HStack w="100%" align="flex-start" spacing="1rem">
      <Stack w="50%" spacing="1rem">
        <Button disabled={!active || !account} onClick={openStakingModal}>
          STAKE
        </Button>
      </Stack>
    </HStack>
  )
}

export default StakingPage
