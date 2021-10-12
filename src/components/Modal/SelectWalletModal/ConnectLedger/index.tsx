import { FC, useState } from "react"
import { LEDGER_DERIVATION_PATHS } from "../../../../web3/connectors/ledger_subprovider"
import SelectDerivationPath from "./SelectDerivationPath"
import SelectAddress from "./SelectAddress"
import {
  LedgerConnectionStage,
  WalletConnectionModalProps,
} from "../../../../types"
import ConfirmConnected from "./ConfirmConnected"

const ConnectLedger: FC<WalletConnectionModalProps> = ({
  goBack,
  closeModal,
}) => {
  const [derivationPath, setDerivationPath] = useState<string>(
    LEDGER_DERIVATION_PATHS.LEDGER_LIVE
  )
  const [connectionStage, setConnectionStage] = useState<LedgerConnectionStage>(
    LedgerConnectionStage.SELECT_DERIVATION
  )
  const [ledgerAddress, setLedgerAddress] = useState<string>("")

  // TODO: pull these from user device
  const ledgerAddresses = [
    "0x123456789",
    "0xabcdefg",
    "0x1a2b3c4d5e",
    "0xkj23h4kjqwefq987er",
  ]

  if (connectionStage === LedgerConnectionStage.SELECT_DERIVATION) {
    return (
      <SelectDerivationPath
        closeModal={closeModal}
        goBack={goBack}
        setConnectionStage={setConnectionStage}
        derivationPath={derivationPath}
        setDerivationPath={setDerivationPath}
      />
    )
  }

  if (connectionStage === LedgerConnectionStage.SELECT_ADDRESS) {
    return (
      <SelectAddress
        closeModal={closeModal}
        goBack={goBack}
        setConnectionStage={setConnectionStage}
        ledgerAddress={ledgerAddress}
        setLedgerAddress={setLedgerAddress}
        ledgerAddresses={ledgerAddresses}
      />
    )
  }

  if (connectionStage === LedgerConnectionStage.CONFIRM_CONNECTED) {
    return <ConfirmConnected goBack={goBack} closeModal={closeModal} />
  }

  return null
}

export default ConnectLedger
