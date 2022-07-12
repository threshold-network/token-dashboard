import { FC } from "react"
import { Button, ButtonGroup, useColorModeValue } from "@chakra-ui/react"

export const Switcher: FC<{ onClick: () => void; isActive: boolean }> = ({
  onClick,
  isActive,
}) => {
  const bgColor = useColorModeValue("gray.50", "gray.700")
  const activeButtonColor = useColorModeValue("white", "gray.700")

  return (
    <ButtonGroup
      backgroundColor={bgColor}
      borderRadius="6px"
      p={1}
      spacing="3"
      size="xs"
    >
      <Button
        variant={isActive ? "outline" : "ghost"}
        bg={isActive ? activeButtonColor : undefined}
        onClick={onClick}
      >
        Stake
      </Button>
      <Button
        variant={!isActive ? "outline" : "ghost"}
        bg={!isActive ? activeButtonColor : undefined}
        onClick={onClick}
      >
        Unstake
      </Button>
    </ButtonGroup>
  )
}
