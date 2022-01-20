import { FC } from "react"
import { Button, HStack, Td } from "@chakra-ui/react"
import { StakeCellProps } from "../../../types/staking"
import { useModal } from "../../../hooks/useModal"
import { ModalType } from "../../../enums"

const StakeActionsCell: FC<StakeCellProps> = ({ stake }) => {
  const pre = undefined
  const { openModal } = useModal()

  return (
    <Td>
      <HStack justify="end">
        {!pre && <Button size="sm">Set PRE</Button>}
        {stake.tStake != "0" && (
          <Button
            size="sm"
            onClick={() => openModal(ModalType.UnstakeT, { stake })}
          >
            Unstake
          </Button>
        )}
        <Button
          size="sm"
          onClick={() => openModal(ModalType.TopupT, { stake })}
        >
          Top up
        </Button>
      </HStack>
    </Td>
  )
}

export default StakeActionsCell
