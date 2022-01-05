import { FC, useEffect, useMemo, useState } from "react"
import { Button, HStack, Stack } from "@chakra-ui/react"
import { useModal } from "../hooks/useModal"
import { ModalType } from "../enums"
import { useReduxToken } from "../hooks/useReduxToken"
import { useWeb3React } from "@web3-react/core"
import { useApproveTStaking } from "../web3/hooks/useApproveTStaking"
import { useStakeTransaction } from "../web3/hooks/useStakeTransaction"

const StakingPage: FC = () => {
  const { openModal, updateProps } = useModal()
  const { t } = useReduxToken()
  const { account } = useWeb3React()
  const [amountToStake, setAmountToStake] = useState(0)
  const [operator, setOperator] = useState(account)
  const [beneficiary, setBeneficiary] = useState(account)
  const [authorizer, setAuthorizer] = useState(account)
  const maxAmount = t.balance

  const onApprovalSuccess = useMemo(
    () => () => stake(operator, beneficiary, authorizer, amountToStake),
    [operator, beneficiary, authorizer, amountToStake]
  )

  const { approveTStaking } = useApproveTStaking(onApprovalSuccess)
  const { stake } = useStakeTransaction(() => openModal(ModalType.StakeSuccess))

  useEffect(() => {
    updateProps({
      amountToStake,
      setAmountToStake,
      operator,
      setOperator,
      beneficiary,
      setBeneficiary,
      authorizer,
      setAuthorizer,
      maxAmount,
      onSubmit: approveTStaking,
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
  ])

  const initStakingTransaction = async () => {
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
      onSubmit: approveTStaking,
    })
  }

  return (
    <HStack w="100%" align="flex-start" spacing="1rem">
      <Stack w="50%" spacing="1rem">
        <Button onClick={initStakingTransaction}>STAKE</Button>
      </Stack>
    </HStack>
  )
}

export default StakingPage
