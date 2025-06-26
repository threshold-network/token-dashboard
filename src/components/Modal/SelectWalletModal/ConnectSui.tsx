import { FC } from "react"
import { WalletConnectionModalBase } from "./components"
import SuiWalletList from "./SuiWalletList"
import { SuiIcon } from "../../../static/icons/Sui"

const ConnectSui: FC<{
  goBack: () => void
  closeModal: () => void
}> = ({ goBack, closeModal }) => (
  <WalletConnectionModalBase
    goBack={goBack}
    closeModal={closeModal}
    WalletIcon={SuiIcon}
    title="Sui"
    subTitle="Connect by choosing one of the available wallets."
  >
    <SuiWalletList closeModal={closeModal} />
  </WalletConnectionModalBase>
)

export default ConnectSui
