import { FC, useState, useCallback } from "react"
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
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@threshold-network/components"
import TransactionSuccessModal from "../TransactionSuccessModal"
import InfoBox from "../../InfoBox"
import { ModalType } from "../../../enums"
import { BaseModalProps } from "../../../types"
import withBaseModal from "../withBaseModal"
import { formatTokenAmount } from "../../../utils/formatAmount"
import {
  OnErrorCallback,
  OnSuccessCallback,
  useSendTransactionFromFn,
} from "../../../web3/hooks"
import { useModal } from "../../../hooks/useModal"
import { useThreshold } from "../../../contexts/ThresholdContext"
import { stakingAppNameToThresholdAppService } from "../../../hooks/staking-applications/useStakingAppContract"

export type TACoCommitProps = BaseModalProps & {
  stakingProvider: string
  authorizedAmount: string
}

const getEndDate = (durationInSeconds: number) => {
  const endDate = new Date()
  // extra 15724800 seconds for the 6-month deauthorization
  endDate.setSeconds(endDate.getSeconds() + durationInSeconds + 15724800)
  return endDate.toLocaleDateString()
}

const TACoCommitmentModal: FC<TACoCommitProps> = ({
  stakingProvider,
  authorizedAmount,
  closeModal,
}) => {
  const [value, setValue] = useState("")
  const threshold = useThreshold()
  const { openModal } = useModal()

  const onSuccess = useCallback<OnSuccessCallback>(
    (receipt) => {
      openModal(ModalType.TACoCommitmentSuccess, {
        transactionHash: receipt.transactionHash,
        authorizedAmount: authorizedAmount,
      })
    },
    [authorizedAmount]
  )
  const { sendTransaction } = useSendTransactionFromFn(
    threshold.multiAppStaking[stakingAppNameToThresholdAppService["taco"]]
      .makeCommitment,
    onSuccess
  )

  const submitCommitment = async (stakingProvider: string, choice: string) => {
    sendTransaction(stakingProvider, parseInt(choice))
  }

  return (
    <>
      <ModalHeader>TACo Token Lock-up Extension</ModalHeader>
      <ModalBody>
        <InfoBox mt="0" variant="modal">
          <BodyLg>
            You can lock up tokens (authorized to TACo) for longer durations in
            order to receive a yield bonus of corresponding size. You have
            currently authorized{" "}
            <strong>{formatTokenAmount(authorizedAmount)}T</strong> to TACo.
            <strong>
              {" "}
              Once you click Commit below, you cannot go back and edit this
              lock-up duration.{" "}
            </strong>
            Please read the{" "}
            <a href="https://docs.threshold.network/staking-and-running-a-node/taco-node-setup/taco-authorization-and-operator-registration/one-off-commitment-bonus">
              bonus rules
            </a>{" "}
            before deciding.
          </BodyLg>
        </InfoBox>
        <RadioGroup onChange={setValue} value={value}>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th></Th>
                <Th>Lock-up Duration</Th>
                <Th>Earliest Unlock Date</Th>
                <Th>Yield Bonus</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>
                  <Radio value="7862400" />
                </Td>
                <Td>9 months (6 month minimum + 3 month extension)</Td>
                <Td>{getEndDate(7862400)}</Td>
                <Td>0.5%</Td>
              </Tr>
              <Tr>
                <Td>
                  <Radio value="15724800" />
                </Td>
                <Td>12 months (6 month minimum + 6 month extension)</Td>
                <Td>{getEndDate(15724800)}</Td>
                <Td>1%</Td>
              </Tr>
              <Tr>
                <Td>
                  <Radio value="31449600" />
                </Td>
                <Td>18 months (6 month minimum + 12 month extension)</Td>
                <Td>{getEndDate(31449600)}</Td>
                <Td>2%</Td>
              </Tr>
              <Tr>
                <Td>
                  <Radio value="47174400" />
                </Td>
                <Td>24 months (6 month minimum + 18 month extension)</Td>
                <Td>{getEndDate(47174400)}</Td>
                <Td>3%</Td>
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
            Once you choose a lock-up duration and hit Commit below, your tokens
            will be irreversibly locked until the unlock date at the earliest.
            This cannot be undone. You may authorize more tokens to the same
            unlock horizon before the bonus deadline (January 15th 2024), but
            you cannot decrease the amount. You must also manually initiate
            deauthorization 6 months before the unlock date stated if you wish
            to withdraw tokens on said date. For more rules and information,
            head to the{" "}
            <a href="https://docs.threshold.network/staking-and-running-a-node/taco-node-setup/taco-authorization-and-operator-registration/one-off-commitment-bonus">
              documentation
            </a>
            .
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
export * from "./SuccessModal"
