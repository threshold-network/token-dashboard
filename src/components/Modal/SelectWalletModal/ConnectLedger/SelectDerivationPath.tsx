import { FC } from "react"
import {
  Button,
  HStack,
  Icon,
  ModalBody,
  ModalFooter,
  Radio,
  RadioGroup,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react"
import { BiLeftArrowAlt } from "react-icons/all"
import { LedgerWhite } from "../../../../static/icons/LedgerWhite"
import { Ledger } from "../../../../static/icons/Ledger"
import { LEDGER_DERIVATION_PATHS } from "../../../../web3/connectors/ledger_subprovider"

enum LedgerConnectionStage {
  SELECT_DERIVATION = "SELECT_DERIVATION",
  SELECT_ADDRESS = "SELECT_ADDRESS",
}

interface SelectDerivationPathProps {
  goBack: () => void
  closeModal: () => void
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
    <>
      <ModalBody>
        <Stack spacing={6}>
          <HStack justify="center">
            <Icon
              as={useColorModeValue(Ledger, LedgerWhite)}
              h="40px"
              w="40px"
              mr={4}
            />
            <Text fontSize="30px">Ledger</Text>
          </HStack>
          <Text align="center" color={useColorModeValue("gray.500", "white")}>
            Plug in Ledger device and unlock. Choose one of the following:
          </Text>
        </Stack>
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
            <Radio value={LEDGER_DERIVATION_PATHS.LEDGER_LIVE}>
              Ledger Live
            </Radio>
          </Stack>
        </RadioGroup>
      </ModalBody>
      <ModalFooter>
        <Button
          variant="outline"
          leftIcon={<BiLeftArrowAlt />}
          onClick={goBack}
        >
          Change Wallet
        </Button>
        <Button
          ml={4}
          onClick={() => {
            setConnectionStage(LedgerConnectionStage.SELECT_ADDRESS)
          }}
        >
          Continue
        </Button>
      </ModalFooter>
    </>
  )
}

export default SelectDerivationPath
