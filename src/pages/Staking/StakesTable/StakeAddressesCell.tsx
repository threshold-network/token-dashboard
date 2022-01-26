import { FC } from "react"
import { Badge, HStack, Td, VStack } from "@chakra-ui/react"
import { StakeCellProps } from "../../../types/staking"
import { Body3 } from "../../../components/Typography"
import shortenAddress from "../../../utils/shortenAddress"
import BoxLabel from "../../../components/BoxLabel"

const StakingAddressRow: FC<{
  address: string
  text: string
}> = ({ address, text }) => {
  return (
    <HStack justify="space-between" w="100%">
      <BoxLabel>{text}</BoxLabel>
      <Body3>{shortenAddress(address)}</Body3>
    </HStack>
  )
}

const PreAddress: FC<{ address?: string }> = ({ address }) => {
  return (
    <HStack justify="space-between" w="100%">
      <BoxLabel>PRE</BoxLabel>
      {address ? (
        <Body3>{shortenAddress(address)}</Body3>
      ) : (
        <Badge variant="subtle" size="sm" colorScheme="red">
          MISSING
        </Badge>
      )}
    </HStack>
  )
}

const StakeAddressesCell: FC<StakeCellProps> = ({ stake }) => {
  return (
    <Td>
      <VStack spacing={2}>
        <StakingAddressRow text="Operator" address={stake.stakingProvider} />
        <StakingAddressRow text="Beneficiary" address={stake.beneficiary} />
        <StakingAddressRow text="Authorizer" address={stake.authorizer} />
        <PreAddress address={undefined} />
      </VStack>
    </Td>
  )
}

export default StakeAddressesCell
