import { FC, useEffect } from "react"
import { useWeb3React } from "@web3-react/core"
import {
  Box,
  Button,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
  Stack,
} from "@chakra-ui/react"
import { Body1, Body2, Body3, H5 } from "../../Typography"
import withBaseModal from "../withBaseModal"
import TokenBalanceInput from "../../TokenBalanceInput"
import { formatTokenAmount } from "../../../utils/formatAmount"
import { useModal } from "../../../hooks/useModal"
import { BaseModalProps } from "../../../types"
import AdvancedParamsForm from "./AdvancedParamsForm"
import ThresholdCircleBrand from "../../../static/icons/ThresholdCircleBrand"

interface ConfirmStakingParamsProps extends BaseModalProps {
  amountToStake: number
  setAmountToStake: (amount: number | string) => void
  maxAmount: number
  onSubmit: () => void
  operator: string
  setOperator: (val: string) => void
  beneficiary: string
  setBeneficiary: (val: string) => void
  authorizer: string
  setAuthorizer: (val: string) => void
}

const ConfirmStakingParams: FC<ConfirmStakingParamsProps> = ({
  amountToStake,
  setAmountToStake,
  maxAmount,
  onSubmit,
  operator,
  setOperator,
  beneficiary,
  setBeneficiary,
  authorizer,
  setAuthorizer,
}) => {
  const { closeModal } = useModal()
  const { account } = useWeb3React()

  // close itself if the wallet is disconnected
  useEffect(() => {
    if (!account) {
      closeModal()
    }
  }, [account])

  return (
    <>
      <ModalHeader>Stake Tokens</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Box borderRadius="md" bg="gray.50" p={6} mb={8}>
          <H5 mb={4}>You are about to stake T</H5>
          <Body1>
            Here is some sub text copy to explain the staking process
          </Body1>
        </Box>
        <Stack spacing={6} mb={6}>
          <Box>
            <TokenBalanceInput
              label={`T Amount`}
              amount={amountToStake}
              setAmount={setAmountToStake}
              max={maxAmount}
              icon={ThresholdCircleBrand}
              mb={2}
            />
            <Body3>{formatTokenAmount(maxAmount)} T available to stake.</Body3>
          </Box>
          <Body2>
            Operator, Beneficiary, and Authorizer addresses are currently set
            to: {account}
          </Body2>
          <AdvancedParamsForm
            {...{
              operator,
              setOperator,
              beneficiary,
              setBeneficiary,
              authorizer,
              setAuthorizer,
            }}
          />
        </Stack>
      </ModalBody>
      <ModalFooter>
        <Button onClick={closeModal} variant="outline" mr={2}>
          Cancel
        </Button>
        <Button
          disabled={+amountToStake === 0 || +amountToStake > +maxAmount}
          onClick={onSubmit}
        >
          Stake
        </Button>
      </ModalFooter>
    </>
  )
}

export default withBaseModal(ConfirmStakingParams)
