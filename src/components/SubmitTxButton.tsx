import React, { FC } from "react"
import { Button, ButtonProps } from "@chakra-ui/react"
import { ModalType } from "../enums"
import { useWeb3React } from "@web3-react/core"
import { useModal } from "../hooks/useModal"
import { useThreshold } from "../contexts/ThresholdContext"

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
  const { sdkStatus } = useThreshold()

  if (active && sdkStatus.initializedWithSigner) {
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
    >
      Connect Wallet
    </Button>
  )
}

export default SubmitTxButton
