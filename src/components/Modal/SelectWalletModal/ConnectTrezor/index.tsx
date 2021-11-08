import { FC, useState } from "react"
import { Button, Icon } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import { WalletConnectionModalProps } from "../../../../types"
import { TrezorConnectionStage } from "../../../../enums"
import HardwareAccountSelection from "../components/HardwareAccountSelection"
import ConfirmConnectedAddress from "../components/ConfirmConnectedAddress"
import trezorConnector from "../../../../web3/connectors/trezor"

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
  const connector = trezorConnector

  const fetchAddresses = async (count: number, offset: number) => {
    connector?.activate()
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

  switch (connectionStage) {
    case TrezorConnectionStage.InitializeTrezorConnection:
      return (
        <div>
          connect trezor
          <Button onClick={() => fetchAddresses(10, 0)}>connect</Button>
        </div>
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
          icon={() => <Icon h="40px" w="40px" mr={4} />}
          title="Trezor"
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
