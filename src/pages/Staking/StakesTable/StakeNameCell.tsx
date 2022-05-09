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
import { BodyMd, BodySm } from "@threshold-network/components"

const StakeNameCell: FC<StakeCellProps & { index: number }> = ({
  stake,
  index,
}) => {
  return (
    <Td>
      <HStack>
        <Circle size="24px" bg={gradient(stake.stakingProvider)} />
        <VStack>
          <BodyMd>T Stake {index + 1}</BodyMd>
          <BodySm color={useColorModeValue("gray.500", "gray.300")}>
            Threshold
          </BodySm>
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
