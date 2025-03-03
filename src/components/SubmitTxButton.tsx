import { FC } from "react"
import { Button, ButtonProps } from "@chakra-ui/react"
import { useIsActive } from "../hooks/useIsActive"
import { useConnectWallet } from "../hooks/useConnectWallet"
import { RootState } from "../store"
import { useSelector } from "react-redux"

interface SubmitTxButtonProps extends ButtonProps {
  onSubmit?: () => void
}

const SubmitTxButton: FC<SubmitTxButtonProps> = ({
  onSubmit,
  isLoading,
  isDisabled,
  children,
  ...buttonProps
}) => {
  const {
    isBlocked,
    trm: { isFetching },
  } = useSelector((state: RootState) => state.account)

  const { isActive } = useIsActive()
  const connectWallet = useConnectWallet()
  const isButtonDisabled = isBlocked || isDisabled

  const onConnectWalletClick = () => {
    connectWallet()
  }

  if (isActive) {
    return (
      <Button
        isLoading={isFetching || isLoading}
        isDisabled={isButtonDisabled}
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
