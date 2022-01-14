import { FC } from "react"
import { Badge, HStack, Td, VStack } from "@chakra-ui/react"
import { StakeCellProps } from "../../../types/staking"
import { Body3 } from "../../../components/Typography"
import shortenAddress from "../../../utils/shortenAddress"

const StakingAddressRow: FC<{
  address: string
  text: string
}> = ({ address, text }) => {
  return (
    <HStack justify="space-between" w="100%">
      <Badge colorScheme="gray">{text}</Badge>
      <Body3 color="brand.500">{shortenAddress(address)}</Body3>
    </HStack>
  )
}

const PreAddress: FC<{ address?: string }> = ({ address }) => {
  return (
    <HStack justify="space-between" w="100%">
      <Badge colorScheme="gray">PRE</Badge>
      {address ? (
        <Body3 color="brand.500">{shortenAddress(address)}</Body3>
      ) : (
        <Badge size="sm" colorScheme="red">
          ADDRESS MISSING
        </Badge>
      )}
    </HStack>
  )
}

const StakeAddressesCell: FC<StakeCellProps> = ({ stake }) => {
  return (
    <Td minW="325px">
      <VStack spacing={2}>
        <StakingAddressRow text="Operator" address={stake.operator} />
        <StakingAddressRow text="Beneficiary" address={stake.beneficiary} />
        <StakingAddressRow text="Authorizer" address={stake.authorizer} />
        <PreAddress address={undefined} />
      </VStack>
    </Td>
  )
}

export default StakeAddressesCell
