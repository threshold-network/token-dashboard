import { FC } from "react"
import { WalletConnectIcon } from "../../../static/icons/WalletConect"
import { WalletConnectionModalBase } from "./components"

const ConnectSolana: FC<{
  goBack: () => void
  closeModal: () => void
}> = ({ goBack, closeModal }) => (
  <WalletConnectionModalBase
    goBack={goBack}
    closeModal={closeModal}
    WalletIcon={WalletConnectIcon}
    title="Solana"
    subTitle="Connect Solana by choosing your wallet."
    shouldForceCloseModal
  />
)

export default ConnectSolana
