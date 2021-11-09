import { FC, useEffect, useMemo, useState } from "react"
import { Icon, useColorModeValue } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import { WalletConnectionModalProps } from "../../../../types"
import { ConnectionError, TrezorConnectionStage } from "../../../../enums"
import HardwareAccountSelection from "../components/HardwareAccountSelection"
import ConfirmConnectedAddress from "../components/ConfirmConnectedAddress"
import trezorConnector from "../../../../web3/connectors/trezor"
import { WalletConnectionModalBase } from "../components"
import TrezorStatusAlert from "../components/TrezorStatusAlert"
import { Trezor } from "../../../../static/icons/Trezor"
import { TrezorLight } from "../../../../static/icons/TrezorLight"

const ConnectTrezor: FC<WalletConnectionModalProps> = ({
  goBack,
  closeModal,
}) => {
  const { activate } = useWeb3React()
  const [connectionError, setConnectionError] = useState("")
  const [connectionStage, setConnectionStage] = useState<TrezorConnectionStage>(
    TrezorConnectionStage.InitializeTrezorConnection
  )
  const [trezorAddressOptions, setTrezorAddressOptions] = useState<string[]>([])
  const [selectedTrezorAddress, setSlectedTrezorAddress] = useState<string>("")

  const connectionRejected = useMemo(() => {
    return (
      connectionError === ConnectionError.TrezorCancelled ||
      connectionError === ConnectionError.TrezorDenied
    )
  }, [connectionError])

  const connector = trezorConnector

  const fetchAddresses = async (count: number, offset: number) => {
    await connector?.activate()
    try {
      const accounts = await connector.getAccounts(count, offset)

      setTrezorAddressOptions(accounts)
      setConnectionStage(TrezorConnectionStage.SelectAddress)
    } catch (error: any) {
      setConnectionStage(TrezorConnectionStage.InitializeTrezorConnection)
      setConnectionError(error?.message)
    }
  }

  const confirmAddress = async () => {
    connector?.setDefaultAccount(selectedTrezorAddress)
    await activate(connector, undefined, true)
    setConnectionStage(TrezorConnectionStage.ConfirmSuccess)
  }

  const modalControls: WalletConnectionModalProps = { goBack, closeModal }

  useEffect(() => {
    fetchAddresses(10, 0)
  }, [])

  switch (connectionStage) {
    case TrezorConnectionStage.InitializeTrezorConnection:
      return (
        <WalletConnectionModalBase
          goBack={goBack}
          closeModal={closeModal}
          WalletIcon={useColorModeValue(Trezor, TrezorLight)}
          title="Trezor"
          subTitle="Plug in your Trezor device. If the setup screen doesn’t load right away, go to the Trezor setup"
          tryAgain={
            connectionRejected ? () => fetchAddresses(10, 0) : undefined
          }
        >
          <TrezorStatusAlert connectionRejected={connectionRejected} />
        </WalletConnectionModalBase>
      )
    case TrezorConnectionStage.SelectAddress:
      return (
        <HardwareAccountSelection
          {...modalControls}
          selectedAddress={selectedTrezorAddress}
          setSelectedAddress={setSlectedTrezorAddress}
          onContinue={confirmAddress}
          addressOptions={trezorAddressOptions}
          fetchAddresses={fetchAddresses}
          icon={() => (
            <Icon
              h="40px"
              w="40px"
              mr={4}
              as={useColorModeValue(Trezor, TrezorLight)}
            />
          )}
          title="Trezor"
          eagerFetch={false}
        />
      )

    case TrezorConnectionStage.ConfirmSuccess:
      return (
        <ConfirmConnectedAddress
          {...modalControls}
          icon={() => <Icon h="40px" w="40px" mr={4} />}
          title="Trezor"
          message="Your Trezor wallet is connected"
        />
      )

    default:
      return null
  }
}

export default ConnectTrezor
