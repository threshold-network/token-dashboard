import {
  Alert,
  AlertIcon,
  Badge,
  BodyXs,
  Button,
  Card,
  HStack,
} from "@threshold-network/components"
import { LabelSm } from "@threshold-network/components"
import { ModalType } from "../../enums"
import { useModal } from "../../hooks/useModal"

const OperatorAddressMappingCard = () => {
  const { openModal } = useModal()

  const onStartMappingClick = () => {
    openModal(ModalType.MapOperatorToStakingProvider)
  }

  return (
    <Card>
      <HStack justifyContent={"space-between"}>
        <LabelSm>Operator Address Mapping</LabelSm>
        <Badge variant={"solid"} size={"sm"}>
          Node operators only
        </Badge>
      </HStack>
      <Alert status={"warning"} alignItems={"center"} mt={5}>
        <AlertIcon alignSelf="auto" />
        <BodyXs>
          This section is for Staking Providers and self-operating stakers only.
          Map your Operator Address to your Provider Address for a better
          support for your hardware wallet in the node setup.
        </BodyXs>
      </Alert>
      <Button size="lg" w="100%" mt="5" onClick={onStartMappingClick}>
        Start mapping
      </Button>
    </Card>
  )
}

export default OperatorAddressMappingCard
