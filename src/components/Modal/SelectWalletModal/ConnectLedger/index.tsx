import { FC, useMemo, useState } from "react"
import { LEDGER_DERIVATION_PATHS } from "../../../../web3/connectors/ledger_subprovider"
import SelectDerivationPath from "./SelectDerivationPath"
import SelectAddress from "./SelectAddress"
import { WalletConnectionModalProps } from "../../../../types"
import ConfirmConnected from "./ConfirmConnected"
import { LedgerConnectionStage } from "../../../../enums"
import {
  LedgerConnector,
  ledgerLegacyConnectorFactory,
  ledgerLiveConnectorFactory,
} from "../../../../web3/connectors/ledger"
import LoadingAddresses from "./LoadingAddresses"
import { useWeb3React } from "@web3-react/core"

const ConnectLedger: FC<WalletConnectionModalProps> = ({
  goBack,
  closeModal,
}) => {
  const { activate } = useWeb3React()
  const [derivationPath, setDerivationPath] = useState<string>(
    LEDGER_DERIVATION_PATHS.LEDGER_LIVE
  )
  const [connectionError, setConnectionError] = useState("")
  const [connectionStage, setConnectionStage] = useState<LedgerConnectionStage>(
    LedgerConnectionStage.SelectDerivation
  )
  const [ledgerAddresses, setLedgerAddresses] = useState([])
  const [ledgerAddress, setLedgerAddress] = useState<string>("")
  const [connector, setConnector] = useState<LedgerConnector | null>(null)

  const connectorFactory = useMemo(() => {
    if (derivationPath === LEDGER_DERIVATION_PATHS.LEDGER_LIVE) {
      return ledgerLiveConnectorFactory
    }

    if (derivationPath === LEDGER_DERIVATION_PATHS.LEDGER_LEGACY) {
      return ledgerLegacyConnectorFactory
    }

    return null
  }, [derivationPath])

  const loadAddresses = async () => {
    if (connectorFactory) {
      const connectorInstance = connectorFactory()
      connectorInstance?.activate()
      setConnectionStage(LedgerConnectionStage.LoadAddresses)
      try {
        const accounts = await connectorInstance.getAccounts()
        setLedgerAddresses(accounts)
        setConnectionStage(LedgerConnectionStage.SelectAddress)
        setConnector(connectorInstance)
      } catch (error: any) {
        setConnectionStage(LedgerConnectionStage.SelectDerivation)
        setConnectionError(error?.message)
      }
    }
  }

  const confirmAddress = async () => {
    connector?.setDefaultAccount(ledgerAddress)
    await activate(connector as LedgerConnector, undefined, true)
    setConnectionStage(LedgerConnectionStage.ConfirmSuccess)
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
        confirmAddress={confirmAddress}
        ledgerAddress={ledgerAddress}
        setLedgerAddress={setLedgerAddress}
        ledgerAddresses={ledgerAddresses}
      />
    )
  }

  if (connectionStage === LedgerConnectionStage.ConfirmSuccess) {
    return <ConfirmConnected goBack={goBack} closeModal={closeModal} />
  }

  return null
}

export default ConnectLedger
