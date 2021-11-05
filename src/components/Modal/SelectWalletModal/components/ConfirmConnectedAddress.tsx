import { FC } from "react"
import { AccountSuccessAlert, WalletConnectionModalBase } from "./index"
import { WalletConnectionModalProps } from "../../../../types"

interface Props {
  icon: any
  title: string
  message: string
}

const ConfirmConnectedAddress: FC<Props & WalletConnectionModalProps> = ({
  goBack,
  closeModal,
  icon: WalletIcon,
  title,
  message,
}) => {
  return (
    <WalletConnectionModalBase
      goBack={goBack}
      closeModal={closeModal}
      WalletIcon={<WalletIcon />}
      title={title}
    >
      <AccountSuccessAlert message={message} />
    </WalletConnectionModalBase>
  )
}

export default ConfirmConnectedAddress
