import { FC } from "react"
import { Button, HStack, Td, Link } from "@chakra-ui/react"
import { StakeCellProps } from "../../../types/staking"
import { useModal } from "../../../hooks/useModal"
import { ExternalHref, ModalType } from "../../../enums"

const StakeActionsCell: FC<StakeCellProps> = ({ stake }) => {
  const { openModal } = useModal()
  return (
    <Td>
      <HStack justify="end">
        <Link
          href={ExternalHref.preNodeSetup}
          target="_blank"
          rel="noopener noreferrer"
          _hover={{ textDecoration: "none" }}
        >
          <Button size="sm">Setup PRE</Button>
        </Link>
        {stake.tStake != "0" && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => openModal(ModalType.UnstakeT, { stake })}
          >
            Unstake
          </Button>
        )}
        <Button
          variant="outline"
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
