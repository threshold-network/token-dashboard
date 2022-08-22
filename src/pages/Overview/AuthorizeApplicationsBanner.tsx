import { useNavigate } from "react-router-dom"
import {
  Button,
  CloseButton,
  Stack,
  useDisclosure,
  Image,
} from "@chakra-ui/react"
import { Card, H4 } from "@threshold-network/components"
import authorizeAppsFingerPrint from "../../static/images/AuthorizeAppsFingerPrint.png"

export const AuthorizeApplicationsBanner = () => {
  const navigate = useNavigate()
  const { isOpen, onClose } = useDisclosure({ defaultIsOpen: true })

  return (
    <Card
      w="100%"
      display={isOpen ? "block" : "none"}
      position="relative"
      px="16"
      mb={4}
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
        <Image maxW="146px" src={authorizeAppsFingerPrint} />
        <H4 textAlign={{ base: "center", xl: "unset" }} maxW="460px">
          Authorize Threshold apps and stake your T to earn rewards.
        </H4>
        <Button
          onClick={() => navigate("/staking")}
          w={{ base: "100%", xl: "auto" }}
          mt={{ base: 12, xl: "auto" }}
          marginInlineStart={{ base: "8", xl: "auto !important" }}
          px={{ base: 4, md: 12 }}
        >
          Start Staking
        </Button>
      </Stack>
    </Card>
  )
}
