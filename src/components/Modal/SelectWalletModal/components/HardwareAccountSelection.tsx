import { FC, useEffect, useState } from "react"
import {
  HStack,
  IconButton,
  Link,
  Radio,
  RadioGroup,
  Skeleton,
  Table,
  Tbody,
  Td,
  Tr,
} from "@chakra-ui/react"
import shortenAddress from "../../../../utils/shortenAddress"
import { WalletConnectionModalProps } from "../../../../types"
import { WalletConnectionModalBase } from "../components"
import { HiChevronLeft, HiChevronRight } from "react-icons/all"
import createEtherscanLink, {
  ExplorerDataType,
} from "../../../../utils/createEtherscanLink"

interface HardwareAccountSelectionProps extends WalletConnectionModalProps {
  selectedAddress: string
  setSelectedAddress: (address: string) => void
  onContinue: () => void
  addressOptions: string[]
  fetchAddresses: (count: number, offset: number) => void
  icon: any
  title: string
}

const HARDWARE_LOADING_TIMEOUT_MS = 60000

const HardwareAccountSelection: FC<HardwareAccountSelectionProps> = ({
  goBack,
  closeModal,
  selectedAddress,
  setSelectedAddress,
  onContinue,
  addressOptions,
  fetchAddresses,
  icon: WalletIcon,
  title,
}) => {
  const [loadingCountDown, setCounter] = useState(HARDWARE_LOADING_TIMEOUT_MS)

  // counter that resets the modal to wallet selection screen if there is an issue loading the user's addresses
  // most common issue would be if the user attempts to connect & reconnect quickly:
  // https://discord.com/channels/893441201628405760/903671985916223499/903741891118514207

  useEffect(() => {
    const timeout: ReturnType<typeof setTimeout> = setTimeout(() => {
      if (addressOptions.length > 0) {
        // cancel the timeout if addresses have been loaded
        return clearTimeout(timeout)
      } else if (loadingCountDown > 0) {
        setCounter(loadingCountDown - 1000)
      } else {
        goBack()
      }
    }, 1000)

    return () => {
      clearTimeout(timeout)
    }
  }, [loadingCountDown, addressOptions])

  const ROWS_PER_PAGE = 10
  const [loading, setLoading] = useState(false)
  const [offsetIdx, setOffsetIdx] = useState(0)

  const _fetchAddresses = async (count: number, offset: number) => {
    setLoading(true)
    await fetchAddresses(count, offset)
    setLoading(false)
  }

  const paginateForward = () => {
    const updatedOffset = offsetIdx + ROWS_PER_PAGE
    setOffsetIdx(updatedOffset)
    _fetchAddresses(ROWS_PER_PAGE, updatedOffset)
  }

  const paginateBack = () => {
    const updatedOffset = offsetIdx - ROWS_PER_PAGE
    setOffsetIdx(updatedOffset)
    _fetchAddresses(ROWS_PER_PAGE, updatedOffset)
  }

  const confirmAddress = loading || !selectedAddress ? () => {} : onContinue

  useEffect(() => {
    _fetchAddresses(ROWS_PER_PAGE, offsetIdx)
  }, [])

  return (
    <WalletConnectionModalBase
      goBack={goBack}
      closeModal={closeModal}
      WalletIcon={<WalletIcon />}
      title={title}
      subTitle="Choose an address below."
      onContinue={confirmAddress}
    >
      {loading ? (
        Array.from(Array(ROWS_PER_PAGE).keys()).map((address) => (
          <Skeleton h="12px" key={address} mb={4} />
        ))
      ) : (
        <RadioGroup
          onChange={setSelectedAddress}
          value={selectedAddress}
          my={6}
        >
          <Table variant="striped" w="100%" size="sm">
            <Tbody>
              {addressOptions.map((address) => (
                <Tr key={address}>
                  <Td textAlign="center">
                    <Radio key={address} value={address} />
                  </Td>
                  <Td textAlign="center">{shortenAddress(address)}</Td>
                  <Td textAlign="center">
                    <Link
                      _hover={{ color: "brand.500" }}
                      href={createEtherscanLink(
                        1,
                        address,
                        ExplorerDataType.ADDRESS
                      )}
                      target="_blank"
                    >
                      View on Etherscan
                    </Link>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </RadioGroup>
      )}

      <HStack justify="space-between">
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
    </WalletConnectionModalBase>
  )
}

export default HardwareAccountSelection
