import { FC } from "react"
import { AccountSuccessAlert, WalletConnectionModalBase } from "./index"
import { WalletConnectionModalProps } from "../../../../types"
import { WalletType } from "../../../../enums"

interface Props {
  icon: any
  title: string
  message: string
  walletType: WalletType
}

const ConfirmConnectedAddress: FC<Props & WalletConnectionModalProps> = ({
  goBack,
  closeModal,
  icon: WalletIcon,
  title,
  message,
  walletType,
}) => {
  return (
    <WalletConnectionModalBase
      goBack={goBack}
      closeModal={closeModal}
      WalletIcon={<WalletIcon />}
      title={title}
      walletType={walletType}
    >
      <AccountSuccessAlert message={message} />
    </WalletConnectionModalBase>
  )
}

export default ConfirmConnectedAddress
