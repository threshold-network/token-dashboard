import { FC, useState } from "react"
import { useWeb3React } from "@web3-react/core"
import { LEDGER_DERIVATION_PATHS } from "../../../../web3/connectors/ledger_subprovider"
import SelectDerivationPath from "./SelectDerivationPath"
import SelectAddress from "./SelectAddress"
import { LedgerConnectionStage } from "../../../../types/ledger"
import ConfirmConnected from "./ConfirmConnected"

const ConnectLedger: FC<{ goBack: () => void; closeModal: () => void }> = ({
  goBack,
  closeModal,
}) => {
  const { error, activate, active, account } = useWeb3React()
  const [derivationPath, setDerivationPath] = useState<string>(
    LEDGER_DERIVATION_PATHS.LEDGER_LIVE
  )
  const [connectionStage, setConnectionStage] = useState<LedgerConnectionStage>(
    LedgerConnectionStage.SELECT_DERIVATION
  )
  const [ledgerAddress, setLedgerAddress] = useState<string>("")
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
    return (
      <ConfirmConnected
        goBack={goBack}
        closeModal={closeModal}
        ledgerAddress={ledgerAddress}
      />
    )
  }

  return null
}

export default ConnectLedger
