import { FC } from "react"
import Card from "../../../components/Card"
import {
  Button,
  CloseButton,
  HStack,
  Image,
  Stack,
  useDisclosure,
} from "@chakra-ui/react"
import overviewPeople from "../../../static/images/overview-people.png"
import { Body2, H4 } from "../../../components/Typography"
import useChakraBreakpoint from "../../../hooks/useChakraBreakpoint"

const UpgradeBanner: FC = () => {
  const { isOpen, onClose } = useDisclosure({ defaultIsOpen: true })

  const heroText =
    "Have KEEP or Nu tokens? Upgrade them to T and harness the power of Threshold."

  const isMobile = useChakraBreakpoint("md")

  return (
    <Card w="100%" display={isOpen ? "block" : "none"} position="relative">
      <CloseButton
        position="absolute"
        right="14px"
        top="12px"
        onClick={onClose}
      />
      <HStack justify="space-between" spacing={6}>
        <Image src={overviewPeople} width={{ base: "140px" }} />
        <Stack
          direction={{ base: "column", lg: "row" }}
          justify="space-around"
          w="100%"
        >
          {isMobile ? (
            <Body2>{heroText}</Body2>
          ) : (
            <H4 maxW="500px">{heroText}</H4>
          )}
          <Button
            size={isMobile ? "sm" : "lg"}
            marginY="auto !important"
            px={{ base: 0, md: 12 }}
            marginTop={{ base: 8, md: "auto !important" }}
          >
            Upgrade Tokens
          </Button>
        </Stack>
      </HStack>
    </Card>
  )
}

export default UpgradeBanner
