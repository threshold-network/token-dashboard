import React, { FC } from "react"
import { Button, ButtonProps } from "@chakra-ui/react"
import { ModalType } from "../enums"
import { useModal } from "../hooks/useModal"
import { useIsActive } from "../hooks/useIsActive"
import { useEmbedFeatureFlag } from "../hooks/useEmbedFeatureFlag"
import { useRequestEthereumAccount } from "../hooks/ledger-live-app"

interface Props extends ButtonProps {
  onSubmit?: () => void
  submitText?: string
}

const SubmitTxButton: FC<Props> = ({
  onSubmit,
  submitText = "Upgrade",
  ...buttonProps
}) => {
  const { isActive } = useIsActive()
  const { isEmbed } = useEmbedFeatureFlag()
  const { requestAccount } = useRequestEthereumAccount()
  const { openModal } = useModal()

  const connectWallet = () => {
    if (isEmbed) {
      requestAccount()
    } else {
      openModal(ModalType.SelectWallet)
    }
  }

  if (isActive) {
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
      onClick={connectWallet}
      {...buttonProps}
      type="button"
    >
      Connect Wallet
    </Button>
  )
}

export default SubmitTxButton
