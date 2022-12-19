import { FC } from "react"
import { Button, HStack, StackProps } from "@threshold-network/components"
import { range } from "../utils/range"
import { ButtonProps } from "@chakra-ui/react"

interface NumberButtonSequenceProps extends StackProps {
  numberOfButtons: number
  selectedButtonNum?: number
  onButtonClick: (n: number) => void
  size?: ButtonProps["size"]
}

const NumberButtonSequence: FC<NumberButtonSequenceProps> = ({
  numberOfButtons,
  selectedButtonNum,
  onButtonClick,
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
          onClick={() => onButtonClick(n)}
        >
          {n}
        </Button>
      ))}
    </HStack>
  )
}

export default NumberButtonSequence
