import {
  Button,
  CloseButton,
  Stack,
  useDisclosure,
  Box,
} from "@chakra-ui/react"
import { Card, H4 } from "@threshold-network/components"
import { BonusTitle } from "./Title"
import { useModal } from "../../hooks/useModal"
import { ModalType } from "../../enums"

export const StakingBonusBanner = () => {
  const { isOpen, onClose } = useDisclosure({ defaultIsOpen: true })
  const { openModal } = useModal()

  return (
    <Card
      w="100%"
      display={isOpen ? "block" : "none"}
      position="relative"
      px="16"
    >
      <CloseButton
        position="absolute"
        right="14px"
        top="12px"
        onClick={onClose}
      />
      <Stack
        alignItems="center"
        spacing={{ base: "8", xl: "16" }}
        direction={{ base: "column", xl: "row" }}
        bg="inherit"
      >
        <BonusTitle />
        <H4 textAlign={{ base: "center", xl: "unset" }}>
          Starting June 1st you can
          <Box as="p">get your Staking Bonus!</Box>
        </H4>
        <Button
          onClick={() => openModal(ModalType.StakingBonus)}
          w={{ base: "100%", xl: "auto" }}
          mt={{ base: 12, xl: "auto" }}
          marginInlineStart={{ base: "8", xl: "auto !important" }}
          px={{ base: 4, md: 12 }}
        >
          Check eligibility
        </Button>
      </Stack>
    </Card>
  )
}
