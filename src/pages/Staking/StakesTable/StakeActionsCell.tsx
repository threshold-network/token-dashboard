import { FC } from "react"
import { Button, HStack, Td } from "@chakra-ui/react"
import { StakeCellProps } from "../../../types/staking"
import { useModal } from "../../../hooks/useModal"
import { ModalType } from "../../../enums"

const StakeActionsCell: FC<StakeCellProps> = ({ stake }) => {
  const pre = "yo yo"
  const { openModal } = useModal()

  const highlightPreCTA = !pre
  const highlightUnstakeCTA = !highlightPreCTA && stake.tStake != "0"
  const highlightTopUpCTA = !highlightPreCTA && !highlightUnstakeCTA

  return (
    <Td>
      <HStack justify="end">
        {!pre && (
          <Button size="sm" variant={highlightPreCTA ? "solid" : "outline"}>
            Set PRE
          </Button>
        )}
        <Button
          variant={highlightTopUpCTA ? "solid" : "outline"}
          size="sm"
          onClick={() => openModal(ModalType.TopupT, { stake })}
        >
          Top up
        </Button>
        {stake.tStake != "0" && (
          <Button
            variant={highlightUnstakeCTA ? "solid" : "outline"}
            size="sm"
            onClick={() => openModal(ModalType.UnstakeT, { stake })}
          >
            Unstake
          </Button>
        )}
      </HStack>
    </Td>
  )
}

export default StakeActionsCell
