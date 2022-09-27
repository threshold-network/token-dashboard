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
import { useOperatorMappedtoStakingProviderHelpers } from "../../hooks/staking-applications/useOperatorMappedToStakingProviderHelpers"
import { useModal } from "../../hooks/useModal"

const OperatorAddressMappingCard = () => {
  const { openModal } = useModal()
  const { isOperatorMappedOnlyInRandomBeacon, isOperatorMappedOnlyInTbtc } =
    useOperatorMappedtoStakingProviderHelpers()
  const isOneOfTheAppsNotMapped =
    isOperatorMappedOnlyInRandomBeacon || isOperatorMappedOnlyInTbtc

  const onStartMappingClick = () => {
    openModal(ModalType.MapOperatorToStakingProvider)
  }

  return (
    <Card borderColor={isOneOfTheAppsNotMapped ? "red.500" : "gray.100"}>
      <HStack justifyContent={"space-between"}>
        <LabelSm>Operator Address Mapping</LabelSm>
        <Badge variant={"solid"} size={"sm"}>
          Node operators only
        </Badge>
      </HStack>
      <Alert
        status={isOneOfTheAppsNotMapped ? "error" : "warning"}
        alignItems={"center"}
        mt={5}
      >
        <AlertIcon h={"14px"} as={"div"} alignSelf="auto" />
        <BodyXs>
          {isOneOfTheAppsNotMapped
            ? "One application from the tBTC + Random Beacon Rewards Bundle Suite requires the Operator Address mapped."
            : "This section is for Staking Providers and self-operating stakers only. Map your Operator Address to your Provider Address for a better support for your hardware wallet in the node setup."}
        </BodyXs>
      </Alert>
      <Button size="lg" w="100%" mt="5" onClick={onStartMappingClick}>
        Start mapping
      </Button>
    </Card>
  )
}

export default OperatorAddressMappingCard
