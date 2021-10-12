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
import { LEDGER_DERIVATION_PATHS } from "../../../../web3/connectors/ledger_subprovider"
import { WalletConnectionModalBase } from "../components"
import {
  LedgerConnectionStage,
  WalletConnectionModalProps,
} from "../../../../types"

interface SelectDerivationPathProps extends WalletConnectionModalProps {
  derivationPath: string
  setDerivationPath: (path: string) => void
  setConnectionStage: (stage: LedgerConnectionStage) => void
}

const SelectDerivationPath: FC<SelectDerivationPathProps> = ({
  goBack,
  closeModal,
  derivationPath,
  setDerivationPath,
  setConnectionStage,
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
      subTitle="Plug in Ledger device and unlock. Choose one of the following:"
      onContinue={() => {
        setConnectionStage(LedgerConnectionStage.SELECT_ADDRESS)
      }}
    >
      <RadioGroup
        onChange={setDerivationPath}
        value={derivationPath}
        w="135px"
        mx="auto"
        my={6}
      >
        <Stack>
          <Radio value={LEDGER_DERIVATION_PATHS.LEDGER_LEGACY}>
            Ledger Legacy
          </Radio>
          <Radio value={LEDGER_DERIVATION_PATHS.LEDGER_LIVE}>Ledger Live</Radio>
        </Stack>
      </RadioGroup>
    </WalletConnectionModalBase>
  )
}

export default SelectDerivationPath
