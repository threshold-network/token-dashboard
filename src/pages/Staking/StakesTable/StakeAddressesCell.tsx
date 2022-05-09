import { FC } from "react"
import { Badge, HStack, Td, VStack } from "@chakra-ui/react"
import { StakeCellProps } from "../../../types/staking"
import { BodySm, BoxLabel } from "@threshold-network/components"
import shortenAddress from "../../../utils/shortenAddress"

const StakingAddressRow: FC<{
  address: string
  text: string
}> = ({ address, text }) => {
  return (
    <HStack justify="space-between" w="100%">
      <BoxLabel>{text}</BoxLabel>
      <BodySm>{shortenAddress(address)}</BodySm>
    </HStack>
  )
}

const PreAddress: FC<{ address?: string }> = ({ address }) => {
  return (
    <HStack justify="space-between" w="100%">
      <BoxLabel>PRE</BoxLabel>
      {address ? (
        <BodySm>{shortenAddress(address)}</BodySm>
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
        <StakingAddressRow
          text="Staking Provider"
          address={stake.stakingProvider}
        />
        <StakingAddressRow text="Beneficiary" address={stake.beneficiary} />
        <StakingAddressRow text="Authorizer" address={stake.authorizer} />
        {/* <PreAddress address={undefined} /> */}
      </VStack>
    </Td>
  )
}

export default StakeAddressesCell
