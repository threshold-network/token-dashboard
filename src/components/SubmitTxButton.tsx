import { FC } from "react"
import { Button, ButtonProps } from "@chakra-ui/react"
import { useIsActive } from "../hooks/useIsActive"
import { useIsTbtcSdkInitializing } from "../contexts/ThresholdContext"
import { useConnectWallet } from "../hooks/useConnectWallet"

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
  const { isSdkInitializedWithSigner } = useIsTbtcSdkInitializing()
  const connectWallet = useConnectWallet()

  const onConnectWalletClick = () => {
    connectWallet()
  }

  if (isActive && isSdkInitializedWithSigner) {
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
      onClick={onConnectWalletClick}
      {...buttonProps}
      type="button"
      isDisabled={false}
    >
      Connect Wallet
    </Button>
  )
}

export default SubmitTxButton
