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
            choices, note that these durations include the obligatory and
            universal 6 month deauthorization delay:
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
                  <Radio value="7862400" />
                </Td>
                <Td>91 days</Td>
                <Td>0.5%</Td>
              </Tr>
              <Tr>
                <Td>
                  <Radio value="15724800" />
                </Td>
                <Td>6 months</Td>
                <Td>0.5%</Td>
              </Tr>
              <Tr>
                <Td>
                  <Radio value="31449600" />
                </Td>
                <Td>12 months</Td>
                <Td>1%</Td>
              </Tr>
              <Tr>
                <Td>
                  <Radio value="47174400" />
                </Td>
                <Td>546 days</Td>
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
            Once you choose a lock-up duration and hit Authorize below, your
            tokens will be irreversibly locked until the unlock date at the
            earliest. This cannot be undone. You may authorize more tokens to
            the same unlock horizon before the bonus deadline (12/30/23) , but
            you cannot decrease the amount. You must also manually initiate
            deauthorization 6 months before the unlock date stated if you wish
            to withdraw tokens on said date. For more rules and information,
            head to [link to documentation].
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
