import { Button, CloseButton, Stack, useDisclosure } from "@chakra-ui/react"
import Card from "../Card"
import { H4 } from "../Typography"
import { BonusTitle } from "./Title"

export const StakingBonusBanner = () => {
  const { isOpen, onClose } = useDisclosure({ defaultIsOpen: true })

  return (
    <Card w="100%" display={isOpen ? "block" : "none"} position="relative">
      <CloseButton
        position="absolute"
        right="14px"
        top="12px"
        onClick={onClose}
      />
      <Stack
        alignItems="center"
        spacing={6}
        direction={{ base: "column", xl: "row" }}
      >
        <BonusTitle />
        <H4 textAlign={{ base: "center", xl: "unset" }}>
          Starting May the 15th you can get your Staking Bonus!
        </H4>
        <Button
          w={{ base: "100%", xl: "auto" }}
          marginY="auto"
          mt={{ base: 12, xl: "auto" }}
          px={{ base: 4, md: 12 }}
        >
          Check eligibility
        </Button>
      </Stack>
    </Card>
  )
}
