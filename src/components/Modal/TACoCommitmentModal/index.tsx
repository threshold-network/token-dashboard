import { FC, useState } from "react"
import {
  AlertBox,
  BodyLg,
  BodyXs,
  Button,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Radio,
  RadioGroup,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@threshold-network/components"
import TransactionSuccessModal from "../TransactionSuccessModal"
import InfoBox from "../../InfoBox"
import { BaseModalProps } from "../../../types"
import withBaseModal from "../withBaseModal"
import {
  OnErrorCallback,
  OnSuccessCallback,
  useSendTransactionFromFn,
} from "../../../web3/hooks"
import { useThreshold } from "../../../contexts/ThresholdContext"
import { stakingAppNameToThresholdAppService } from "../../../hooks/staking-applications/useStakingAppContract"

export type TACoCommitProps = BaseModalProps & {
  stakingProvider: string
}

// TACo Commitment Modal
//  has two buttons, one for committing and one for canceling
const TACoCommitmentModal: FC<TACoCommitProps> = ({
  stakingProvider,
  closeModal,
}) => {
  const [value, setValue] = useState("")
  const threshold = useThreshold()
  const { sendTransaction } = useSendTransactionFromFn(
    threshold.multiAppStaking[stakingAppNameToThresholdAppService["taco"]]
      .makeCommitment
  )

  const submitCommitment = async (stakingProvider: string, choice: string) => {
    console.log("submitting commitment")
    console.log(stakingProvider)
    console.log(parseInt(choice))
    sendTransaction(stakingProvider, parseInt(choice))
  }

  return (
    <>
      <ModalHeader>TACo App Commitment</ModalHeader>
      <ModalBody>
        <InfoBox mt="0" variant="modal">
          <BodyLg>
            You have the option of locking up your tokens for longer durations
            in order to receive a yield bonus of corresponding size. There are 4
            choices:
          </BodyLg>
        </InfoBox>
        <RadioGroup onChange={setValue} value={value}>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th></Th>
                <Th>Lock-up Duration</Th>
                <Th>Yield Bonus</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>
                  <Radio value="15724800" />
                </Td>
                <Td>9 months</Td>
                <Td>0.5%</Td>
              </Tr>
              <Tr>
                <Td>
                  <Radio value="31449600" />
                </Td>
                <Td>12 months</Td>
                <Td>1%</Td>
              </Tr>
            </Tbody>
          </Table>
        </RadioGroup>
        <AlertBox
          status="warning"
          withIcon={false}
          alignItems="center"
          p={"8px 10px"}
        >
          <BodyXs>
            Note that these durations include the obligatory and universal 6
            month deauthorization delay.
          </BodyXs>
        </AlertBox>
      </ModalBody>
      <ModalFooter>
        <Button onClick={closeModal} variant="outline" mr={2}>
          Cancel
        </Button>
        <Button
          onClick={() => submitCommitment(stakingProvider, value)}
          type="submit"
        >
          Commit
        </Button>
      </ModalFooter>
    </>
  )
}

export default withBaseModal(TACoCommitmentModal)
