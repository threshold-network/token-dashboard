import { FC } from "react"
import { LedgerConnectionStage } from "../../../../../enums"
import SelectDerivationPath from "./SelectDerivationPath"
import LoadingAddresses from "./LoadingAddresses"
import SelectAddress from "./SelectAddress"
import ConfirmConnected from "./ConfirmConnected"
import { WalletConnectionModalProps } from "../../../../../types"

interface Props {
  connectionStage: LedgerConnectionStage
  modalControls: WalletConnectionModalProps
  loadAddresses: () => void
  derivationPath: string
  setDerivationPath: (path: string) => void
  connectionError: string
  confirmAddress: () => void
  ledgerAddress: string
  setLedgerAddress: (address: string) => void
  ledgerAddresses: string[]
}

const ConnectionState: FC<Props> = ({
  connectionStage,
  modalControls,
  loadAddresses,
  derivationPath,
  setDerivationPath,
  connectionError,
  confirmAddress,
  ledgerAddress,
  setLedgerAddress,
  ledgerAddresses,
}) => {
  switch (connectionStage) {
    case LedgerConnectionStage.SelectDerivation:
      return (
        <SelectDerivationPath
          {...modalControls}
          loadAddresses={loadAddresses}
          derivationPath={derivationPath}
          setDerivationPath={setDerivationPath}
          connectionError={connectionError}
        />
      )

    case LedgerConnectionStage.LoadAddresses:
      return <LoadingAddresses {...modalControls} />

    case LedgerConnectionStage.SelectAddress:
      return (
        <SelectAddress
          {...modalControls}
          {...{
            ledgerAddress,
            setLedgerAddress,
            ledgerAddresses,
          }}
          onContinue={confirmAddress}
        />
      )

    case LedgerConnectionStage.ConfirmSuccess:
      return <ConfirmConnected {...modalControls} />

    default:
      return null
  }
}

export default ConnectionState
