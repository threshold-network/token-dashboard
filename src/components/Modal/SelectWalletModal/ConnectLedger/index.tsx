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
import SelectDerivationPath from "./SelectDerivationPath"
import HardwareAccountSelection from "../components/HardwareAccountSelection"
import { Icon, useColorModeValue } from "@chakra-ui/react"
import { Ledger } from "../../../../static/icons/Ledger"
import { LedgerWhite } from "../../../../static/icons/LedgerWhite"
import ConfirmConnectedAddress from "../components/ConfirmConnectedAddress"

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
  const [ledgerAddressOptions, setLedgerAddressOptions] = useState<string[]>([])
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

  const fetchAddresses = async (count: number, offset: number) => {
    if (connectorFactory) {
      const connectorInstance = connectorFactory()
      connectorInstance?.activate()
      try {
        const accounts = await connectorInstance.getAccounts(count, offset)
        setLedgerAddressOptions(accounts)
        setConnector(connectorInstance)
      } catch (error: any) {
        setConnectionStage(LedgerConnectionStage.SelectDerivation)
        setConnectionError(error?.message)
      }
    }
  }

  const confirmDerivationPath = () => {
    setConnectionStage(LedgerConnectionStage.SelectAddress)
  }

  const confirmAddress = async () => {
    connector?.setDefaultAccount(ledgerAddress)
    await activate(connector as LedgerConnector, undefined, true)
    setConnectionStage(LedgerConnectionStage.ConfirmSuccess)
  }

  const modalControls: WalletConnectionModalProps = { goBack, closeModal }

  switch (connectionStage) {
    case LedgerConnectionStage.SelectDerivation:
      return (
        <SelectDerivationPath
          {...modalControls}
          onContinue={confirmDerivationPath}
          derivationPath={derivationPath}
          setDerivationPath={setDerivationPath}
          connectionError={connectionError}
        />
      )

    case LedgerConnectionStage.SelectAddress:
      return (
        <HardwareAccountSelection
          {...modalControls}
          selectedAddress={ledgerAddress}
          setSelectedAddress={setLedgerAddress}
          onContinue={confirmAddress}
          addressOptions={ledgerAddressOptions}
          fetchAddresses={fetchAddresses}
          icon={() => (
            <Icon
              as={useColorModeValue(Ledger, LedgerWhite)}
              h="40px"
              w="40px"
              mr={4}
            />
          )}
          title="Ledger"
        />
      )

    case LedgerConnectionStage.ConfirmSuccess:
      return (
        <ConfirmConnectedAddress
          {...modalControls}
          icon={() => (
            <Icon
              as={useColorModeValue(Ledger, LedgerWhite)}
              h="40px"
              w="40px"
              mr={4}
            />
          )}
          title="Ledger"
          message="Your Ledger wallet is connected"
        />
      )

    default:
      return null
  }
}

export default ConnectLedger
