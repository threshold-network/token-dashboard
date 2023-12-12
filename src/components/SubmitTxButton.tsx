import React, { FC } from "react"
import { Button, ButtonProps } from "@chakra-ui/react"
import { ModalType } from "../enums"
import { useWeb3React } from "@web3-react/core"
import { useModal } from "../hooks/useModal"
import { useIsTbtcSdkInitializing } from "../contexts/ThresholdContext"

interface Props extends ButtonProps {
  onSubmit?: () => void
  submitText?: string
}

const SubmitTxButton: FC<Props> = ({
  onSubmit,
  submitText = "Upgrade",
  ...buttonProps
}) => {
  const { active } = useWeb3React()
  const { openModal } = useModal()
  const { isSdkInitializedWithSigner } = useIsTbtcSdkInitializing()

  if (active && isSdkInitializedWithSigner) {
    return (
      <Button mt={6} isFullWidth onClick={onSubmit} {...buttonProps}>
        {submitText}
      </Button>
    )
  }

  return (
    <Button
      mt={6}
      isFullWidth
      onClick={() => openModal(ModalType.SelectWallet)}
      {...buttonProps}
      type="button"
      isDisabled={false}
    >
      Connect Wallet
    </Button>
  )
}

export default SubmitTxButton
