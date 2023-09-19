import { Icon } from "@chakra-ui/icons"
import {
  Alert,
  AlertIcon,
  Badge,
  BodyMd,
  BodyXs,
  Box,
  BoxLabel,
  Button,
  Card,
  HStack,
  LabelSm,
  LineDivider,
  Tooltip,
  useColorModeValue,
} from "@threshold-network/components"
import { FC } from "react"
import { ModalType } from "../../enums"
import { useAppSelector } from "../../hooks/store"
import { useModal } from "../../hooks/useModal"
import { selectMappedOperators } from "../../store/account/selectors"
import shortenAddress from "../../utils/shortenAddress"
import { isAddressZero } from "../../web3/utils"
import { FcCheckmark, FiLink2 } from "react-icons/all"
import { getStakingAppLabelFromAppName } from "../../utils/getStakingAppLabel"
import { StakingAppName } from "../../store/staking-applications"

const OperatorAddressMappingCard: FC<{ stakingProvider: string }> = ({
  stakingProvider,
}) => {
  const { openModal } = useModal()
  const {
    mappedOperatorTbtc,
    mappedOperatorRandomBeacon,
    mappedOperatorTaco,
    isOneOfTheAppsNotMapped,
  } = useAppSelector(selectMappedOperators)

  const shoudlDisplaySuccessState =
    !isAddressZero(mappedOperatorTbtc) &&
    !isAddressZero(mappedOperatorRandomBeacon) &&
    !isAddressZero(mappedOperatorTaco)

  const onStartMappingClick = () => {
    openModal(ModalType.MapOperatorToStakingProvider)
  }

  const mappedOperators = {
    tbtc: mappedOperatorTbtc,
    randomBeacon: mappedOperatorRandomBeacon,
    taco: mappedOperatorTaco,
  }

  return (
    <Card borderColor={isOneOfTheAppsNotMapped ? "red.500" : "gray.100"}>
      <HStack justifyContent={"space-between"}>
        <LabelSm>Operator Address Mapping</LabelSm>
        <Badge variant={"solid"} size={"sm"} backgroundColor={"gray.800"}>
          Node operators only
        </Badge>
      </HStack>
      {shoudlDisplaySuccessState ? (
        Object.entries(mappedOperators).map(([appName, operator]) => {
          return (
            <Box key={`mapped_operator_${appName}_${operator}`}>
              <HStack mt={5}>
                <BoxLabel status="secondary" size={"sm"}>
                  {getStakingAppLabelFromAppName(appName as StakingAppName)} App
                </BoxLabel>
                <Badge variant="subtle" size={"md"} bgColor={"green.50"} py={1}>
                  <HStack>
                    <Icon as={FcCheckmark} />{" "}
                    <LabelSm color={"green.500"}>Operator Mapped</LabelSm>
                  </HStack>
                </Badge>
              </HStack>
              <HStack justify="space-between" mt={5}>
                <BoxLabel status="primary" size={"sm"}>
                  Provider
                </BoxLabel>
                <BodyMd color={useColorModeValue("brand.500", "brand.550")}>
                  <Tooltip label={`Staking provider`}>
                    {shortenAddress(stakingProvider)}
                  </Tooltip>
                </BodyMd>
                <Icon color="gray.500" boxSize="16px" as={FiLink2} />
                <BoxLabel status="secondary" size={"sm"}>
                  Operator
                </BoxLabel>
                <BodyMd color={useColorModeValue("gray.500", "gray.300")}>
                  <Tooltip label={`Operator`}>
                    {shortenAddress(operator)}
                  </Tooltip>
                </BodyMd>
              </HStack>
              {Object.keys(mappedOperators)[
                Object.keys(mappedOperators).length - 1
              ] !== appName && <LineDivider />}
            </Box>
          )
        })
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
