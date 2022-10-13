import { CheckCircleIcon, Icon } from "@chakra-ui/icons"
import {
  Alert,
  AlertIcon,
  Badge,
  BodyMd,
  BodyXs,
  BoxLabel,
  Button,
  Card,
  HStack,
  LabelSm,
  Tooltip,
  useColorModeValue,
} from "@threshold-network/components"
import { FC } from "react"
import { ModalType } from "../../enums"
import { useModal } from "../../hooks/useModal"
import shortenAddress from "../../utils/shortenAddress"
import { isAddressZero } from "../../web3/utils"
import { FiLink2 } from "react-icons/all"

const OperatorAddressMappingCard: FC<{
  stakingProvider: string
  mappedOperatorTbtc: string
  mappedOperatorRandomBeacon: string
}> = ({ stakingProvider, mappedOperatorTbtc, mappedOperatorRandomBeacon }) => {
  const { openModal } = useModal()
  const isOperatorMappedOnlyInTbtc =
    !isAddressZero(mappedOperatorTbtc) &&
    isAddressZero(mappedOperatorRandomBeacon)

  const isOperatorMappedOnlyInRandomBeacon =
    isAddressZero(mappedOperatorTbtc) &&
    !isAddressZero(mappedOperatorRandomBeacon)

  const isOneOfTheAppsNotMapped =
    isOperatorMappedOnlyInRandomBeacon || isOperatorMappedOnlyInTbtc

  const areAllAppsMappedSuccessfuly =
    !isAddressZero(mappedOperatorTbtc) &&
    !isAddressZero(mappedOperatorRandomBeacon)

  const onStartMappingClick = () => {
    openModal(ModalType.MapOperatorToStakingProvider, {
      mappedOperatorTbtc,
      mappedOperatorRandomBeacon,
    })
  }

  return (
    <Card borderColor={isOneOfTheAppsNotMapped ? "red.500" : "gray.100"}>
      <HStack justifyContent={"space-between"}>
        <LabelSm>Operator Address Mapping</LabelSm>
        <Badge variant={"solid"} size={"sm"} backgroundColor={"gray.800"}>
          Node operators only
        </Badge>
      </HStack>
      {areAllAppsMappedSuccessfuly ? (
        <HStack justify="space-between" mt={5}>
          <BoxLabel
            status="secondary"
            size={"sm"}
            icon={<CheckCircleIcon w={4} h={4} color="green.500" />}
          >
            Operator Mapped
          </BoxLabel>
          <HStack>
            <BodyMd color={useColorModeValue("brand.500", "brand.550")}>
              <Tooltip label={`Staking provider`}>
                {shortenAddress(stakingProvider)}
              </Tooltip>
            </BodyMd>
            <Icon color="gray.500" boxSize="16px" as={FiLink2} />
            <BodyMd color={useColorModeValue("gray.500", "gray.300")}>
              <Tooltip label={`Operator`}>
                {shortenAddress(mappedOperatorTbtc)}
              </Tooltip>
            </BodyMd>
          </HStack>
        </HStack>
      ) : (
        <>
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
            Start Mapping
          </Button>
        </>
      )}
    </Card>
  )
}

export default OperatorAddressMappingCard
