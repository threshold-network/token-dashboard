import { FC } from "react"
import { Icon, useColorModeValue } from "@chakra-ui/react"
import { LedgerWhite } from "../../../../../static/icons/LedgerWhite"
import { Ledger } from "../../../../../static/icons/Ledger"
import {
  AccountSuccessAlert,
  WalletConnectionModalBase,
} from "../../components"
import { WalletConnectionModalProps } from "../../../../../types"

const ConfirmConnected: FC<WalletConnectionModalProps> = ({
  goBack,
  closeModal,
}) => {
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
      <AccountSuccessAlert message="Your Ledger wallet is connected" />
    </WalletConnectionModalBase>
  )
}

export default ConfirmConnected
