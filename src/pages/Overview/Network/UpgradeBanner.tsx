import { FC } from "react"
import Card from "../../../components/Card"
import {
  Button,
  CloseButton,
  Image,
  Stack,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react"
import overviewPeople from "../../../static/images/overview-people.png"
import vortex from "../../../static/images/vortex.png"
import { Body2, H4 } from "../../../components/Typography"
import useChakraBreakpoint from "../../../hooks/useChakraBreakpoint"
import { Link as RouterLink } from "react-router-dom"

const UpgradeBanner: FC = () => {
  const { isOpen, onClose } = useDisclosure({ defaultIsOpen: true })

  const heroText =
    "Have KEEP or NuCircleBrand tokens? Upgrade them to T and harness the power of ThresholdCircleBrand."

  const isMobile = useChakraBreakpoint("md")

  return (
    <Card w="100%" display={isOpen ? "block" : "none"} position="relative">
      <CloseButton
        position="absolute"
        right="14px"
        top="12px"
        onClick={onClose}
      />
      <Stack
        justify="space-between"
        spacing={6}
        direction={{ base: "column", md: "row" }}
      >
        <Image
          src={useColorModeValue(overviewPeople, vortex)}
          width={{ base: "140px" }}
          m="auto"
        />
        <Stack
          direction={{ base: "column", xl: "row" }}
          justify="space-around"
          w={{ base: "auto", lg: "100%" }}
          spacing={6}
        >
          {isMobile ? (
            <Body2 paddingRight={8}>{heroText}</Body2>
          ) : (
            <H4 maxW="500px">{heroText}</H4>
          )}

          <Button
            as={RouterLink}
            to="/upgrade"
            _hover={{ textDecoration: "none" }}
            marginY="auto !important"
            mt={{ base: 12, xl: "auto !important" }}
            size={isMobile ? "sm" : "lg"}
            px={{ base: 4, md: 12 }}
          >
            {isMobile ? "Upgrade Now" : "Upgrade Tokens"}
          </Button>
        </Stack>
      </Stack>
    </Card>
  )
}

export default UpgradeBanner
