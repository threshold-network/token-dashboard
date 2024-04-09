import { FC } from "react"
import { Button, ButtonProps } from "@chakra-ui/react"
import { useIsActive } from "../hooks/useIsActive"
import { useConnectWallet } from "../hooks/useConnectWallet"
import { RootState } from "../store"
import { useSelector } from "react-redux"
import { useIsTbtcSdkInitializing } from "../contexts/ThresholdContext"

interface SubmitTxButtonProps extends ButtonProps {
  onSubmit?: () => void
}

const SubmitTxButton: FC<SubmitTxButtonProps> = ({
  onSubmit,
  children,
  ...buttonProps
}) => {
  const { isBlocked, isFetching } = useSelector(
    (state: RootState) => state.account.trm
  )
  const { isLoading, isDisabled } = buttonProps
  const { account } = useIsActive()
  const connectWallet = useConnectWallet()

  const onConnectWalletClick = () => {
    connectWallet()
  }

  if (account) {
    return (
      <Button
        isLoading={isFetching || isLoading}
        isDisabled={isBlocked || isDisabled}
        onClick={onSubmit}
        {...buttonProps}
      >
        {children}
      </Button>
    )
  }

  return (
    <Button
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
