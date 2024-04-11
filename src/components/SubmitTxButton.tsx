import { FC } from "react"
import { Button, ButtonProps } from "@chakra-ui/react"
import { useIsActive } from "../hooks/useIsActive"
import { useConnectWallet } from "../hooks/useConnectWallet"
import { RootState } from "../store"
import { useSelector } from "react-redux"
import { useIsTbtcSdkInitializing } from "../contexts/ThresholdContext"

interface SubmitTxButtonProps extends ButtonProps {
  onSubmit?: () => void
  isTbtcTransaction?: boolean
}

const SubmitTxButton: FC<SubmitTxButtonProps> = ({
  onSubmit,
  isLoading,
  isDisabled,
  isTbtcTransaction = false,
  children,
  ...buttonProps
}) => {
  const { isBlocked, isFetching } = useSelector(
    (state: RootState) => state.account.trm
  )
  const { isSdkInitializedWithSigner } = useIsTbtcSdkInitializing()
  const { account } = useIsActive()
  const connectWallet = useConnectWallet()

  const onConnectWalletClick = () => {
    connectWallet()
  }

  // Check for tbtc transactions. This check ensures that the button is
  // enabled only if the sdk is initialized with a signer for tbtc related actions.
  if (account && (isTbtcTransaction ? isSdkInitializedWithSigner : true)) {
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
