import { FC, useMemo, useState } from "react"
import { LEDGER_DERIVATION_PATHS } from "../../../../web3/connectors/ledger_subprovider"
import SelectDerivationPath from "./SelectDerivationPath"
import SelectAddress from "./SelectAddress"
import { WalletConnectionModalProps } from "../../../../types"
import ConfirmConnected from "./ConfirmConnected"
import { LedgerConnectionStage } from "../../../../enums"
import {
  ledgerLegacyConnectorFactory,
  ledgerLiveConnectorFactory,
} from "../../../../web3/connectors/ledger"
import LoadingAddresses from "./LoadingAddresses"

const ConnectLedger: FC<WalletConnectionModalProps> = ({
  goBack,
  closeModal,
}) => {
  const [derivationPath, setDerivationPath] = useState<string>(
    LEDGER_DERIVATION_PATHS.LEDGER_LIVE
  )
  const [connectionError, setConnectionError] = useState("")

  const connectorFactory = useMemo(() => {
    if (derivationPath === LEDGER_DERIVATION_PATHS.LEDGER_LIVE) {
      return ledgerLiveConnectorFactory
    }

    if (derivationPath === LEDGER_DERIVATION_PATHS.LEDGER_LEGACY) {
      return ledgerLegacyConnectorFactory
    }

    return null
  }, [derivationPath])

  const [connectionStage, setConnectionStage] = useState<LedgerConnectionStage>(
    LedgerConnectionStage.SelectDerivation
  )

  const [ledgerAddresses, setLedgerAddresses] = useState([])
  const [ledgerAddress, setLedgerAddress] = useState<string>("")

  const loadAddresses = async () => {
    if (connectorFactory) {
      const connector = connectorFactory()
      try {
        await connector.activate()
      } catch (error) {
        console.log("e1", error)
      }
      setConnectionStage(LedgerConnectionStage.LoadAddresses)

      try {
        const accounts = await connector.getAccounts()
        setLedgerAddresses(accounts)
        setConnectionStage(LedgerConnectionStage.SelectAddress)
      } catch (error: any) {
        setConnectionStage(LedgerConnectionStage.SelectDerivation)
        setConnectionError(error?.message)
        console.log("e2", error)
      }
    }
  }

  if (connectionStage === LedgerConnectionStage.SelectDerivation) {
    return (
      <SelectDerivationPath
        closeModal={closeModal}
        goBack={goBack}
        loadAddresses={loadAddresses}
        derivationPath={derivationPath}
        setDerivationPath={setDerivationPath}
        connectionError={connectionError}
      />
    )
  }

  if (connectionStage === LedgerConnectionStage.LoadAddresses) {
    return <LoadingAddresses closeModal={closeModal} goBack={goBack} />
  }

  if (connectionStage === LedgerConnectionStage.SelectAddress) {
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

  if (connectionStage === LedgerConnectionStage.ConfirmSelected) {
    return <ConfirmConnected goBack={goBack} closeModal={closeModal} />
  }

  return null
}

export default ConnectLedger
