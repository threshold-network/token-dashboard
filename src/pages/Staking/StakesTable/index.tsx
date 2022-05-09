import { FC } from "react"
import { Table, Tbody, Th, Thead, Tr } from "@chakra-ui/react"
import StakeAddressesCell from "./StakeAddressesCell"
import { StakeData } from "../../../types/staking"
import StakeBalanceCell from "./StakeAmountCell"
import StakeNameCell from "./StakeNameCell"
import StakeActionsCell from "./StakeActionsCell"
import { LabelSm, Card } from "@threshold-network/components"

interface StakingTableProps {
  stakes: StakeData[]
}

const StakesTable: FC<StakingTableProps> = ({ stakes }) => {
  return (
    <Card>
      <LabelSm mb={6}>Stakes</LabelSm>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th color="gray.500">Name</Th>
            <Th color="gray.500">Addresses</Th>
            <Th color="gray.500">Balance</Th>
            <Th color="gray.500" isNumeric>
              Action
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {stakes.map((stake, i) => {
            return (
              <Tr key={stake.stakingProvider}>
                <StakeNameCell stake={stake} index={i} />
                <StakeAddressesCell stake={stake} />
                <StakeBalanceCell stake={stake} />
                <StakeActionsCell stake={stake} />
              </Tr>
            )
          })}
        </Tbody>
      </Table>
    </Card>
  )
}

export default StakesTable
