import { FC } from "react"
import { Button, HStack, Td } from "@chakra-ui/react"
import { StakeCellProps } from "../../../types/staking"

const StakeActionsCell: FC<StakeCellProps> = ({ stake }) => {
  const pre = undefined

  return (
    <Td>
      <HStack justify="end">
        {!pre && <Button size="sm">Set PRE</Button>}
        <Button size="sm">Unstake</Button>
        <Button size="sm">Top up</Button>
      </HStack>
    </Td>
  )
}

export default StakeActionsCell
