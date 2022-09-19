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
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
  Stack,
  useColorModeValue,
} from "@threshold-network/components"
import InfoBox from "../../InfoBox"
import StakingApplicationOperationIcon from "../../StakingApplicationOperationIcon"
import shortenAddress from "../../../utils/shortenAddress"
import TokenBalance from "../../TokenBalance"
import { StakingAppName } from "../../../store/staking-applications"
import { useInitiateDeauthorization } from "../../../hooks/staking-applications"

const InitiateDeauthorization: FC<{
  closeModal: () => void
  stakingProvider: string
  decreaseAmount: string
  stakingAppName: StakingAppName
}> = ({ closeModal, stakingProvider, decreaseAmount, stakingAppName }) => {
  const { sendTransaction } = useInitiateDeauthorization(stakingAppName)

  const handleInitiateClick = async () => {
    await sendTransaction(stakingProvider, decreaseAmount)
  }

  return (
    <>
      <ModalHeader>Initiate Deauthorization</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <InfoBox variant="modal">
          <H5 mb={4}>
            You're about to initiate the decrease of your TBTC authoriation.
          </H5>
          <BodyLg>
            Initiation and confirmation of deauthorization is a two step action.
          </BodyLg>
        </InfoBox>
        <StakingApplicationOperationIcon
          stakingApplication={stakingAppName}
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
            This is 1 transaction
          </FlowStep>
          <FlowStep
            preTitle="Step 2"
            title="14 day cooldown"
            status={FlowStepStatus.inactive}
            size="sm"
          >
            You must wait a 14 day cooldown to then confirm the deauthorization.
            This is 1 transaction.
          </FlowStep>
        </Stack>
        <Alert status="warning">
          <AlertIcon />
          Take note! In this cooldown period, you cannot increase or decrease
          your authorization. As a measure of security for the entire network,
          in the event of slashing you will be slashed based on your initial
          amount.
        </Alert>
      </ModalBody>
      <ModalFooter>
        <Button variant="outline" onClick={closeModal} mr={2}>
          Dismiss
        </Button>
        <Button onClick={handleInitiateClick}>Initiate</Button>
      </ModalFooter>
    </>
  )
}

export default InitiateDeauthorization
