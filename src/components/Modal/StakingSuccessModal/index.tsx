import { FC } from "react"
import {
  Alert,
  AlertDescription,
  AlertIcon,
  BodySm,
  BoxLabel,
  Button,
  FlowStep,
  FlowStepStatus,
  H5,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Stack,
  useColorModeValue,
} from "@threshold-network/components"
import withBaseModal from "../withBaseModal"
import { BaseModalProps } from "../../../types"
import StakingStats from "../../StakingStats"
import { useStakingState } from "../../../hooks/useStakingState"
import ViewInBlockExplorer from "../../ViewInBlockExplorer"
import { ExplorerDataType } from "../../../utils/createEtherscanLink"
import InfoBox from "../../InfoBox"
import { useModal } from "../../../hooks/useModal"
import { ModalType } from "../../../enums"
import ModalCloseButton from "../ModalCloseButton"

const simpleStakingTimelineFlowSteps = [
  {
    preTitle: "Step 1",
    title: "Stake Tokens",
    status: FlowStepStatus.complete,
  },
  {
    preTitle: "Step 2",
    title: "Authorize Apps",
    status: FlowStepStatus.active,
    children:
      "You can authorize 100% of your stake for each app. This amount can be changed at any time.",
  },
  {
    preTitle: "Step 3",
    title: "Set up Node",
    status: FlowStepStatus.inactive,
    children: "Set up and run a node for any of the applications authorized.",
  },
]

const StakingSuccessModal: FC<BaseModalProps & { transactionHash: string }> = ({
  closeModal,
  transactionHash,
}) => {
  const { stakeAmount, stakingProvider, beneficiary, authorizer } =
    useStakingState()

  const { openModal } = useModal()

  const handleSubmit = () => {
    openModal(ModalType.NewStakerAuthorizeStakingApplication)
  }

  return (
    <>
      <ModalHeader>Step 1 Completed</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Stack spacing={6}>
          <Alert status="success">
            <AlertIcon />
            <AlertDescription>Your deposit was successful!</AlertDescription>
          </Alert>
          <StakingStats
            {...{
              stakeAmount,
              beneficiary,
              stakingProvider,
              authorizer,
            }}
          />
          <InfoBox variant="modal">
            <H5 color={useColorModeValue("gray.800", "white")}>
              Next, go to Step 2 in order to authorize Threshold apps to earn
              rewards.
            </H5>
          </InfoBox>
          <Stack spacing={6}>
            <BoxLabel status="secondary">Staking Timeline</BoxLabel>
            {simpleStakingTimelineFlowSteps.map((step, i) => (
              <FlowStep
                size="sm"
                {...step}
                key={`staking_success_modal_timeline__step_${i + 1}`}
              />
            ))}
          </Stack>
        </Stack>
        {transactionHash && (
          <BodySm mt="2.5rem !important" align="center">
            <ViewInBlockExplorer
              text="View"
              id={transactionHash}
              type={ExplorerDataType.TRANSACTION}
            />{" "}
            transaction on Etherscan
          </BodySm>
        )}
      </ModalBody>
      <ModalFooter>
        <Button mr={2} variant="outline" onClick={closeModal}>
          Dismiss
        </Button>
        <Button onClick={handleSubmit}>Authorize Apps</Button>
      </ModalFooter>
    </>
  )
}

export default withBaseModal(StakingSuccessModal)
