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
import { useStakingState } from "../../../hooks/useStakingState"
import { useTokenState } from "../../../hooks/useTokenState"
import { useStakeTransaction } from "../../../web3/hooks/useStakeTransaction"
import { ModalType } from "../../../enums"

const ConfirmStakingParams: FC<BaseModalProps> = () => {
  const { closeModal, openModal } = useModal()
  const {
    t: { balance: maxAmount },
  } = useTokenState()
  const { account } = useWeb3React()

  const {
    stakingState: { stakeAmount, operator, beneficiary, authorizer },
    updateState,
  } = useStakingState()

  const setStakeAmount = (value: string | number) =>
    updateState("stakeAmount", value)
  const setOperator = (value: string) => updateState("operator", value)
  const setBeneficiary = (value: string) => updateState("beneficiary", value)
  const setAuthorizer = (value: string) => updateState("authorizer", value)

  // stake transaction, opens success modal on success callback
  const { stake } = useStakeTransaction((tx) =>
    openModal(ModalType.SubmitPreAddress, {
      transactionHash: tx.hash,
    })
  )

  const onSubmit = () =>
    stake({ operator, beneficiary, authorizer, amount: stakeAmount })

  //
  // initializes all values to the connected wallet
  //
  useEffect(() => {
    if (account) {
      setOperator(account)
      setBeneficiary(account)
      setAuthorizer(account)
    } else {
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
              amount={stakeAmount}
              setAmount={setStakeAmount}
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
          disabled={+stakeAmount === 0 || +stakeAmount > +maxAmount}
          onClick={onSubmit}
        >
          Stake
        </Button>
      </ModalFooter>
    </>
  )
}

export default withBaseModal(ConfirmStakingParams)
