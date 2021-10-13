import { FC } from "react"
import {
  Icon,
  Radio,
  RadioGroup,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react"
import { LedgerWhite } from "../../../../static/icons/LedgerWhite"
import { Ledger } from "../../../../static/icons/Ledger"
import shortenAddress from "../../../../utils/shortenAddress"
import { WalletConnectionModalProps } from "../../../../types"
import { WalletConnectionModalBase } from "../components"
import { LedgerConnectionStage } from "../../../../enums"

interface SelectAddressProps extends WalletConnectionModalProps {
  ledgerAddress: string
  setLedgerAddress: (address: string) => void
  setConnectionStage: (stage: LedgerConnectionStage) => void
  ledgerAddresses: string[]
}

const SelectAddress: FC<SelectAddressProps> = ({
  goBack,
  closeModal,
  ledgerAddress,
  setLedgerAddress,
  setConnectionStage,
  ledgerAddresses,
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
      subTitle="Choose an address below."
      onContinue={() => {
        setConnectionStage(LedgerConnectionStage.ConfirmSelected)
      }}
    >
      <RadioGroup
        onChange={setLedgerAddress}
        value={ledgerAddress}
        maxW="130px"
        mx="auto"
        my={6}
      >
        <Stack>
          {ledgerAddresses.map((address) => (
            <Radio key={address} value={address}>
              {shortenAddress(address)}
            </Radio>
          ))}
        </Stack>
      </RadioGroup>
    </WalletConnectionModalBase>
  )
}

export default SelectAddress
