import { FC } from "react"
import { useWeb3React } from "@web3-react/core"
import { ledgerLive } from "../../../web3/connectors"
import { WalletConnectionModalBase } from "./components"
import { ColorMode, ConnectionError, WalletType } from "../../../enums"
import doesErrorInclude from "../../../web3/utils/doesErrorInclude"
import { LedgerLight } from "../../../static/icons/LedgerLight"
import { LedgerDark } from "../../../static/icons/LedgerDark"
import { useColorMode } from "@chakra-ui/react"

const ConnectLedgerLive: FC<{ goBack: () => void; closeModal: () => void }> = ({
  goBack,
  closeModal,
}) => {
  const { activate, error } = useWeb3React()
  const { colorMode } = useColorMode()

  const connectionRejected = doesErrorInclude(
    error,
    ConnectionError.RejectedMetamaskConnection
  )

  const walletIcon = colorMode === ColorMode.DARK ? LedgerDark : LedgerLight

  return (
    <WalletConnectionModalBase
      connector={ledgerLive}
      goBack={goBack}
      closeModal={closeModal}
      WalletIcon={walletIcon}
      title="Ledger Live"
      subTitle={
        !error
          ? "The Ledger Live extension will open in an external window."
          : ""
      }
      tryAgain={connectionRejected ? () => activate(ledgerLive) : undefined}
      walletType={WalletType.LedgerLive}
    />
  )
}

export default ConnectLedgerLive
