import { FC } from "react"
import { Button, ButtonProps } from "@chakra-ui/react"
import { useIsActive } from "../hooks/useIsActive"
import { useConnectWallet } from "../hooks/useConnectWallet"
import { RootState } from "../store"
import { useSelector } from "react-redux"
import { isL2Network, isValidL2Transaction } from "../networks/utils/"
import { AllowedL2TransactionTypes } from "../networks/enums/networks"

interface SubmitTxButtonProps extends ButtonProps {
  l2TransactionType?: AllowedL2TransactionTypes
  onSubmit?: () => void
}

const SubmitTxButton: FC<SubmitTxButtonProps> = ({
  l2TransactionType,
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

  const { isActive, chainId } = useIsActive()
  const connectWallet = useConnectWallet()
  const isButtonDisabled =
    isBlocked ||
    isDisabled ||
    (isL2Network(chainId) && !isValidL2Transaction(l2TransactionType))

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
