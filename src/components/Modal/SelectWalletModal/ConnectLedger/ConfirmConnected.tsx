import { FC } from "react"
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
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

interface ConfirmConnectedProps {
  goBack: () => void
  closeModal: () => void
  ledgerAddress: string
}

const ConfirmConnected: FC<ConfirmConnectedProps> = ({
  goBack,
  closeModal,
  ledgerAddress,
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
        </Stack>
        <Alert status="success" mt={6}>
          <AlertIcon />
          <Stack>
            <AlertTitle>Your Ledger wallet is connected</AlertTitle>
            <AlertDescription>
              Address: {shortenAddress(ledgerAddress)}
            </AlertDescription>
          </Stack>
        </Alert>
      </ModalBody>
      <ModalFooter>
        <Button
          variant="outline"
          leftIcon={<BiLeftArrowAlt />}
          onClick={goBack}
        >
          Change Wallet
        </Button>
        <Button ml={4} onClick={closeModal}>
          Close
        </Button>
      </ModalFooter>
    </>
  )
}

export default ConfirmConnected
