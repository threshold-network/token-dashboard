import { FC } from "react"
import Card from "../../../components/Card"
import {
  Button,
  CloseButton,
  HStack,
  Image,
  useDisclosure,
} from "@chakra-ui/react"
import overviewPeople from "../../../static/images/overview-people.png"
import { H4 } from "../../../components/Typography"

const UpgradeBanner: FC = () => {
  const { isOpen, onClose } = useDisclosure({ defaultIsOpen: true })

  return (
    <Card w="100%" display={isOpen ? "block" : "none"} position="relative">
      <CloseButton
        position="absolute"
        right="14px"
        top="12px"
        onClick={onClose}
      />
      <HStack justify="space-between" spacing={6}>
        <Image src={overviewPeople} />
        <H4>
          Have KEEP or Nu tokens? Upgrade them to T and harness the power of
          Threshold.
        </H4>
        <Button minW="180px" size="lg">
          Upgrade Tokens
        </Button>
      </HStack>
    </Card>
  )
}

export default UpgradeBanner
