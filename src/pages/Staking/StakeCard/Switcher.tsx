import { FC } from "react"
import { Button, ButtonGroup, useColorModeValue } from "@chakra-ui/react"

export const Switcher: FC<{ onClick: () => void; isStakeAction: boolean }> = ({
  onClick,
  isStakeAction,
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
        variant={isStakeAction ? "outline" : "ghost"}
        bg={isStakeAction ? activeButtonColor : undefined}
        onClick={onClick}
      >
        Stake
      </Button>
      <Button
        variant={!isStakeAction ? "outline" : "ghost"}
        bg={!isStakeAction ? activeButtonColor : undefined}
        onClick={onClick}
      >
        Unstake
      </Button>
    </ButtonGroup>
  )
}
