import { FC } from "react"
import {
  BodyLg,
  BodySm,
  BoxLabel,
  FlowStep,
  FlowStepStatus,
  H5,
  LineDivider,
  Alert,
  AlertIcon,
  Button,
  Flex,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Stack,
  useColorModeValue,
  Box,
} from "@threshold-network/components"
import InfoBox from "../../InfoBox"
import StakingApplicationOperationIcon from "../../StakingApplicationOperationIcon"
import shortenAddress from "../../../utils/shortenAddress"
import TokenBalance from "../../TokenBalance"
import { StakingAppName } from "../../../store/staking-applications"
import {
  appNameToThresholdApp,
  useInitiateDeauthorization,
} from "../../../hooks/staking-applications"
import { getStakingAppLabelFromAppName } from "../../../utils/getStakingAppLabel"
import ModalCloseButton from "../ModalCloseButton"
import { StakingProviderAppInfo } from "../../../threshold-ts/applications"
import SubmitTxButton from "../../SubmitTxButton"
import { useThreshold } from "../../../contexts/ThresholdContext"

const InitiateDeauthorization: FC<
  {
    closeModal: () => void
    stakingProvider: string
    decreaseAmount: string
    appName: StakingAppName
  } & Pick<StakingProviderAppInfo, "isOperatorInPool" | "operator">
> = ({
  closeModal,
  stakingProvider,
  decreaseAmount,
  appName,
  isOperatorInPool,
  operator,
}) => {
  const threshold = useThreshold()
  const appContract =
    threshold.multiAppStaking[appNameToThresholdApp[appName]]?.contract

  let shouldUpdateOperatorStatusAfterInitiation
  if (appName === "taco") {
    shouldUpdateOperatorStatusAfterInitiation = false
  } else {
    shouldUpdateOperatorStatusAfterInitiation =
      isOperatorInPool !== undefined && !isOperatorInPool
  }
  const { sendTransaction } = useInitiateDeauthorization(
    appName,
    shouldUpdateOperatorStatusAfterInitiation
  )

  const handleInitiateClick = async () => {
    await sendTransaction(stakingProvider, decreaseAmount, operator)
  }

  return (
    <>
      <ModalHeader>Initiate Deauthorization</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <InfoBox variant="modal">
          <H5 mb={4}>
            You're about to initiate the decrease of your{" "}
            {getStakingAppLabelFromAppName(appName)} authorization.
          </H5>
          <BodyLg>
            Initiation and confirmation of deauthorization is a two step action.
          </BodyLg>
          {shouldUpdateOperatorStatusAfterInitiation && (
            <BodyLg>Initiation is comprised of 2 transactions.</BodyLg>
          )}
        </InfoBox>
        <StakingApplicationOperationIcon
          stakingApplication={appName}
          operation="decrease"
          h="88px"
          mx="auto"
          my={8}
        />
        <LineDivider />
        <Stack mb={8}>
          <Flex justifyContent="space-between">
            <BodySm color="gray.500">Decrease amount</BodySm>
            <TokenBalance
              tokenAmount={decreaseAmount.toString()}
              tokenSymbol="T"
              withSymbol
              as="p"
              fontSize="sm"
              fontWeight="400"
              lineHeight="20px"
              color={useColorModeValue("gray.700", "gray.300")}
            />
          </Flex>
          <Flex justifyContent="space-between">
            <BodySm color="gray.500">Provider Address</BodySm>
            <BodySm color="gray.700">{shortenAddress(stakingProvider)}</BodySm>
          </Flex>
        </Stack>
        <BoxLabel mb={8} colorScheme="outline">
          Deauthorization Timeline
        </BoxLabel>
        <Stack mb={8} spacing={4}>
          <FlowStep
            preTitle="Step 1"
            title="Initiate deauthorization"
            status={FlowStepStatus.active}
            size="sm"
          >
            {shouldUpdateOperatorStatusAfterInitiation ? (
              <>
                1 transaction - Deauthorization Request.
                <Box as="p">1 transaction - Deauthorization Initiation.</Box>
              </>
            ) : (
              "This is 1 transaction."
            )}
          </FlowStep>
          <FlowStep
            preTitle="Step 2"
            title={appName === "taco" ? "6 month cooldown" : "45 day cooldown"}
            status={FlowStepStatus.inactive}
            size="sm"
          >
            You must wait a {appName === "taco" ? "6 month" : "45 day"} cooldown
            to then confirm the deauthorization. This is 1 transaction.
          </FlowStep>
        </Stack>
        <Alert status="warning">
          <AlertIcon />
          Take note! In this {appName === "taco" ? "6 month" : "45 day"}{" "}
          cooldown period, you cannot increase or decrease your authorization.
          As a measure of security for the entire network, in the event of
          slashing you will be slashed based on your initial amount.
        </Alert>
      </ModalBody>
      <ModalFooter>
        <Button variant="outline" onClick={closeModal} mr={2}>
          Dismiss
        </Button>
        <SubmitTxButton
          isDisabled={!appContract}
          onSubmit={handleInitiateClick}
        >
          Initiate
        </SubmitTxButton>
      </ModalFooter>
    </>
  )
}

export default InitiateDeauthorization
