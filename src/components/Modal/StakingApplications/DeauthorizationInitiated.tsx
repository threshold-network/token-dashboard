import { FC } from "react"
import {
  HStack,
  Button,
  ModalBody,
  ModalFooter,
  ModalHeader,
  List,
  ListItem,
  Alert,
  AlertIcon,
  BodySm,
  Divider,
  BoxLabel,
  Stack,
  FlowStep,
  FlowStepStatus,
} from "@threshold-network/components"
import ViewInBlockExplorer from "../../ViewInBlockExplorer"
import withBaseModal from "../withBaseModal"
import shortenAddress from "../../../utils/shortenAddress"
import { formatTokenAmount } from "../../../utils/formatAmount"
import { ExplorerDataType } from "../../../utils/createEtherscanLink"
import { BaseModalProps } from "../../../types"
import ModalCloseButton from "../ModalCloseButton"

export type DeauthorizationInitiatedProps = BaseModalProps & {
  stakingProvider: string
  txHash: string
  decreaseAmount: string
}

// TODO: revisit because we have the same layout for `AuthorizationIncreased`
// success modal. Should we create a new layout for success modal?
const DeauthorizationInitiatedBase: FC<DeauthorizationInitiatedProps> = ({
  stakingProvider,
  txHash,
  decreaseAmount,
  closeModal,
}) => {
  return (
    <>
      <ModalHeader>Initiation Started</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Alert status="success" mb={4}>
          <AlertIcon />
          Your deauthorization was initiated. Your 45 day cooldown period has
          started.
        </Alert>
        <List spacing="2.5" my="6">
          <ListItem>
            <HStack justifyContent="space-between">
              <BodySm>Decrease Amount</BodySm>
              <BodySm>{formatTokenAmount(decreaseAmount)} T</BodySm>
            </HStack>
          </ListItem>
          <ListItem>
            <HStack justifyContent="space-between">
              <BodySm>Provider Address</BodySm>
              <BodySm>{shortenAddress(stakingProvider)}</BodySm>
            </HStack>
          </ListItem>
        </List>
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
            title="45 day cooldown"
            status={FlowStepStatus.active}
            size="sm"
          >
            You must wait a 45 day cooldown to then confirm the deauthorization.
            This is 1 transaction.
          </FlowStep>
        </Stack>
        <Alert status="warning" mb="12">
          <AlertIcon />
          Take note! In this cooldown period, you cannot increase or decrease
          your authorization. As a measure of security for the entire network,
          in the event of slashing you will be slashed based on your initial
          amount.
        </Alert>
        <BodySm align="center">
          <ViewInBlockExplorer
            text="View"
            id={txHash}
            type={ExplorerDataType.TRANSACTION}
          />{" "}
          transaction on Etherscan
        </BodySm>
        <Divider mt="4" />
      </ModalBody>
      <ModalFooter>
        <Button onClick={closeModal}>Dismiss</Button>
      </ModalFooter>
    </>
  )
}

export const DeauthorizationInitiated = withBaseModal(
  DeauthorizationInitiatedBase
)
