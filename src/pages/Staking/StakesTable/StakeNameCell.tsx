import { FC } from "react"
import { Circle, HStack, Td, VStack } from "@chakra-ui/react"
import gradient from "random-gradient"
import { StakeCellProps } from "../../../types/staking"
import { Body2, Body3 } from "../../../components/Typography"

const StakeNameCell: FC<StakeCellProps & { index: number }> = ({
  stake,
  index,
}) => {
  return (
    <Td>
      <HStack>
        <Circle size="24px" bg={gradient(stake.operator)} />
        <VStack>
          <Body2>T Stake {index + 1}</Body2>
          <Body3 color="gray.500">Threshold</Body3>
        </VStack>
      </HStack>
    </Td>
  )
}

export default StakeNameCell
