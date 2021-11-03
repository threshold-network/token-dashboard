import { ChangeEvent, FC, useState } from "react"
import {
  HStack,
  Icon,
  IconButton,
  Link,
  Radio,
  RadioGroup,
  Select,
  Skeleton,
  Table,
  Tbody,
  Td,
  Text,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react"
import { LedgerWhite } from "../../../../../static/icons/LedgerWhite"
import { Ledger } from "../../../../../static/icons/Ledger"
import shortenAddress from "../../../../../utils/shortenAddress"
import { WalletConnectionModalProps } from "../../../../../types"
import { WalletConnectionModalBase } from "../../components"
import { AiOutlineLink, HiChevronLeft, HiChevronRight } from "react-icons/all"
import createEtherscanLink, {
  ExplorerDataType,
} from "../../../../../utils/createEtherscanLink"

interface SelectAddressProps extends WalletConnectionModalProps {
  ledgerAddress: string
  setLedgerAddress: (address: string) => void
  onContinue: () => void
  ledgerAddresses: string[]
  loadAdditionalAddresses: (count: number, offset: number) => void
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
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [offsetIdx, setOffsetIdx] = useState(0)

  const loadMore = async (count: number, offset: number) => {
    setLoading(true)
    await loadAdditionalAddresses(count, offset)
    setLoading(false)
  }

  const handleRowPerPageChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(+e.target.value)
    loadMore(+e.target.value, offsetIdx)
  }

  const paginateForward = () => {
    const updatedOffset = offsetIdx + rowsPerPage
    setOffsetIdx(updatedOffset)
    loadMore(rowsPerPage, updatedOffset)
  }

  const paginateBack = () => {
    const updatedOffset = offsetIdx - rowsPerPage
    setOffsetIdx(updatedOffset)
    loadMore(rowsPerPage, updatedOffset)
  }

  const confirmAddress = loading || !ledgerAddress ? () => {} : onContinue

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
      onContinue={confirmAddress}
    >
      {loading ? (
        Array.from(Array(rowsPerPage).keys()).map((address) => (
          <Skeleton h="12px" key={address} mb={4} />
        ))
      ) : (
        <RadioGroup onChange={setLedgerAddress} value={ledgerAddress} my={6}>
          <Table variant="unstyled" w="100%" size="sm">
            <Tbody>
              {ledgerAddresses.map((address) => (
                <Tr key={address}>
                  <Td textAlign="center">
                    <Radio key={address} value={address} />
                  </Td>
                  <Td textAlign="center">{shortenAddress(address)}</Td>
                  <Td textAlign="center">
                    <Link
                      _hover={{ color: "blue.500" }}
                      href={createEtherscanLink(
                        1,
                        address,
                        ExplorerDataType.ADDRESS
                      )}
                      target="_blank"
                    >
                      <Icon as={AiOutlineLink} />
                    </Link>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </RadioGroup>
      )}

      <HStack justify="space-between">
        <HStack>
          <Text size="sm" color="gray.500" w="115px">
            Rows Per Page
          </Text>
          <Select
            onChange={handleRowPerPageChange}
            value={rowsPerPage}
            disabled={loading}
            maxW="70px"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
          </Select>
        </HStack>
        <HStack spacing={2}>
          <IconButton
            onClick={paginateBack}
            disabled={loading || offsetIdx === 0}
            aria-label={"paginate-back"}
            variant="outline"
            fontSize="20px"
            icon={<HiChevronLeft />}
          />
          <IconButton
            onClick={paginateForward}
            disabled={loading}
            aria-label={"paginate-fwd"}
            variant="outline"
            fontSize="20px"
            icon={<HiChevronRight />}
          />
        </HStack>
      </HStack>
    </WalletConnectionModalBase>
  )
}

export default SelectAddress
