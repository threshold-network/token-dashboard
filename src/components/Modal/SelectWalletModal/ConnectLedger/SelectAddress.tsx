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
import shortenAddress from "../../../../utils/shortenAddress"
import { LedgerConnectionStage } from "../../../../types/ledger"

interface SelectAddressProps {
  goBack: () => void
  closeModal: () => void
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
            Choose an address below.
          </Text>
        </Stack>
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
          disabled={ledgerAddress === ""}
          ml={4}
          onClick={() => {
            setConnectionStage(LedgerConnectionStage.CONFIRM_CONNECTED)
          }}
        >
          Continue
        </Button>
      </ModalFooter>
    </>
  )
}

export default SelectAddress
