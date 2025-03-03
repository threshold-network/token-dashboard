import { FC } from "react"
import {
  BodyLg,
  Button,
  H5,
  ModalBody,
  ModalFooter,
  ModalHeader,
  List,
  ListItem,
  Divider,
  HStack,
  BodySm,
} from "@threshold-network/components"
import InfoBox from "../../InfoBox"
import StakingApplicationOperationIcon from "../../StakingApplicationOperationIcon"
import shortenAddress from "../../../utils/shortenAddress"
import { formatTokenAmount } from "../../../utils/formatAmount"
import withBaseModal from "../withBaseModal"
import { StakingAppName } from "../../../store/staking-applications"
import { BaseModalProps } from "../../../types"
import {
  appNameToThresholdApp,
  useConfirmDeauthorizationTransaction,
} from "../../../hooks/staking-applications"
import ModalCloseButton from "../ModalCloseButton"
import SubmitTxButton from "../../SubmitTxButton"
import { useThreshold } from "../../../contexts/ThresholdContext"

export type ConfirmDeauthorizationProps = BaseModalProps & {
  stakingProvider: string
  appName: StakingAppName
  decreaseAmount: string
}

const ConfirmDeauthorizationBase: FC<ConfirmDeauthorizationProps> = ({
  stakingProvider,
  appName,
  decreaseAmount,
  closeModal,
}) => {
  const threshold = useThreshold()
  const stakingAppContract =
    threshold.multiAppStaking[appNameToThresholdApp[appName]]?.contract

  const { sendTransaction } = useConfirmDeauthorizationTransaction(appName)

  const onDeauthorize = async () => {
    await sendTransaction(stakingProvider)
  }

  return (
    <>
      <ModalHeader>Confirm Deauthorization</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <InfoBox variant="modal" mb="6" mt="0">
          <H5>The cooldown period is complete.</H5>
          <BodyLg mt="4">Confirm your deauthorization.</BodyLg>
        </InfoBox>
        <StakingApplicationOperationIcon
          stakingApplication={appName}
          operation="decrease"
          w="88px"
          h="88px"
          mb="6"
          mx="auto"
        />
        <Divider />
        <List spacing="2.5" my="6">
          <ListItem>
            <HStack justifyContent="space-between">
              <BodySm>Increase Amount</BodySm>
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
      </ModalBody>
      <ModalFooter>
        <Button onClick={closeModal} variant="outline" mr={2}>
          Cancel
        </Button>
        <SubmitTxButton
          isDisabled={!stakingAppContract}
          mr={2}
          onSubmit={onDeauthorize}
        >
          Confirm Deauthorization
        </SubmitTxButton>
      </ModalFooter>
    </>
  )
}

export const ConfirmDeauthorization = withBaseModal(ConfirmDeauthorizationBase)
