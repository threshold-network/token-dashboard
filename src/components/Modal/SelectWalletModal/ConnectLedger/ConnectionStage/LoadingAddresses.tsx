import { FC } from "react"
import { Icon, useColorModeValue } from "@chakra-ui/react"
import { LedgerWhite } from "../../../../../static/icons/LedgerWhite"
import { Ledger } from "../../../../../static/icons/Ledger"
import { WalletConnectionModalBase } from "../../components"
import { WalletConnectionModalProps } from "../../../../../types"
import WalletInitializeAlert from "../../components/WalletInitializeAlert"

const LoadingAddresses: FC<WalletConnectionModalProps> = ({
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
      <WalletInitializeAlert />
    </WalletConnectionModalBase>
  )
}

export default LoadingAddresses
