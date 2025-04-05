import { FC } from "react"
import { Button, ButtonProps } from "@chakra-ui/react"
import { useIsActive } from "../hooks/useIsActive"
import { useConnectWallet } from "../hooks/useConnectWallet"
import { RootState } from "../store"
import { useSelector } from "react-redux"
import { useNonEVMConnection } from "../hooks/useNonEVMConnection"

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
  const { disconnectNonEVM } = useNonEVMConnection()
  const { isActive } = useIsActive()
  const { isNonEVMActive } = useNonEVMConnection()
  const connectWallet = useConnectWallet()
  const isButtonDisabled = isBlocked || isDisabled
  const pathnameUrl = window.location.pathname
  const isMint = pathnameUrl.includes("tBTC/mint")

  const onConnectWalletClick = () => {
    disconnectNonEVM()
    connectWallet()
  }

  if (isActive || (isNonEVMActive && isMint)) {
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
      Connect Ethereum Wallet
    </Button>
  )
}

export default SubmitTxButton
