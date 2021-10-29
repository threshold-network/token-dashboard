import { FC, useEffect, useState } from "react"
import { Icon, useColorModeValue } from "@chakra-ui/react"
import { LedgerWhite } from "../../../../../static/icons/LedgerWhite"
import { Ledger } from "../../../../../static/icons/Ledger"
import { WalletConnectionModalBase } from "../../components"
import { WalletConnectionModalProps } from "../../../../../types"
import WalletInitializeAlert from "../../components/WalletInitializeAlert"

const LEDGER_LOADING_TIMEOUT_MS = 30000

const LoadingAddresses: FC<WalletConnectionModalProps> = ({
  goBack,
  closeModal,
}) => {
  const [loadingCountDown, setCounter] = useState(LEDGER_LOADING_TIMEOUT_MS)

  // counter that resets the modal to wallet selection screen if there is an issue loading the user's addresses
  // most common issue would be if the user attempts to connect & reconnect quickly:
  // https://discord.com/channels/893441201628405760/903671985916223499/903741891118514207

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loadingCountDown > 0) {
        setCounter(loadingCountDown - 1000)
      } else {
        goBack()
      }
    }, 1000)

    return () => {
      clearTimeout(timeout)
    }
  }, [loadingCountDown])

  return (
    <WalletConnectionModalBase
      goBack={goBack}
      closeModal={closeModal}
      WalletIcon={
        <Icon
          as={useColorModeValue(Ledger, LedgerWhite)}
          h="40px"
          w="40px"
          mr={4}
        />
      }
      title="Ledger"
    >
      <WalletInitializeAlert />
    </WalletConnectionModalBase>
  )
}

export default LoadingAddresses
