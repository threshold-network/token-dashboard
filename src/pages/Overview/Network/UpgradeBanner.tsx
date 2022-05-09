import { FC } from "react"
import Card from "../../../components/Card"
import {
  Box,
  Button,
  CloseButton,
  Image,
  Stack,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react"
import vortexLight from "../../../static/images/vortextLight.png"
import vortexDark from "../../../static/images/vortexDark.png"
import { H4 } from "../../../components/Typography"
import useChakraBreakpoint from "../../../hooks/useChakraBreakpoint"
import { Link as RouterLink } from "react-router-dom"
import useUpgradeHref from "../../../hooks/useUpgradeHref"

const UpgradeBanner: FC = () => {
  const { isOpen, onClose } = useDisclosure({ defaultIsOpen: true })

  const upgradeHref = useUpgradeHref()

  const heroText1 = "Have KEEP or NU tokens?"

  const heroText2 = "Upgrade them to T and harness the power of Threshold."

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
          src={useColorModeValue(vortexLight, vortexDark)}
          width={{ base: "140px" }}
          m={{ base: "auto" }}
          mr={{ xl: "10" }}
        />
        <Stack
          direction={{ base: "column", xl: "row" }}
          justify="space-around"
          w={{ base: "auto", lg: "100%" }}
          spacing={6}
        >
          <Stack justify="center">
            <H4>{heroText1}</H4>
            <H4>{heroText2}</H4>
          </Stack>
          <Button
            as={RouterLink}
            to={upgradeHref}
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
