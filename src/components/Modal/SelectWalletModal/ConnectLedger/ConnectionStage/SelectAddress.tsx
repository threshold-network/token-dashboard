import { FC, useState } from "react"
import {
  Button,
  Icon,
  Radio,
  RadioGroup,
  Spinner,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react"
import { LedgerWhite } from "../../../../../static/icons/LedgerWhite"
import { Ledger } from "../../../../../static/icons/Ledger"
import shortenAddress from "../../../../../utils/shortenAddress"
import { WalletConnectionModalProps } from "../../../../../types"
import { WalletConnectionModalBase } from "../../components"
import { AiOutlinePlus } from "react-icons/ai"

interface SelectAddressProps extends WalletConnectionModalProps {
  ledgerAddress: string
  setLedgerAddress: (address: string) => void
  onContinue: () => void
  ledgerAddresses: string[]
  loadAdditionalAddresses: () => void
}

const SelectAddress: FC<SelectAddressProps> = ({
  goBack,
  closeModal,
  ledgerAddress,
  setLedgerAddress,
  onContinue,
  ledgerAddresses,
  loadAdditionalAddresses,
}) => {
  const [loading, setLoading] = useState(false)
  const [loadedExtra, setLoadedExtra] = useState(false)

  const loadMore = async () => {
    setLoading(true)
    await loadAdditionalAddresses()
    setLoading(false)
    setLoadedExtra(true)
  }

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
      onContinue={onContinue}
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
        {!loadedExtra && (
          <Button
            variant="link"
            mt={8}
            ml="5px"
            leftIcon={loading ? <Spinner /> : <AiOutlinePlus />}
            onClick={loadMore}
            isDisabled={loading}
            _disabled={{
              backgroundColor: "none",
            }}
          >
            {loading ? "Loading..." : "See More"}
          </Button>
        )}
      </RadioGroup>
    </WalletConnectionModalBase>
  )
}

export default SelectAddress
