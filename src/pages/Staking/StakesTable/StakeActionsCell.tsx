import { FC } from "react"
import { Button, HStack, Td } from "@chakra-ui/react"
import { StakeCellProps } from "../../../types/staking"
import useUnstakeTransaction from "../../../web3/hooks/useUnstakeTransaction"
import { useModal } from "../../../hooks/useModal"
import { ModalType } from "../../../enums"

const StakeActionsCell: FC<StakeCellProps> = ({ stake }) => {
  const pre = undefined

  const { openModal } = useModal()

  const { unstake } = useUnstakeTransaction((tx) =>
    openModal(ModalType.UnstakeSuccess, { transactionHash: tx.hash })
  )

  return (
    <Td>
      <HStack justify="end">
        {!pre && <Button size="sm">Set PRE</Button>}
        {stake.tStake != "0" && (
          <Button
            size="sm"
            onClick={() => {
              console.log("unstake action")
              unstake({ operator: stake.operator, amount: stake.tStake })
            }}
          >
            Unstake
          </Button>
        )}
        <Button size="sm">Top up</Button>
      </HStack>
    </Td>
  )
}

export default StakeActionsCell
