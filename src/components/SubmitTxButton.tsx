import React, { FC } from "react"
import { Button } from "@chakra-ui/react"
import { ModalType } from "../enums"
import { useWeb3React } from "@web3-react/core"
import { useModal } from "../hooks/useModal"

const SubmitTxButton: FC<{ onSubmit: () => void }> = ({ onSubmit }) => {
  const { active } = useWeb3React()
  const { openModal } = useModal()

  if (active) {
    return (
      <Button mt={6} isFullWidth onClick={onSubmit}>
        Upgrade
      </Button>
    )
  }

  return (
    <Button
      mt={6}
      isFullWidth
      onClick={() => openModal(ModalType.SelectWallet)}
    >
      Connect Wallet
    </Button>
  )
}

export default SubmitTxButton
