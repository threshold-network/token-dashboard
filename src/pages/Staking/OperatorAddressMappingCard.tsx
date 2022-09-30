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
import { FC } from "react"
import { ModalType } from "../../enums"
import { useModal } from "../../hooks/useModal"
import { isAddressZero } from "../../web3/utils"

const OperatorAddressMappingCard: FC<{
  operatorMappedTbtc: string
  operatorMappedRandomBeacon: string
}> = ({ operatorMappedTbtc, operatorMappedRandomBeacon }) => {
  const { openModal } = useModal()
  const isOperatorMappedOnlyInTbtc =
    !isAddressZero(operatorMappedTbtc) &&
    isAddressZero(operatorMappedRandomBeacon)

  const isOperatorMappedOnlyInRandomBeacon =
    isAddressZero(operatorMappedTbtc) &&
    !isAddressZero(operatorMappedRandomBeacon)

  const isOneOfTheAppsNotMapped =
    isOperatorMappedOnlyInRandomBeacon || isOperatorMappedOnlyInTbtc

  const onStartMappingClick = () => {
    openModal(ModalType.MapOperatorToStakingProvider)
  }

  return (
    <Card borderColor={isOneOfTheAppsNotMapped ? "red.500" : "gray.100"}>
      <HStack justifyContent={"space-between"}>
        <LabelSm>Operator Address Mapping</LabelSm>
        <Badge variant={"solid"} size={"sm"} backgroundColor={"gray.800"}>
          Node operators only
        </Badge>
      </HStack>
      <Alert
        status={isOneOfTheAppsNotMapped ? "error" : "warning"}
        alignItems={"center"}
        mt={5}
        p={"8px 10px"}
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
