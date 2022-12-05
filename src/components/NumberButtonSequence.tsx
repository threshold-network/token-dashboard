import { FC } from "react"
import { Button, HStack } from "@threshold-network/components"
import { range } from "../utils/range"
import { StackProps } from "@chakra-ui/react"
import { ThemeTypings } from "@chakra-ui/styled-system"

interface NumberButtonSequenceProps extends StackProps {
  numberOfButtons: number
  selectedButtonNum: number
  setSelectedButtonNum: (n: number) => void
  size?: ThemeTypings["components"]["Button"]["sizes"]
}

const NumberButtonSequence: FC<NumberButtonSequenceProps> = ({
  numberOfButtons,
  selectedButtonNum,
  setSelectedButtonNum,
  size,
  ...props
}) => {
  return (
    <HStack spacing={1} {...props}>
      {range(numberOfButtons, 1).map((n) => (
        <Button
          size={size}
          variant="sequence"
          isActive={n === selectedButtonNum}
          onClick={() => setSelectedButtonNum(n)}
        >
          {n}
        </Button>
      ))}
    </HStack>
  )
}

export default NumberButtonSequence
