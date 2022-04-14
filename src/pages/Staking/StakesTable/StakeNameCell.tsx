import { FC } from "react"
import {
  Badge,
  Circle,
  HStack,
  Td,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react"
import gradient from "random-gradient"
import { StakeCellProps } from "../../../types/staking"
import { Body2, Body3 } from "@threshold-network/components"

const StakeNameCell: FC<StakeCellProps & { index: number }> = ({
  stake,
  index,
}) => {
  return (
    <Td>
      <HStack>
        <Circle size="24px" bg={gradient(stake.stakingProvider)} />
        <VStack>
          <Body2>T Stake {index + 1}</Body2>
          <Body3 color={useColorModeValue("gray.500", "gray.300")}>
            Threshold
          </Body3>
          {stake.tStake == "0" && (
            <Badge variant="subtle" colorScheme="yellow">
              Inactive
            </Badge>
          )}
        </VStack>
      </HStack>
    </Td>
  )
}

export default StakeNameCell
