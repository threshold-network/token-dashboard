import { FC } from "react"
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Button,
  Divider,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react"
import { BodySm, H5 } from "@threshold-network/components"
import withBaseModal from "../withBaseModal"
import { BaseModalProps } from "../../../types"
import StakingStats from "../../StakingStats"
import { useStakingState } from "../../../hooks/useStakingState"
import ViewInBlockExplorer from "../../ViewInBlockExplorer"
import { ExplorerDataType } from "../../../utils/createEtherscanLink"
import InfoBox from "../../InfoBox"
import { PreSetupSteps } from "../../StakingTimeline"
import ModalCloseButton from "../ModalCloseButton"

const StakeSuccessOld: FC<BaseModalProps & { transactionHash: string }> = ({
  closeModal,
  transactionHash,
}) => {
  const { stakeAmount, stakingProvider, beneficiary, authorizer } =
    useStakingState()

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
              Go through Step 2 to make sure you get Rewards
            </H5>
          </InfoBox>
          <PreSetupSteps />
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
          <Divider />
        </Stack>
      </ModalBody>
      <ModalFooter>
        <Button onClick={closeModal}>Dismiss</Button>
      </ModalFooter>
    </>
  )
}

export default withBaseModal(StakeSuccessOld)
