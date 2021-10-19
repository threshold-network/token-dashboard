import { FC, useMemo, useState } from "react"
import { LEDGER_DERIVATION_PATHS } from "../../../../web3/connectors/ledger_subprovider"
import { WalletConnectionModalProps } from "../../../../types"
import { LedgerConnectionStage } from "../../../../enums"
import {
  LedgerConnector,
  ledgerLegacyConnectorFactory,
  ledgerLiveConnectorFactory,
} from "../../../../web3/connectors/ledger"
import { useWeb3React } from "@web3-react/core"
import ConnectionStage from "./ConnectionStage"

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

  const loadAdditionalAddresses = async () => {
    const accounts = await connector?.getAccounts(10)
    setLedgerAddresses(accounts)
  }

  const confirmAddress = async () => {
    connector?.setDefaultAccount(ledgerAddress)
    await activate(connector as LedgerConnector, undefined, true)
    setConnectionStage(LedgerConnectionStage.ConfirmSuccess)
  }

  const modalControls: WalletConnectionModalProps = { goBack, closeModal }

  return (
    <ConnectionStage
      {...{
        connectionStage,
        modalControls,
        loadAddresses,
        loadAdditionalAddresses,
        derivationPath,
        setDerivationPath,
        connectionError,
        confirmAddress,
        ledgerAddress,
        setLedgerAddress,
        ledgerAddresses,
      }}
    />
  )
}

export default ConnectLedger
