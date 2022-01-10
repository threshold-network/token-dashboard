import { FC, useCallback, useEffect, useMemo, useState } from "react"
import { Button, HStack, Stack } from "@chakra-ui/react"
import { useModal } from "../hooks/useModal"
import { ModalType } from "../enums"
import { useReduxToken } from "../hooks/useReduxToken"
import { useWeb3React } from "@web3-react/core"
import { useApproveTStaking } from "../web3/hooks/useApproveTStaking"
import { useStakeTransaction } from "../web3/hooks/useStakeTransaction"
import { useTStakingAllowance } from "../web3/hooks/useTStakingAllowance"
import { BigNumber } from "ethers"

const StakingPage: FC = () => {
  const { openModal, updateModalProps } = useModal()
  const { t } = useReduxToken()
  const { active, account } = useWeb3React()
  const { allowance } = useTStakingAllowance()

  // stake transaction, opens success modal on success callback
  const { stake } = useStakeTransaction(() => openModal(ModalType.StakeSuccess))

  //
  // staking form values
  //
  const [amountToStake, setAmountToStake] = useState(0)
  const [operator, setOperator] = useState<string | undefined | null>(
    account || ""
  )
  const [beneficiary, setBeneficiary] = useState<string | undefined | null>(
    account || ""
  )
  const [authorizer, setAuthorizer] = useState<string | undefined | null>(
    account || ""
  )
  const maxAmount = t.balance

  //
  // staking callback - to be invoked after approval, or if already approved
  //
  const submitStakingTx = () =>
    stake(operator, beneficiary, authorizer, amountToStake)

  //
  // approval tx - staking tx callback on success
  //
  const { approveTStaking } = useApproveTStaking(submitStakingTx)

  //
  // onSubmit callback - either start with approval or skip if account is already approved for the amountToStake
  //
  const isApprovedForAmount = useMemo(
    () => BigNumber.from(amountToStake).lt(allowance),
    [amountToStake, allowance]
  )

  const onSubmit = useCallback(
    isApprovedForAmount ? submitStakingTx : approveTStaking,
    [
      isApprovedForAmount,
      account,
      operator,
      beneficiary,
      authorizer,
      amountToStake,
      maxAmount,
    ]
  )

  //
  // initializes all values to the connected wallet
  //
  useEffect(() => {
    if (account) {
      setOperator(account)
      setBeneficiary(account)
      setAuthorizer(account)
    }
  }, [account])

  //
  // updates the staking modal props when state is changed
  //
  useEffect(() => {
    updateModalProps({
      amountToStake,
      setAmountToStake,
      operator,
      setOperator,
      beneficiary,
      setBeneficiary,
      authorizer,
      setAuthorizer,
      maxAmount,
      onSubmit,
    })
  }, [
    amountToStake,
    setAmountToStake,
    operator,
    setOperator,
    beneficiary,
    setBeneficiary,
    authorizer,
    setAuthorizer,
    maxAmount,
    approveTStaking,
    onSubmit,
  ])

  const openStakingModal = async () => {
    openModal(ModalType.ConfirmStakingParams, {
      amountToStake,
      setAmountToStake,
      operator,
      setOperator,
      beneficiary,
      setBeneficiary,
      authorizer,
      setAuthorizer,
      maxAmount,
      onSubmit,
    })
  }

  return (
    <HStack w="100%" align="flex-start" spacing="1rem">
      <Stack w="50%" spacing="1rem">
        <Button disabled={!active || !account} onClick={openStakingModal}>
          STAKE
        </Button>
      </Stack>
    </HStack>
  )
}

export default StakingPage
