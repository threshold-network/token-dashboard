import { FC } from "react"
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Button,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
  Stack,
} from "@chakra-ui/react"
import { Body1, Body3 } from "../../Typography"
import withBaseModal from "../withBaseModal"
import { BaseModalProps } from "../../../types"
import { PreSetupSteps } from "../../StakingChecklist"
import StakingStats from "../../StakingStats"
import { useStakingState } from "../../../hooks/useStakingState"
import ViewInBlockExplorer from "../../ViewInBlockExplorer"
import { ExplorerDataType } from "../../../utils/createEtherscanLink"
import InfoBox from "../../InfoBox"

const StakingChecklistModal: FC<
  BaseModalProps & { transactionHash: string }
> = ({ closeModal, transactionHash }) => {
  const { stakeAmount, operator, beneficiary, authorizer } = useStakingState()

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
          <InfoBox variant="modal">
            <StakingStats
              {...{
                stakeAmount,
                beneficiary,
                stakingProvider: operator,
                authorizer,
              }}
            />
          </InfoBox>
          <Alert status="warning">
            <Body1>Complete Step 2 to start earning Rewards</Body1>
          </Alert>
          <PreSetupSteps />
          {transactionHash && (
            <Body3 mt="4rem" align="center">
              <ViewInBlockExplorer
                text="View"
                id={transactionHash}
                type={ExplorerDataType.TRANSACTION}
              />{" "}
              transaction on Etherscan
            </Body3>
          )}
        </Stack>
      </ModalBody>
      <ModalFooter>
        <Button onClick={closeModal}>Dismiss</Button>
      </ModalFooter>
    </>
  )
}

export default withBaseModal(StakingChecklistModal)
