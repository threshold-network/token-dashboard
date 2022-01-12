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
import { useReduxStaking } from "../../../hooks/useReduxStaking"
import { useReduxToken } from "../../../hooks/useReduxToken"
import { useTStakingAllowance } from "../../../web3/hooks/useTStakingAllowance"
import { useStakeTransaction } from "../../../web3/hooks/useStakeTransaction"
import { ModalType } from "../../../enums"
import { useApproveTStaking } from "../../../web3/hooks/useApproveTStaking"
import { BigNumber } from "ethers"

const ConfirmStakingParams: FC<BaseModalProps> = () => {
  const { closeModal, openModal } = useModal()
  const {
    t: { balance: maxAmount },
  } = useReduxToken()
  const { account } = useWeb3React()
  const { allowance } = useTStakingAllowance()
  const {
    stakeAmount,
    setStakeAmount,
    operator,
    setOperator,
    beneficiary,
    setBeneficiary,
    authorizer,
    setAuthorizer,
  } = useReduxStaking()

  // stake transaction, opens success modal on success callback
  const { stake } = useStakeTransaction((tx) =>
    openModal(ModalType.SubmitPreAddress, {
      transactionHash: tx.hash,
    })
  )

  //
  // approval tx - staking tx callback on success
  //
  const { approveTStaking } = useApproveTStaking(() =>
    stake(operator, beneficiary, authorizer, stakeAmount)
  )

  //
  // onSubmit callback - either start with approval or skip if account is already approved for the amountToStake
  //
  const isApprovedForAmount = BigNumber.from(stakeAmount).lt(allowance)
  const onSubmit = isApprovedForAmount
    ? () => stake(operator, beneficiary, authorizer, stakeAmount)
    : approveTStaking

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
