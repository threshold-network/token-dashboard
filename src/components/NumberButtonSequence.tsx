import { FC } from "react"
import { HStack, Button } from "@threshold-network/components"
import { range } from "../utils/range"

const NumberButtonSequence: FC<{
  numberOfButtons: number
  selectedButtonNum: number
  setSelectedButtonNum: (n: number) => void
}> = ({ numberOfButtons, selectedButtonNum, setSelectedButtonNum }) => {
  return (
    <HStack spacing={1}>
      {range(numberOfButtons, 1).map((n) => (
        <Button
          variant="sequence"
          isSelected={n === selectedButtonNum}
          onClick={() => setSelectedButtonNum(n)}
        >
          {n}
        </Button>
      ))}
    </HStack>
  )
}

export default NumberButtonSequence
